import express from 'express';

import { invoice as invoiceController } from './controllers/index.js';



const router = express.Router();

router.post('/invoice', invoiceController.post);
router.get('/invoice', invoiceController.get);
router.put('/invoice', invoiceController.put);
router.delete('/invoice', invoiceController.delete);



export default router;
