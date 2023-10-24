import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

import { Res } from '../functions/index.js';



export default function authentication(req, res, next) {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    const { authorization } = req.headers;

    if (!authorization) {
      if (process.env.APP_MODE.toLowerCase() === 'production') return res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
      if (process.env.APP_MODE.toLowerCase() === 'development') return Res(res, 401, null, 'no authorization');
    }

    const _token = authorization.split(' ')[1];

    jwt.verify(_token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        if (process.env.APP_MODE.toLowerCase() === 'production') return res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
        if (process.env.APP_MODE.toLowerCase() === 'development') return Res(res, 401, null, 'token unverified');
      }

      if (decoded) next();
    });
  }
  catch (err) {
    console.log('middlewares/authentication.', err);
    return Res(res, 500);
  }
};
