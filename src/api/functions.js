import { entities } from '@/api/entities';

const endpointMap = {
  verifyVisitorSecurity: '/functions/v1/verify-visitor',
  extractVisitorInfo: '/functions/v1/extract-visitor-info',
  generateVisitorReport: '/functions/v1/generate-report',
  notifyPreApprovedVisitor: '/functions/v1/notify-visitor',
  listUsers: '/functions/v1/list-users',
};

const toCsv = (rows) => {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const csvRows = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((header) => JSON.stringify(row[header] ?? ''))
        .join(',')
    ),
  ];
  return csvRows.join('\n');
};

export async function invokeFunction(name, body = {}) {
  if (name === 'exportVisitors') {
    const visitors = await entities.VisitorEntry.filter(body.filters || {}, body.orderBy || '-checkInTime');
    return { data: { csv: toCsv(visitors), visitors } };
  }

  const path = endpointMap[name];
  if (!path) {
    throw new Error(`Unsupported function: ${name}`);
  }

  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Function ${name} failed`);
  }

  const data = await response.json();
  return { data };
}
