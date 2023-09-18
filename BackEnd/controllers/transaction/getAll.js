import { transaction as transactionCollection } from '../../database/models/index.js';
import { Res, documentValidator } from '../../functions/index.js';



export default async function getAll(req, res) {
  try {
    const query = {};
    const projection = {};

    Object.keys(req.query).forEach(key => {
      if (req.query[key] !== '') {
        if (key === '_id') query[key] = documentValidator(req.query[key]);
      }

      projection[key] = 1;
    });
    
    if (Object.keys(projection).length === 0) {
      projection.__v = 0;
    }

    const result = await transactionCollection.find(query, projection).populate(['services']);

    return Res(res, 200, result);
  }
  catch (err) {
    console.log('controllers/transaction/getAll.', err);
    return Res(res, 500);
  }
};
