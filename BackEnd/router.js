import express from 'express';

import {
  login as loginController,
  service as serviceController
} from './controllers/index.js';



const router = express.Router();

router.post('/login', loginController);

router.post('/service/create', serviceController.create);



export default router;
