// Single source for the backend base URL (shared by REST fetches and the socket).
// - Dev: empty -> same-origin, Vite proxies /api + /socket.io to the local backend.
// - Prod: use VITE_API_URL if set (Netlify env), else fall back to the deployed backend
//   so the app never silently connects to its own static host (which has no socket server).
const FALLBACK_API_URL = 'https://car-dekho-be.onrender.com';
export const API_URL =
  import.meta.env.VITE_API_URL || (import.meta.env.PROD ? FALLBACK_API_URL : '');

export const apiUrl = (path) => `${API_URL}${path}`;

/**
 * Ping the backend health endpoint. On Render's free tier the dyno spins down,
 * so calling this on app load WARMS it up — the first recommend then isn't
 * blocked by a cold start. Returns the health JSON, or null if unreachable.
 */
export async function pingHealth() {
  try {
    const res = await fetch(apiUrl('/api/health'));
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}
