import express from 'express';

import {
  login as loginController,
  service as serviceController,
  Type as typeController
} from './controllers/index.js';



const router = express.Router();

router.post('/login', loginController);

router.post('/service/create', serviceController.create);

router.post('/type/create', typeController.create);



export default router;
