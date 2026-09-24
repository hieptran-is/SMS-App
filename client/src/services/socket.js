import { io } from 'socket.io-client';

const socketUrl = import.meta.env.VITE_SOCKET_URL || `${window.location.protocol}//${window.location.hostname}:5000`;

export const createSocket = () => io(socketUrl, { transports: ['websocket', 'polling'] });
