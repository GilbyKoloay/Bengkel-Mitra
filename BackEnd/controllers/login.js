import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

import { Res } from '../functions/index.js';



function createToken() {
  return jwt.sign(
    {_id: new Types.ObjectId().toString()},
    process.env.TOKEN_SECRET_KEY,
    {expiresIn: '12h'}
  );
}



export default async function login(req, res) {
  try {
    const payload = {
      username: req.body?.username,
      password: req.body?.password
    };
    
    if (
      payload.username !== 'admin' ||
      payload.password !== 'admin'
    ) return Res(res, 401, null, 'Nama pengguna atau kata sandi salah.');

    const result = createToken();

    return Res(res, 200, result);
  }
  catch (err) {
    console.log('controllers/login.', err);
    return Res(res, 500);
  }
};
