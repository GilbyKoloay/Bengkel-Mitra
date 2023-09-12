// controllers

import login from './login.js';

import serviceCreate from './service/create.js';

import typeCreate from './type/create.js';
import typeGetAll from './type/getAll.js';



const service = {
  create: serviceCreate
};

const Type = {
  create: typeCreate,
  getAll: typeGetAll
};



export { login, service, Type };
