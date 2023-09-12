import { Type as TypeCollection } from '../../database/models/index.js';
import { Res, documentValidator, stringValidator } from '../../functions/index.js';



export default async function getAll(req, res) {
  try {
    const query = {
      isDeleted: false
    };
    const projection = {};

    Object.keys(req.query).forEach(key => {
      if (req.query[key] !== '') {
        if (key === '_id') query[key] = documentValidator(req.query[key]);
        else if (['name'].includes(key)) query[key] = stringValidator(req.query[key]);
      }

      projection[key] = 1;
    });
    
    if (Object.keys(projection).length === 0) {
      projection.isDeleted = 0;
      projection.__v = 0;
    }

    const result = await TypeCollection.find(query, projection);

    if (!result) throw new Error('Terjadi kesalahan di server.');
    return Res(res, 200, result);
  }
  catch (err) {
    console.log('controllers/type/getAll.', err);
    return Res(res, 500, null, 'Terjadi kesalahan di server.');
  }
};
