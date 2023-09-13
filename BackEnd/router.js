import express from 'express';

import {
  login as loginController,
  service as serviceController,
  Type as typeController
} from './controllers/index.js';



const router = express.Router();

router.post('/login', loginController);

router.post('/service/create', serviceController.create);
router.get('/service/get-all', serviceController.getAll);
router.put('/service/update', serviceController.update);
router.delete('/service/delete', serviceController.delete);

router.post('/type/create', typeController.create);
router.get('/type/get-all', typeController.getAll);
router.put('/type/update', typeController.update);
router.delete('/type/delete', typeController.delete);



export default router;
