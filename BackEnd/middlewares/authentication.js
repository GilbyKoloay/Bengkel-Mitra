import jwt from 'jsonwebtoken';

import { Res } from '../functions/index.js';



export default function authentication(req, res, next) {
  try {
    const { authorization } = req.headers;
    if (!authorization) return Res(res, 401, null, 'no authorization');

    const _token = authorization.split(' ')[1];

    jwt.verify(_token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
      if (err) return Res(res, 401, null, 'token unverified');
      if (decoded) next();
    });
  }
  catch (err) {
    console.log('middlewares/authentication.', err);
    return Res(res, 500);
  }
};
