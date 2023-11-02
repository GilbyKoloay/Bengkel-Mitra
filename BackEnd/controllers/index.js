// controllers

import login from './login.js';

import invoicePost from './invoice/post.js';
import invoiceGet from './invoice/get.js';
import invoicePut from './invoice/put.js';
import invoiceDelete from './invoice/delete.js';



const invoice = {
  post: invoicePost,
  get: invoiceGet,
  put: invoicePut,
  delete: invoiceDelete
};



export { login, invoice };
