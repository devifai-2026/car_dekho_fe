// Single source for the backend base URL (shared by REST fetches and the socket).
// Dev: empty -> same-origin (Vite proxy). Prod: set VITE_API_URL to the Render URL.
export const API_URL = import.meta.env.VITE_API_URL || '';

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
