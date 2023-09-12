import { Type as TypeCollection } from '../../database/models/index.js';
import { Res } from '../../functions/index.js';



export default async function create(req, res) {
  try {
    const result = await TypeCollection.find({}, {__v: 0});

    if (!result) throw({message: 'Terjadi kesalahan di server.'});
    return Res(res, 200, result);
  }
  catch (err) {
    return Res(res, 500, null, 'Terjadi kesalahan di server.');
  }
};
