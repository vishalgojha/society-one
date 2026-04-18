import { createServer } from 'node:http';
import { mkdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import makeWASocket, {
  Browsers,
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys';
import QRCode from 'qrcode';

const ENV_PATH = join(process.cwd(), '.env');

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  const content = readFileSync(filePath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(ENV_PATH);

const PORT = Number(process.env.AI_BRIDGE_PORT || 3011);
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
const OPENROUTER_URL = process.env.OPENROUTER_URL || 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'qwen/qwen-2.5-7b-instruct';
const WHATSAPP_AUTH_DIR = process.env.WHATSAPP_AUTH_DIR || '.baileys-auth';

const MODEL_BY_TASK = {
  default: 'qwen3:8b',
  security: 'qwen3:8b',
  reporting: 'qwen3:8b',
  extract: 'qwen2.5:3b',
  ocr: 'llava-phi3:latest',
  vision: 'llava-phi3:latest',
  notification: 'qwen2.5:0.5b',
  classify: 'qwen2.5:3b',
  quick: 'llama3.2:1b',
};

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const whatsappState = {
  socket: null,
  status: 'idle',
  qr: null,
  qrDataUrl: null,
  connectedJid: null,
  lastError: null,
  updatedAt: null,
  isStarting: false,
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, JSON_HEADERS);
  response.end(JSON.stringify(payload));
}

function collectBody(request) {
  return new Promise((resolve, reject) => {
    let raw = '';
    request.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 5_000_000) {
        reject(new Error('Request too large'));
        request.destroy();
      }
    });
    request.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    request.on('error', reject);
  });
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }
  return response.json();
}

