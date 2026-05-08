// Simple API utility for HookBoard frontend.
// In development, relative URLs are forwarded by Vite's proxy.
const API_ORIGIN = import.meta.env.VITE_API_BASE_URL || '';
const API_BASE = `${API_ORIGIN}/api`;

export async function getHooks() {
  const res = await fetch(`${API_BASE}/hooks`);
  if (!res.ok) throw new Error('Failed to fetch hooks');
  return res.json();
}

export async function createHook(data) {
  const res = await fetch(`${API_BASE}/hooks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create hook');
  return res.json();
}

export async function getRequests(hookId) {
  const res = await fetch(`${API_BASE}/hooks/${hookId}/requests`);
  if (!res.ok) throw new Error('Failed to fetch requests');
  return res.json();
}

export async function sendTestWebhook(hookId, payload) {
  const res = await fetch(`${API_ORIGIN}/h/${hookId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to send webhook');
  return res.json();
}

export async function exportRequests(hookId) {
  const res = await fetch(`${API_BASE}/hooks/${hookId}/requests`);
  if (!res.ok) throw new Error('Failed to fetch requests');
  const data = await res.json();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `hook_${hookId}_requests.json`;
  a.click();
  URL.revokeObjectURL(url);
}
