import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import open from 'open';
import path from 'path';
import { fileURLToPath } from 'url';

import { login as loginController } from './controllers/index.js';
import { Res } from './functions/index.js';
import { authentication } from './middlewares/index.js';
import router from './router.js';



dotenv.config();



const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = parseInt(process.env.PORT);



// serve front-end (if is in prodution mode)
if (process.env.APP_MODE.toLowerCase() === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}



// middlewares
app.use(cors());
app.use(express.json());
app.post('/api/login', loginController);
app.use(authentication);



// protected endpoints
app.use('/api', router);



// 404 endpoint handler
app.use((req, res) => {
  if (process.env.APP_MODE.toLowerCase() === 'production') return res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  else if (process.env.APP_MODE.toLowerCase() === 'development') return Res(res, 404, null, 'Endpoint not found.');
});



// run server
app.listen(port, err => {
  if (err) console.log('Failed to run server.', err);
  console.log(`Server is running on port ${port}.`);
  (async () => {
    await open(`http://localhost:${port}`);
  })();
});
