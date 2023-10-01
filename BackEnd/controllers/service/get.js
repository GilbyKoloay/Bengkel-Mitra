import { service as serviceCollection } from '../../database/models/index.js';
import { Res } from '../../functions/index.js';



export default async function get(req, res) {
  try {
    const result = await serviceCollection.find({}, {__v: 0}).populate(['type']);

    if (!result) throw new Error('Terjadi kesalahan di server.');
    return Res(res, 200, result);
  }
  catch (err) {
    console.log('controllers/service/get.', err);
    return Res(res, 500, null, 'Terjadi kesalahan di server.');
  }
};
