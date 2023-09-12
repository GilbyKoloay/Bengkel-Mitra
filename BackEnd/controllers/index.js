// controllers

import login from './login.js';

import serviceCreate from './service/create.js';

import typeCreate from './type/create.js';



const service = {
  create: serviceCreate
};

const Type = {
  create: typeCreate
};



export { login, service, Type };
