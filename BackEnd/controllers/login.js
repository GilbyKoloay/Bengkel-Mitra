import { Res } from '../functions/index.js';



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

    return Res(res, 200, 'token');
  }
  catch (err) {
    console.log('controllers/login.', err);
    return Res(res, 500);
  }
};
