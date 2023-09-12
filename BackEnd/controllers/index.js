// controllers

import login from './login.js';

import serviceCreate from './service/create.js';

import typeCreate from './type/create.js';
import typeGetAll from './type/getAll.js';
import typeUpdate from './type/update.js';



const service = {
  create: serviceCreate
};

const Type = {
  create: typeCreate,
  getAll: typeGetAll,
  update: typeUpdate
};



export { login, service, Type };
