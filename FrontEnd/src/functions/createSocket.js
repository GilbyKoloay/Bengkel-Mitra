import { io } from 'socket.io-client';



const backendURL = process.env.REACT_APP_BACKEND_URL;



export default function createSocket() {
  return io(backendURL);
};
