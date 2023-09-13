import { service as serviceCollection } from '../../database/models/index.js';
import {
  Res,
  stringValidator,
  documentValidator,
  numberValidator
} from '../../functions/index.js';



export default async function create(req, res) {
  try {
    const payload = {
      name: stringValidator(req.body?.name),
      type: documentValidator(req.body?.type),
      subType: stringValidator(req.body?.subType),
      price: {
        class1: numberValidator(req.body?.price?.class1),
        class2: numberValidator(req.body?.price?.class2),
        class3: numberValidator(req.body?.price?.class3),
        class4: numberValidator(req.body?.price?.class4),
        class5: numberValidator(req.body?.price?.class5)
      }
    };
    if (!payload.name) return Res(res, 400, null, 'Nama tidak valid');
    if (!payload.type) return Res(res, 400, null, 'Tipe tidak valid.');

    const result = await serviceCollection.create(payload);
    if (!result) throw new Error('Terjadi kesalahan di server.');
    return Res(res, 200);
  }
  catch (err) {
    console.log('controllers/service/create.', err);
    return Res(res, 500);
  }
};
