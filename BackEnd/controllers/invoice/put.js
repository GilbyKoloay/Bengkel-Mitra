import {
  Res,
  Json,
  stringValidator,
  dateTimeValidator,
  numberValidator
} from '../../functions/index.js';



export default function put(req, res) {
  try {
    const payload = {
      _id: req.body?._id,

      headerLabels: {
        top: stringValidator(req.body?.headerLabels?.top),
        mid: stringValidator(req.body?.headerLabels?.mid),
        bot: stringValidator(req.body?.headerLabels?.bot)
      },

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
            type: stringValidator(subService?.type),
            name: stringValidator(subService?.name),
            price: stringValidator(subService?.price),
            paid: stringValidator(subService?.paid),
            note: stringValidator(subService?.note)
        }))
      })),
      totalPriceErr: stringValidator(req.body?.totalPriceErr),
      totalPrice: stringValidator(req.body?.totalPrice),
      totalPaidErr: stringValidator(req.body?.totalPaidErr),
      totalPaid: stringValidator(req.body?.totalPaid),
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
