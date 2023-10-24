import { io } from 'socket.io-client';



export default function createSocket() {
  return io(process.env.REACT_APP_BACKEND_URL);
};
