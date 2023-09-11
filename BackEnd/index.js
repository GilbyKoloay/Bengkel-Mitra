import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import { Res } from './functions/index.js';



dotenv.config();



const app = express();
const databaseConnectionURI = process.env.DATABASE_CONNECTION_URI;
const port = parseInt(process.env.PORT);



// middlewares
app.use(cors());



// endpoints
app.use((req, res) => {
  Res(res, 404, null, 'Endpoint not found.');
});



// connect to database & run server
mongoose.connect(databaseConnectionURI)
  .then(() => {
    console.log('Database connection successful.');
    app.listen(port, err => {
      if (err) console.log('Failed to run server.', err);
      console.log(`Server is running on port ${port}.`);
    });
  })
  .catch(err => {
    console.log('Database connection failed.', err);
  });
