// controllers

import login from './login.js';

import serviceCreate from './service/create.js';
import serviceGetAll from './service/getAll.js';
import serviceUpdate from './service/update.js';
import serviceDelete from './service/delete.js';

import typeCreate from './type/create.js';
import typeGetAll from './type/getAll.js';
import typeUpdate from './type/update.js';
import typeDelete from './type/delete.js';



const service = {
  create: serviceCreate,
  getAll: serviceGetAll,
  update: serviceUpdate,
  delete: serviceDelete
};

const Type = {
  create: typeCreate,
  getAll: typeGetAll,
  update: typeUpdate,
  delete: typeDelete
};



export { login, service, Type };
