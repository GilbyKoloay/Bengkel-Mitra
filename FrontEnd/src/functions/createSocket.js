import { io } from 'socket.io-client';



export default function createSocket() {
  const socket = io(process.env.REACT_APP_BACKEND_URL);

  return socket;
};
