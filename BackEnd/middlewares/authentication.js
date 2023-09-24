import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

import { Res } from '../functions/index.js';



export default function authentication(req, res, next) {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    const { authorization } = req.headers;
    // if (!authorization) return Res(res, 401, null, 'no authorization');
    if (!authorization) return res.sendFile(path.join(__dirname, '../client/build', 'index.html'));

    const _token = authorization.split(' ')[1];

    jwt.verify(_token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
      // if (err) return Res(res, 401, null, 'token unverified');
      if (err) return res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
      if (decoded) next();
    });
  }
  catch (err) {
    console.log('middlewares/authentication.', err);
    return Res(res, 500);
  }
};
