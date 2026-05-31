import { io } from 'socket.io-client';
import { API_URL } from './utils/api.js';

// Dev: API_URL is empty -> same-origin, and Vite proxies /socket.io to the backend.
// Prod (Netlify): VITE_API_URL points the socket at the Render backend URL.
export const socket = io(API_URL || '/', { autoConnect: true });
