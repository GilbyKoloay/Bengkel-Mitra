import { Res, Json, stringValidator } from '../../functions/index.js';



export default async function deleteDocument(req, res) {
  try {
    const payload = {
      _id: stringValidator(req.body?._id)
    };
    if (!payload._id) return Res(res, 400, null, '_id tidak valid.');
    
    const data = Json('invoice');
    
    if (!data.some(thisData => thisData._id === payload._id)) return Res(res, 400, null, '_id tidak valid');

    const newData = data.map(thisData => thisData._id !== payload._id);

    Json('invoice', newData);

    return Res(res, 200);
  }
  catch (err) {
    console.log('controllers/invoice/delete.', err);
    return Res(res, 500, null, 'Terjadi kesalahan di server.');
  }
};
