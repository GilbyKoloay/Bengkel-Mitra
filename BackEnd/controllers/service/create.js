import { service as serviceCollection } from '../../database/models/index.js';
import { Res, stringValidator, numberValidator } from '../../functions/index.js';



export default async function create(req, res) {
  try {
    const payload = {
      name: stringValidator(req.body?.name),
      type: stringValidator(req.body?.type),
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
    if (!payload.price.class1) return Res(res, 400, null, 'Harga kelas 1 tidak valid.');
    if (!payload.price.class2) return Res(res, 400, null, 'Harga kelas 2 tidak valid.');
    if (!payload.price.class3) return Res(res, 400, null, 'Harga kelas 3 tidak valid.');
    if (!payload.price.class4) return Res(res, 400, null, 'Harga kelas 4 tidak valid.');
    if (!payload.price.class5) return Res(res, 400, null, 'Harga kelas 5 tidak valid.');

    const result = await serviceCollection.create(payload);
    console.log('result', result);

    return Res(res, 200);
  }
  catch (err) {
    console.log('controllers/service/create.', err);
    return Res(res, 500);
  }
};
