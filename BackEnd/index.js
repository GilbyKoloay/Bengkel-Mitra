import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';

import { Res } from './functions/index.js';
import router from './router.js';



dotenv.config();



const app = express();
const server = createServer(app);
const io = new Server(
  server,
  {cors: {origin: '*'}}
);
const databaseConnectionURI = process.env.DATABASE_CONNECTION_URI;
const port = parseInt(process.env.PORT);



// middlewares
app.use(cors());
app.use(express.json());



// endpoints
app.use('/api', router);
app.use((req, res) => {
  Res(res, 404, null, 'Endpoint not found.');
});



// socket.io
io.on('connection', socket => {

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
