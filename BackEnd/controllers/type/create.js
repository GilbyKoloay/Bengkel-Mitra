import { Type as TypeCollection } from '../../database/models/index.js';
import { Res, stringValidator, numberValidator } from '../../functions/index.js';



export default async function create(req, res) {
  try {
    const payload = {
      name: stringValidator(req.body?.name)
    };

    if (!payload.name) return Res(res, 400, null, 'Nama tidak valid');

    const result = await TypeCollection.create(payload);

    if (!result) throw({message: 'Terjadi kesalahan di server.'});
    return Res(res, 200);
  }
  catch (err) {
    if (err.message.includes('E11000 duplicate key error collection:')) {
      if (err.message.split('{ ')[1].split(':')[0]) return Res(res, 400, null, 'Nama sudah ada.');
    }

    console.log('controllers/type/create.', err);
    return Res(res, 500, null, 'Terjadi kesalahan di server.');
  }
};
