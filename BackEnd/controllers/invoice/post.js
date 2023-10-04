import { invoice as invoiceCollection } from '../../database/models/index.js';
import {
  Res,
  dateTimeValidator,
  stringValidator,
  numberValidator
} from '../../functions/index.js';



export default async function post(req, res) {
  try {
    const payload = {
      createDate: dateTimeValidator(req.body?.createDate),
      customerName: stringValidator(req.body?.customerName),
      vehicleType: stringValidator(req.body?.vehicleType),
      vehiclePlate: stringValidator(req.body?.vehiclePlate),
      entryDate: dateTimeValidator(req.body?.entryDate),
      outDate: dateTimeValidator(req.body?.outDate),
      kilometer: numberValidator(req.body?.kilometer),
      services: req.body?.services?.map(service => ({
        primary: service?.primary?.map(primary => stringValidator(primary)),
        secondary: service?.secondary?.map(secondary => stringValidator(secondary)),
        price: numberValidator(service?.price)
      })),
      totalPrice: numberValidator(req.body?.totalPrice),
      note: stringValidator(req.body?.note)
    };
    if (!payload.createDate) return Res(res, 400, null, 'Tanggal pembuatan tidak valid');
    if (payload.services?.length > 0) payload.services.forEach(service => {
      if (
        service.primary?.length === 0 &&
        service.secondary?.length === 0
      ) return Res(res, 400, null, 'Pekerjaan tidak valid');
      if (!service.price) return Res(res, 400, null, 'Harga pekerjaan tidak valid');
    });
    else return Res(res, 400, null, 'Pekerjaan tidak valid');
    if (!payload.totalPrice) return Res(res, 400, null, 'Total harga tidak valid');

    const result = await invoiceCollection.create(payload);
    if (!result) throw new Error('Terjadi kesalahan di server.');
    return Res(res, 200);
  }
  catch (err) {
    console.log('controllers/invoice/post.', err);
    // return Res(res, 500);
  }
};
