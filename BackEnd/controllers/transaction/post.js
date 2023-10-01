import { transaction as transactionCollection } from '../../database/models/index.js';
import {
  Res,
  dateTimeValidator,
  stringValidator,
  documentValidator,
  numberValidator,
  booleanValidator
} from '../../functions/index.js';



export default async function post(req, res) {
  try {
    const payload = {
      dateTime: dateTimeValidator(req.body?.dateTime),
      customerName: stringValidator(req.body?.customerName),
      services: req.body?.services?.map(service => ({
        _id: documentValidator(service?._id),
        type: stringValidator(service?.type),
        subType: stringValidator(service?.subType),
        name: stringValidator(service?.name),
        class: stringValidator(service?.class),
        price: numberValidator(service?.price),
        quantity: numberValidator(service?.quantity)
      })),
      totalPrice: numberValidator(req.body?.totalPrice),
      isPaid: booleanValidator(req.body?.isPaid),
      vehicleType: stringValidator(req.body?.vehicleType),
      vehiclePlate: stringValidator(req.body?.vehiclePlate),
      note: stringValidator(req.body?.note)
    };
    if (!payload.dateTime) return Res(res, 400, null, 'Tanggal/Waktu tidak valid.');
    if (!payload.customerName) return Res(res, 400, null, 'Nama pelanggan tidak valid.');
    if (payload.services?.length > 0) payload.services.forEach((service, index) => {
      if (!service._id) return Res(res, 400, null, `_id layanan ${index+1} tidak valid.`);
      if (!service.type) return Res(res, 400, null `Tipe layanan ${index+1} tidak valid.`);
      if (!service.class) return Res(res, 400, null `Kelas layanan ${index+1} tidak valid.`);
      if (!service.price) return Res(res, 400, null `Harga layanan ${index+1} tidak valid.`);
      if (!service.quantity) return Res(res, 400, null `Kuantitas layanan ${index+1} tidak valid.`);
    });
    else return Res(res, 400, null, 'Layanan tidak valid.');
    if (!payload.totalPrice) return Res(res, 400, null, 'Harga total tidak valid.');
    if (payload.isPaid === null) return Res(res, 400, null, 'Status bayar tidak valid.');

    const result = await transactionCollection.create(payload);
    if (!result) throw new Error('Terjadi kesalahan di server.');
    return Res(res, 200);
  }
  catch (err) {
    console.log('controllers/transaction/post.', err);
    return Res(res, 500);
  }
};
