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
      services: req.body?.services?.map(service => ({
        primary: service?.primary?.map(primary => stringValidator(primary)),
        secondary: service?.secondary?.map(secondary => stringValidator(secondary)),
        price: numberValidator(service?.price)
      })),
      totalPrice: numberValidator(req.body?.totalPrice),
      note: stringValidator(req.body?.note)
    };
    if (!payload.createDate) return Res(res, 400, null, 'Tanggal pembuatan tidak valid');
    if (payload.services.length === 0) return Res(res, 400, null, 'Pekerjaan tidak valid');
    else {
      let invalid = false;
      payload.services.forEach(service => {
        if (
          (
            service.primary.length === 0 &&
            service.secondary.length === 0
          ) ||
          !service.price
        ) invalid = true;
      });
      if (invalid) return Res(res, 400, null, 'Pekerjaan tidak valid');
    }
    if (!payload.totalPrice) return Res(res, 400, null, 'Total harga tidak valid');

    const result = await invoiceCollection.updateOne({
      _id: payload._id
    }, {
      $set: {
        customerName: payload.customerName,
        vehicleType: payload.vehicleType,
        vehiclePlate: payload.vehiclePlate,
        entryDate: payload.entryDate,
        outDate: payload.outDate,
        kilometer: payload.kilometer,
        services: payload.services,
        note: payload.note,
        totalPrice: payload.totalPrice,
        createDate: payload.createDate
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
