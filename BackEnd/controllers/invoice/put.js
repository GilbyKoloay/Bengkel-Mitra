import { invoice as invoiceCollection } from '../../database/models/index.js';
import {
  Res,
  documentValidator,
  dateTimeValidator,
  stringValidator,
  numberValidator
} from '../../functions/index.js';



export default async function post(req, res) {
  try {
    const payload = {
      _id: documentValidator(req.body?._id),
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

    const result = await invoiceCollection.updateOne({
      _id: payload._id
    }, {
      $set: {
        createDate: payload.createDate,
        customerName: payload.customerName,
        vehicleType: payload.vehicleType,
        vehiclePlate: payload.vehiclePlate,
        entryDate: payload.entryDate,
        outDate: payload.outDate,
        kilometer: payload.kilometer,
        services: payload.services,
        totalPrice: payload.totalPrice,
        notes: payload.notes,
        city: payload.city
      }
    })
    if (!result || !result?.acknowledged) throw new Error('Terjadi kesalahan di server.');
    if (!result.matchedCount) return Res(res, 404, null, '_id tidak valid.');
    if (!result.modifiedCount) return Res(res, 400, null, 'Tidak ada perubahan yang dibuat.');
    return Res(res, 200);
  }
  catch (err) {
    console.log('controllers/invoice/put.', err);
    return Res(res, 500);
  }
};
