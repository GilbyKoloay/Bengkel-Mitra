import {
  Res,
  Json,
  stringValidator,
  dateTimeValidator,
  numberValidator
} from '../../functions/index.js';



export default function post(req, res) {
  try {
    const payload = {
      headerLabels: {
        top: stringValidator(req.body?.headerLabels?.top),
        mid: stringValidator(req.body?.headerLabels?.mid),
        bot: stringValidator(req.body?.headerLabels?.bot)
      },

      customerName: stringValidator(req.body?.customerName),
      vehicleType: stringValidator(req.body?.vehicleType),
      vehiclePlate: stringValidator(req.body?.vehiclePlate),
      entryDate: dateTimeValidator(req.body?.entryDate),
      outDate: dateTimeValidator(req.body?.outDate),
      kilometer: stringValidator(req.body?.kilometer),
      info: req.body?.info?.map(item => ({
        label: stringValidator(item?.label),
        value: (item?.type === 'date') ? dateTimeValidator(item?.value) : stringValidator(item?.value),
        type: stringValidator(item?.type),
      })),

      priceShow: stringValidator(req.body?.priceShow),
      paidShow: stringValidator(req.body?.paidShow),
      tableLabels: {
        col1: stringValidator(req.body?.tableLabels?.col1),
        col2: stringValidator(req.body?.tableLabels?.col2),
        col3: stringValidator(req.body?.tableLabels?.col3),
        col4: stringValidator(req.body?.tableLabels?.col4),
        paid: stringValidator(req.body?.tableLabels?.paid),
        totalPaid: stringValidator(req.body?.tableLabels?.totalPaid),
        totalPrice: stringValidator(req.body?.tableLabels?.totalPrice),
        calculated: stringValidator(req.body?.tableLabels?.calculated)
      },
      services: req.body?.services?.map(service => ({
        no: stringValidator(service?.no),
        subServices: service?.subServices?.map(subService => ({
          name: stringValidator(subService?.name),
          price: stringValidator(subService?.price),
          paid: stringValidator(subService?.paid),
          note: stringValidator(subService?.note),
        }))
      })),
      totalPaid: stringValidator(req.body?.totalPaid),
      totalPrice: stringValidator(req.body?.totalPrice),
      calculated: numberValidator(req.body?.calculated),

      noteLabel: stringValidator(req.body?.noteLabel),
      notes: req.body?.notes?.map(note => stringValidator(note)),
      paymentLabels: {
        top: stringValidator(req.body?.paymentLabels?.top),
        mid: stringValidator(req.body?.paymentLabels?.mid),
        bot: stringValidator(req.body?.paymentLabels?.bot)
      },

      city: stringValidator(req.body?.city),
      createDate: dateTimeValidator(req.body?.createDate)
    };
    // console.log('payload', payload);

    const data = Json('invoice');

    const newData = [...data, {
      _id: crypto.randomUUID() + new Date().toISOString(),
      ...payload
    }];

    Json('invoice', newData);

    return Res(res, 200);
  }
  catch (err) {
    console.log('controllers/invoice/post.', err);
    return Res(res, 500);
  }
};
