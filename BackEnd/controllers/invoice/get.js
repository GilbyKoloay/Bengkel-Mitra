import { Res, Json } from '../../functions/index.js';



export default function get(req, res) {
  try {
    const result = Json('invoice');
    
    return Res(res, 200, result);
  }
  catch (err) {
    console.log('controllers/invoice/get.', err);
    return Res(res, 500, null, 'Terjadi kesalahan di server.');
  }
};
