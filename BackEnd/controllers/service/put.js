import {
  service as serviceCollection,
  Type as typeCollection
} from '../../database/models/index.js';
import {
  Res,
  stringValidator,
  documentValidator,
  numberValidator
} from '../../functions/index.js';



export default async function put(req, res) {
  try {
    const payload = {
      _id: documentValidator(req.body?._id),
      type: documentValidator(req.body?.type),
      subType: stringValidator(req.body?.subType),
      name: stringValidator(req.body?.name),
      price: {
        class1: numberValidator(req.body?.price?.class1),
        class2: numberValidator(req.body?.price?.class2),
        class3: numberValidator(req.body?.price?.class3),
        class4: numberValidator(req.body?.price?.class4),
        class5: numberValidator(req.body?.price?.class5)
      },
      note: stringValidator(req.body?.note)
    };
    if (
      !payload.type ||
      !await typeCollection.findOne({_id: payload.type})
    ) return Res(res, 400, null, 'Tipe tidak valid.');
    if (!payload.type) return Res(res, 400, null, 'Tipe tidak valid.');
    if (!payload.name) return Res(res, 400, null, 'Nama tidak valid.');

    const result = await serviceCollection.updateOne({
      _id: payload._id
    }, {
      $set: {
        type: payload.type,
        subType: payload.subType,
        name: payload.name,
        price: {
          class1: payload.price.class1,
          class2: payload.price.class2,
          class3: payload.price.class3,
          class4: payload.price.class4,
          class5: payload.price.class5
        },
        note: payload.note
      }
    });
    if (!result || !result?.acknowledged) throw new Error('Terjadi kesalahan di server.');
    if (!result.matchedCount) return Res(res, 404, null, '_id tidak valid.');
    if (!result.modifiedCount) return Res(res, 400, null, 'Tidak ada perubahan yang dibuat.');
    return Res(res, 200);
  }
  catch (err) {
    console.log('controllers/service/put.', err);
    return Res(res, 500, null, 'Terjadi kesalahan di server.');
  }
};