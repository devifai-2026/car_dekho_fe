import { io } from 'socket.io-client';

// Same-origin; Vite proxies /socket.io to the Express server in dev.
export const socket = io({ autoConnect: true });
