import { transaction as transactionCollection } from '../../database/models/index.js';
import { Res } from '../../functions/index.js';



export default async function update(req, res) {
  try {
    const payload = {
      _id
    };

    const result = await transactionCollection.updateOne({
      _id
    }, {
      $set: {

      }
    });

    return Res(res, 200);
  }
  catch (err) {
    console.log('controllers/transaction/update.', err);
    return Res(res, 500);
  }
};
