import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import path from 'path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';

import { login as loginController } from './controllers/index.js';
import { Res } from './functions/index.js';
import { authentication } from './middlewares/index.js';
import router from './router.js';



dotenv.config();



const app = express();
const server = createServer(app);
const io = new Server(
  server,
  {cors: {origin: '*'}}
);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const databaseConnectionURI = process.env.DATABASE_CONNECTION_URI;
const port = parseInt(process.env.PORT);



// // serve front-end
// app.use(express.static(path.join(__dirname, 'client/build')));
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
// });



// middlewares
app.use(cors());
app.use(express.json());
app.post('/api/login', loginController);
app.use(authentication);



// protected endpoints
app.use('/api', router);



// 404 endpoint handler
app.use((req, res) => {
  Res(res, 404, null, 'Endpoint not found.');
  // res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});



// socket.io
io.on('connection', socket => {
  // service
  socket.on('service-create', () => io.emit('service-create'));
  socket.on('service-update', payload => {
    io.emit('service-create');
    io.emit('service-update', {_id: payload._id});
  });
  socket.on('service-delete', payload => {
    io.emit('service-create');
    io.emit('service-delete', {_id: payload._id});
  });

  // type
  socket.on('type-create', () => io.emit('type-create'));
  socket.on('type-update', _id => {
    io.emit('type-create');
    io.emit('type-update', _id);
  });
  socket.on('type-delete', _id => {
    io.emit('type-create');
    io.emit('type-delete', _id);
  });

  // transaction
  socket.on('transaction-create', () => io.emit('transaction-create'));
  socket.on('transaction-update', _id => {
    io.emit('transaction-create');
    io.emit('transaction-update', _id);
  });
  socket.on('transaction-delete', _id => {
    io.emit('transaction-create');
    io.emit('transaction-delete', _id);
  });
});



// connect to database & run server
mongoose.connect(databaseConnectionURI)
  .then(() => {
    console.log('Database connection successful.');
    server.listen(port, err => {
      if (err) console.log('Failed to run server.', err);
      console.log(`Server is running on port ${port}.`);
    });
  })
  .catch(err => {
    console.log('Database connection failed.', err);
  });
