import { transaction as transactionCollection } from '../../database/models/index.js';
import {
  Res,
  documentValidator,
  dateTimeValidator,
  stringValidator,
  numberValidator,
  booleanValidator
} from '../../functions/index.js';



export default async function put(req, res) {
  try {
    const payload = {
      _id: documentValidator(req.body?._id),
      invoiceNumber: numberValidator(req.body?.invoiceNumber),
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
    if (!payload._id) return Res(res, 400, null, '_id tidak valid.');
    if (!payload.invoiceNumber) return Res(res, 400, null, 'No. Faktur tidak valid.');
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
    
    const result = await transactionCollection.updateOne({
      _id: payload._id
    }, {
      $set: {
        invoiceNumber: payload.invoiceNumber,
        dateTime: payload.dateTime,
        customerName: payload.customerName,
        services: payload.services,
        totalPrice: payload.totalPrice,
        isPaid: payload.isPaid,
        note: payload.note
      }
    });
    if (!result) throw new Error('Terjadi kesalahan di server.');
    return Res(res, 200);
  }
  catch (err) {
    if (err?.message.includes('E11000 duplicate key error collection: BengkelMitra.Transactions')) {
      if (err.message.split('{ ')[1].split(':')[0] === 'invoiceNumber') return Res(res, 400, null, 'No. Faktur sudah ada.');
    }

    console.log('controllers/transaction/put.', err);
    return Res(res, 500);
  }
};
