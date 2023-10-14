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
      services: req.body?.services?.map(subServices => (
        subServices?.map(subService => ({
          name: stringValidator(subService?.name),
          price: numberValidator(subService?.price),
          paid: numberValidator(subService?.paid),
          note: stringValidator(subService?.note)
        }))
      )),
      totalPrice: numberValidator(req.body?.totalPrice) ? parseInt(req.body.totalPrice) : 0,
      notes: req.body?.notes?.map(note => stringValidator(note)),
      city: stringValidator(req.body?.city)
    };
    if (!payload.createDate) return Res(res, 400, null, 'Tanggal pembuatan tidak valid');
    if (payload.services.length === 0) return Res(res, 400, null, 'Pekerjaan tidak valid');
    else {
      let invalid = false;

      payload.services.forEach(subServices => {
        subServices.forEach(subService => {
          if (!subService.name) invalid = true;
        });
      });

      if (invalid) return Res(res, 400, null, 'Pekerjaan tidak valid');
    }

    const result = await invoiceCollection.create(payload);
    if (!result) throw new Error('Terjadi kesalahan di server.');
    return Res(res, 200);
  }
  catch (err) {
    console.log('controllers/invoice/post.', err);
    return Res(res, 500);
  }
};
