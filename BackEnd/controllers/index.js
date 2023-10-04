// controllers

import login from './login.js';

import servicePost from './service/post.js';
import serviceGet from './service/get.js';
import servicePut from './service/put.js';
import serviceDelete from './service/delete.js';

import typePost from './type/post.js';
import typeGet from './type/get.js';
import typePut from './type/put.js';
import typeDelete from './type/delete.js';

import transactionPost from './transaction/post.js';
import transactionGet from './transaction/get.js';
import transactionPut from './transaction/put.js';
import transactionDelete from './transaction/delete.js';

import invoicePost from './invoice/post.js';



const service = {
  post: servicePost,
  get: serviceGet,
  put: servicePut,
  delete: serviceDelete
};

const Type = {
  post: typePost,
  get: typeGet,
  put: typePut,
  delete: typeDelete
};

const transaction = {
  post: transactionPost,
  get: transactionGet,
  put: transactionPut,
  delete: transactionDelete
};

const invoice = {
  post: invoicePost,
  get: invoiceGet,
  put: invoicePut,
  delete: invoiceDelete
};



export {
  login,
  service,
  Type,
  transaction,
  invoice
};
