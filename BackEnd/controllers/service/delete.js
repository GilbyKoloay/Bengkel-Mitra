import { service as serviceCollection } from '../../database/models/index.js';
import { Res, documentValidator } from '../../functions/index.js';



export default async function deleteDocument(req, res) {
  try {
    const payload = {
      _id: documentValidator(req.body?._id)
    };

    if (!payload._id) return Res(res, 400, null, '_id tidak valid.')

    const result = await serviceCollection.deleteOne({
      _id: payload._id
    });

    if (!result || !result?.acknowledged) throw new Error('Terjadi kesalahan di server.');
    if (!result.deletedCount) return Res(res, 404, null, '_id tidak valid.');
    return Res(res, 200);
  }
  catch (err) {
    console.log('controllers/service/delete.', err);
    return Res(res, 500, null, 'Terjadi kesalahan di server.');
  }
};
