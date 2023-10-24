import {
  Res,
  Json,
  stringValidator,
  dateTimeValidator,
  numberValidator
} from '../../functions/index.js';



export default async function post(req, res) {
  try {
    const payload = {
      _id: stringValidator(req.body?._id),
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

    const data = Json('invoice');
    
    if (!data.some(thisData => thisData._id === payload._id)) return Res(res, 400, null, '_id tidak valid');

    const newData = data.map(thisData => {
      if (thisData._id === payload._id) return payload;
      else return thisData;
    });

    Json('invoice', newData);
    
    return Res(res, 200);
  }
  catch (err) {
    console.log('controllers/invoice/put.', err);
    return Res(res, 500);
  }
};
