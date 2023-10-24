import jwt from 'jsonwebtoken';

import { Res } from '../functions/index.js';



function createToken() {
  return jwt.sign(
    {_id: crypto.randomUUID()},
    process.env.SECRET_KEY,
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
      payload.username !== process.env.ADMIN_USERNAME ||
      payload.password !== process.env.ADMIN_PASSWORD
    ) return Res(res, 401, null, 'Nama pengguna atau kata sandi salah.');

    const result = createToken();

    return Res(res, 200, result);
  }
  catch (err) {
    console.log('controllers/login.', err);
    return Res(res, 500);
  }
};
