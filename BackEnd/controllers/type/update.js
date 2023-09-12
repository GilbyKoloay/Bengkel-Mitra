import { Type as TypeCollection } from '../../database/models/index.js';
import { Res, stringValidator, numberValidator, documentValidator } from '../../functions/index.js';



export default async function update(req, res) {
  try {
    const payload = {
      _id: documentValidator(req.body?._id),
      name: stringValidator(req.body?.name)
    };

    if (!payload._id) return Res(res, 400, null, '_id tidak valid.')
    if (!payload.name) return Res(res, 400, null, 'Nama tidak valid.');

    const result = await TypeCollection.updateOne({
      _id: payload._id
    }, {
      $set: {
        name: payload.name
      }
    });

    if (!result || !result?.acknowledged) throw new Error('Terjadi kesalahan di server.');
    if (!result.matchedCount) return Res(res, 404, null, '_id tidak valid.');
    if (!result.modifiedCount) return Res(res, 400, null, 'Tidak ada perubahan yang dibuat.');
    return Res(res, 200);
  }
  catch (err) {
    if (err.message.includes('E11000 duplicate key error collection:')) {
      if (err.message.split('{ ')[1].split(':')[0]) return Res(res, 400, null, 'Nama sudah ada.');
    }

    console.log('controllers/type/update.', err);
    return Res(res, 500, null, 'Terjadi kesalahan di server.');
  }
};
