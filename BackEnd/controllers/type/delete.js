import { Type as TypeCollection } from '../../database/models/index.js';
import { Res, stringValidator, documentValidator } from '../../functions/index.js';



export default async function update(req, res) {
  try {
    const payload = {
      _id: documentValidator(req.body?._id)
    };

    if (!payload._id) return Res(res, 400, null, '_id tidak valid.')

    const result = await TypeCollection.updateOne({
      _id: payload._id
    }, {
      $set: {
        isDeleted: true
      }
    });

    if (!result || !result?.acknowledged) throw new Error('Terjadi kesalahan di server.');
    if (!result.matchedCount) return Res(res, 404, null, '_id tidak valid.');
    return Res(res, 200);
  }
  catch (err) {
    console.log('controllers/type/delete.', err);
    return Res(res, 500, null, 'Terjadi kesalahan di server.');
  }
};
