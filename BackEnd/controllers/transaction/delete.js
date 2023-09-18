import { transaction as transactionCollection } from '../../database/models/index.js';
import { Res } from '../../functions/index.js';



export default async function deleteDocument(req, res) {
  try {
    const payload = {
      _id
    };

    const result = await transactionCollection.deleteOne({_id});

    return Res(res, 200);
  }
  catch (err) {
    console.log('controllers/transaction/delete.', err);
    return Res(res, 500);
  }
};
