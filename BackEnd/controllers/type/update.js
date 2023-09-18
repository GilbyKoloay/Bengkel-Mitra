import { Type as typeCollection } from '../../database/models/index.js';
import { Res, stringValidator, documentValidator } from '../../functions/index.js';



export default async function update(req, res) {
  try {
    const payload = {
      _id: documentValidator(req.body?._id),
      name: stringValidator(req.body?.name),
      note: stringValidator(req.body?.note)
    };
    if (!payload._id) return Res(res, 400, null, '_id tidak valid.')
    if (!payload.name) return Res(res, 400, null, 'Nama tidak valid.');

    const result = await typeCollection.updateOne({
      _id: payload._id
    }, {
      $set: {
        name: payload.name,
        note: payload.note
      }
    });
    if (!result || !result?.acknowledged) throw new Error('Terjadi kesalahan di server.');
    if (!result.matchedCount) return Res(res, 404, null, '_id tidak valid.');
    if (!result.modifiedCount) return Res(res, 400, null, 'Tidak ada perubahan yang dibuat.');
    return Res(res, 200);
  }
  catch (err) {
    if (err?.message.includes('E11000 duplicate key error collection: BengkelMitra.Types')) {
      if (err.message.split('{ ')[1].split(':')[0] === 'name') return Res(res, 400, null, 'Nama sudah ada.');
    }
    
    console.log('controllers/type/update.', err);
    return Res(res, 500, null, 'Terjadi kesalahan di server.');
  }
};
