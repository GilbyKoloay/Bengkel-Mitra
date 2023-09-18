import { transaction as transactionCollection } from '../../database/models/index.js';
import { Res } from '../../functions/index.js';



export default async function getAll(req, res) {
  try {
    const query = {};
    const projection = {};

    const result = await transactionCollection.find();

    return Res(res, 200, result);
  }
  catch (err) {
    console.log('controllers/transaction/getAll.', err);
    return Res(res, 500);
  }
};
