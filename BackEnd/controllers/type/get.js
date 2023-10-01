import { Type as typeCollection } from '../../database/models/index.js';
import { Res } from '../../functions/index.js';



export default async function get(req, res) {
  try {
    const result = await typeCollection.find({}, {__v: 0});

    if (!result) throw new Error('Terjadi kesalahan di server.');
    return Res(res, 200, result);
  }
  catch (err) {
    console.log('controllers/type/get.', err);
    return Res(res, 500, null, 'Terjadi kesalahan di server.');
  }
};
