import { io } from 'socket.io-client';

// Dev: empty -> same-origin, and Vite proxies /socket.io to the backend.
// Prod (Netlify): set VITE_API_URL to the Render backend URL (e.g. https://car-dekho-be.onrender.com).
const URL = import.meta.env.VITE_API_URL || '/';

export const socket = io(URL, { autoConnect: true });
