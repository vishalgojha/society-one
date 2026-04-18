export async function invokeLLM(payload) {
  const endpoint = import.meta.env.VITE_LLM_API_URL || '/api/llm';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'LLM request failed');
  }

  return response.json();
}
