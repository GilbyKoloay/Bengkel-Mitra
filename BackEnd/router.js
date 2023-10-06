import express from 'express';

import {
  // service as serviceController,
  // Type as typeController,
  // transaction as transactionController,
  invoice as invoiceController
} from './controllers/index.js';



const router = express.Router();

// router.post('/service', serviceController.post);
// router.get('/service', serviceController.get);
// router.put('/service', serviceController.put);
// router.delete('/service', serviceController.delete);

// router.post('/type', typeController.post);
// router.get('/type', typeController.get);
// router.put('/type', typeController.put);
// router.delete('/type', typeController.delete);

// router.post('/transaction', transactionController.post);
// router.get('/transaction', transactionController.get);
// router.put('/transaction', transactionController.put);
// router.delete('/transaction', transactionController.delete);

router.post('/invoice', invoiceController.post);
router.get('/invoice', invoiceController.get);
router.put('/invoice', invoiceController.put);
router.delete('/invoice', invoiceController.delete);



export default router;