async function fetchImageAsBase64(imageUrl) {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Image fetch failed: ${response.status}`);
  }
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.startsWith('image/')) {
    throw new Error('Provided URL is not an image');
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer).toString('base64');
}

async function listAvailableModels() {
  const response = await fetchJson(`${OLLAMA_URL}/api/tags`);
  return new Set((response.models || []).map((item) => item.name));
}

function normalizePhoneToJid(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) throw new Error('A valid phone number is required');
  return `${digits}@s.whatsapp.net`;
}

async function updateWhatsappQr(qr) {
  whatsappState.qr = qr;
  whatsappState.qrDataUrl = qr ? await QRCode.toDataURL(qr, { margin: 1, width: 280 }) : null;
}

function getWhatsappSnapshot() {
  return {
    status: whatsappState.status,
    connectedJid: whatsappState.connectedJid,
    hasQr: Boolean(whatsappState.qr),
    qrDataUrl: whatsappState.qrDataUrl,
    lastError: whatsappState.lastError,
    updatedAt: whatsappState.updatedAt,
  };
}

async function startWhatsAppBridge(forceRestart = false) {
  if (whatsappState.isStarting) return getWhatsappSnapshot();
  if (whatsappState.socket && !forceRestart) return getWhatsappSnapshot();

  whatsappState.isStarting = true;
  whatsappState.status = 'starting';
  whatsappState.updatedAt = new Date().toISOString();
  whatsappState.lastError = null;

  try {
    if (forceRestart && whatsappState.socket?.end) {
      try {
        whatsappState.socket.end(undefined);
      } catch {
        // ignore stale socket close failures
      }
      whatsappState.socket = null;
    }

    const authDir = join(process.cwd(), WHATSAPP_AUTH_DIR);
    mkdirSync(authDir, { recursive: true });

    const { state, saveCreds } = await useMultiFileAuthState(authDir);
    const { version } = await fetchLatestBaileysVersion();

    const socket = makeWASocket({
      version,
      auth: state,
      browser: Browsers.ubuntu('SocietyOne'),
      printQRInTerminal: false,
      syncFullHistory: false,
      markOnlineOnConnect: false,
    });

    whatsappState.socket = socket;

    socket.ev.on('creds.update', saveCreds);
    socket.ev.on('connection.update', async (update) => {
      if (update.qr) {
        whatsappState.status = 'pairing';
        await updateWhatsappQr(update.qr);
      }

      if (update.connection === 'open') {
        whatsappState.status = 'connected';
        whatsappState.connectedJid = socket.user?.id || null;
        whatsappState.lastError = null;
        whatsappState.updatedAt = new Date().toISOString();
        await updateWhatsappQr(null);
      }

      if (update.connection === 'close') {
        const statusCode = update.lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect =
          statusCode !== DisconnectReason.loggedOut &&
          statusCode !== DisconnectReason.badSession;

        whatsappState.status = shouldReconnect ? 'reconnecting' : 'disconnected';
        whatsappState.connectedJid = null;
        whatsappState.updatedAt = new Date().toISOString();
        whatsappState.lastError = update.lastDisconnect?.error?.message || null;

        if (shouldReconnect) {
          setTimeout(() => {
            startWhatsAppBridge(true).catch((error) => {
              whatsappState.lastError = error.message;
              whatsappState.status = 'error';
            });
          }, 2000);
        } else {
          whatsappState.socket = null;
        }
      }
    });

    whatsappState.updatedAt = new Date().toISOString();
    return getWhatsappSnapshot();
  } finally {
    whatsappState.isStarting = false;
  }
}

async function stopWhatsAppBridge() {
  if (whatsappState.socket?.logout) {
    try {
      await whatsappState.socket.logout();
    } catch {
      // logout can fail if the session is already gone
    }
  }
  if (whatsappState.socket?.end) {
    try {
      whatsappState.socket.end(undefined);
    } catch {
      // ignore
    }
  }

  whatsappState.socket = null;
  whatsappState.status = 'disconnected';
  whatsappState.connectedJid = null;
  whatsappState.lastError = null;
  whatsappState.updatedAt = new Date().toISOString();
  await updateWhatsappQr(null);
  return getWhatsappSnapshot();
}

async function sendWhatsAppMessage({ phone, message }) {
  if (!whatsappState.socket || whatsappState.status !== 'connected') {
    throw new Error('WhatsApp is not connected');
  }
  if (!message) {
    throw new Error('Message is required');
  }

  const jid = normalizePhoneToJid(phone);
  const result = await whatsappState.socket.sendMessage(jid, { text: message });
  return {
    ok: true,
    jid,
    id: result?.key?.id || null,
  };
}

async function resolveModelRoute(task = 'default', explicitModel) {
  const available = await listAvailableModels();
  const preferredModel = explicitModel || MODEL_BY_TASK[task] || MODEL_BY_TASK.default;
  const fallbackChain = [preferredModel, MODEL_BY_TASK.default, 'qwen2.5:3b', 'llama3.2:1b']
    .filter(Boolean)
    .filter((item, index, array) => array.indexOf(item) === index);
  const selectedModel = fallbackChain.find((candidate) => available.has(candidate));

  return {
    task,
    preferredModel,
    selectedModel: selectedModel || null,
    fallbackChain,
    availableModels: [...available],
    source: selectedModel ? 'ollama' : (OPENROUTER_API_KEY ? 'openrouter-fallback' : 'unavailable'),
  };
}

async function invokeOllama({ model, prompt, images, schema, temperature = 0.2 }) {
  const payload = {
    model,
    prompt,
    stream: false,
    options: { temperature },
  };
  if (schema) payload.format = schema;
  if (images?.length) payload.images = images;

  const response = await fetchJson(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return response.response || '';
}

async function invokeOpenRouter({ prompt, schema }) {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter fallback is not configured');
  }

  const body = {
    model: OPENROUTER_MODEL,
    messages: [{ role: 'user', content: prompt }],
  };

  if (schema) {
    body.response_format = {
      type: 'json_schema',
      json_schema: {
        name: 'societyone_schema',
        strict: true,
        schema,
      },
    };
  }

  const response = await fetchJson(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  return response.choices?.[0]?.message?.content || '';
}

function tryParseJson(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

async function invokeRoutedModel({ task = 'default', prompt, response_json_schema, imageUrls, model }) {
  const route = await resolveModelRoute(task, model);
  const selectedModel = route.selectedModel;
  const images = imageUrls?.length ? await Promise.all(imageUrls.map(fetchImageAsBase64)) : undefined;

  let raw;
  let usedModel = selectedModel || route.preferredModel;

  try {
    if (!selectedModel) throw new Error('No preferred Ollama model available');
    raw = await invokeOllama({
      model: selectedModel,
      prompt,
      images,
      schema: response_json_schema,
      temperature: task === 'notification' || task === 'quick' ? 0.35 : 0.15,
    });
  } catch (error) {
    raw = await invokeOpenRouter({ prompt, schema: response_json_schema });
    usedModel = `${OPENROUTER_MODEL} (openrouter fallback)`;
  }

  const parsed = response_json_schema ? tryParseJson(raw) : null;
  return {
    model: usedModel,
    task,
    raw,
    parsed,
    route,
  };
}

async function handleLlm(body) {
  const result = await invokeRoutedModel(body);
  return body.response_json_schema ? (result.parsed || { raw: result.raw, model: result.model }) : result;
}

async function handleVerifyVisitor(body) {
  const schema = {
    type: 'object',
    properties: {
      riskLevel: { type: 'string', enum: ['low', 'medium', 'high'] },
      securityFlags: { type: 'array', items: { type: 'string' } },
      isPreApproved: { type: 'boolean' },
      recommendation: { type: 'string' },
    },
    required: ['riskLevel', 'securityFlags', 'isPreApproved', 'recommendation'],
    additionalProperties: false,
  };

  const prompt = [
    'You are a residential society security assistant.',
    'Assess the visitor and return strict JSON only.',
    `Name: ${body.visitorName || 'unknown'}`,
    `Phone: ${body.visitorMobile || 'missing'}`,
    `Purpose: ${body.visitorPurpose || 'unknown'}`,
    `Flat or room: ${body.flatOrRoom || 'unknown'}`,
    `Visitor type: ${body.visitorType || 'unknown'}`,
    'Mark medium or high risk only when there is a clear reason.',
  ].join('\n');

  const result = await invokeRoutedModel({
    task: 'security',
    prompt,
    response_json_schema: schema,
  });

  return {
    ...result.parsed,
    model: result.model,
  };
}

async function handleExtractVisitorInfo(body) {
  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      id_type: { type: 'string' },
      nationality: { type: 'string' },
      id_number_last4: { type: 'string' },
    },
    required: ['name', 'id_type', 'nationality', 'id_number_last4'],
    additionalProperties: false,
  };

  const result = await invokeRoutedModel({
    task: 'vision',
    prompt: 'Read the identity card image and return strict JSON only. If a field is unknown, return an empty string.',
    response_json_schema: schema,
    imageUrls: body.idPhotoUrl ? [body.idPhotoUrl] : [],
  });

  return {
    extracted: result.parsed,
    model: result.model,
  };
}

async function handleGenerateReport(body) {
  const schema = {
    type: 'object',
    properties: {
      summary: { type: 'string' },
      highlights: { type: 'array', items: { type: 'string' } },
      concerns: { type: 'array', items: { type: 'string' } },
    },
    required: ['summary', 'highlights', 'concerns'],
    additionalProperties: false,
  };

  const result = await invokeRoutedModel({
    task: 'reporting',
    prompt: `Summarize these society visitor report inputs as strict JSON:\n${JSON.stringify(body)}`,
    response_json_schema: schema,
  });

  return {
    ok: true,
    report: result.parsed,
    model: result.model,
  };
}

async function handleNotifyVisitor(body) {
  const schema = {
    type: 'object',
    properties: {
      title: { type: 'string' },
      message: { type: 'string' },
    },
    required: ['title', 'message'],
    additionalProperties: false,
  };

  const result = await invokeRoutedModel({
    task: 'notification',
    prompt: `Write a short resident notification for a pre-approved visitor named ${body.visitorName || 'visitor'}. Return strict JSON only.`,
    response_json_schema: schema,
  });

  return {
    ok: true,
    notification: result.parsed,
    model: result.model,
    whatsapp:
      body.phone && whatsappState.status === 'connected'
        ? await sendWhatsAppMessage({
            phone: body.phone,
            message: `${result.parsed.title}\n\n${result.parsed.message}`,
          }).catch((error) => ({ ok: false, error: error.message }))
        : { ok: false, error: 'WhatsApp not requested or not connected' },
  };
}

async function handleListUsers() {
  return { users: [], source: 'local-ai-bridge' };
}

const server = createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    response.writeHead(204, JSON_HEADERS);
    response.end();
    return;
  }

  try {
    const url = new URL(request.url || '/', `http://${request.headers.host}`);

    if (request.method === 'GET' && url.pathname === '/health') {
      sendJson(response, 200, { ok: true, ollama: OLLAMA_URL });
      return;
    }

    if (request.method === 'GET' && url.pathname === '/debug/model-route') {
      const task = url.searchParams.get('task') || 'default';
      const model = url.searchParams.get('model') || undefined;
      sendJson(response, 200, await resolveModelRoute(task, model));
      return;
    }

    if (request.method === 'GET' && url.pathname === '/whatsapp/status') {
      sendJson(response, 200, getWhatsappSnapshot());
      return;
    }

    if (request.method !== 'POST') {
      sendJson(response, 404, { error: 'Not found' });
      return;
    }

    const body = await collectBody(request);

    if (url.pathname === '/api/llm') {
      sendJson(response, 200, await handleLlm(body));
      return;
    }

    if (url.pathname === '/functions/v1/verify-visitor') {
      sendJson(response, 200, await handleVerifyVisitor(body));
      return;
    }

    if (url.pathname === '/functions/v1/extract-visitor-info') {
      sendJson(response, 200, await handleExtractVisitorInfo(body));
      return;
    }

    if (url.pathname === '/functions/v1/generate-report') {
      sendJson(response, 200, await handleGenerateReport(body));
      return;
    }

    if (url.pathname === '/functions/v1/notify-visitor') {
      sendJson(response, 200, await handleNotifyVisitor(body));
      return;
    }

    if (url.pathname === '/functions/v1/list-users') {
      sendJson(response, 200, await handleListUsers(body));
      return;
    }

    if (url.pathname === '/whatsapp/connect') {
      sendJson(response, 200, await startWhatsAppBridge(body.force === true));
      return;
    }

    if (url.pathname === '/whatsapp/disconnect') {
      sendJson(response, 200, await stopWhatsAppBridge());
      return;
    }

    if (url.pathname === '/whatsapp/send') {
      sendJson(response, 200, await sendWhatsAppMessage(body));
      return;
    }

    sendJson(response, 404, { error: 'Not found' });
  } catch (error) {
    sendJson(response, 500, { error: error.message || 'Internal server error' });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`SocietyOne AI bridge listening on http://127.0.0.1:${PORT}`);
});

startWhatsAppBridge(false).catch((error) => {
  whatsappState.status = 'error';
  whatsappState.lastError = error.message;
  whatsappState.updatedAt = new Date().toISOString();
});
