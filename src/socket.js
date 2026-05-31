import { io } from 'socket.io-client';
import { API_URL } from './utils/api.js';

// Dev: API_URL is empty -> same-origin, and Vite proxies /socket.io to the backend.
// Prod (Netlify): VITE_API_URL points the socket at the Render backend URL.
//
// Force the WebSocket transport. Long-polling gets stuck behind Render's proxy
// (seen as dozens of hanging socket.io XHRs); a single WebSocket connects in ~1s
// and is far more reliable for the long-running recommend flow.
export const socket = io(API_URL || '/', {
  autoConnect: true,
  transports: ['websocket'],
});
