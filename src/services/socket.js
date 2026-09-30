import { io } from 'socket.io-client';
import { BASE_URL } from './config';
export const createSocket = () => io(BASE_URL, {
  autoConnect: false,
  auth: callback => callback({token:localStorage.getItem('token')}),
});
