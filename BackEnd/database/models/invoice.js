import { Schema, model } from 'mongoose';



const invoiceSchema = new Schema({
  createDate: {
    type: Date,
    required: true
  },
  customerName: {
    type: String,
    default: null
  },
  vehicleType: {
    type: String,
    default: null
  },
  vehiclePlate: {
    type: String,
    default: null
  },
  entryDate: {
    type: Date,
    default: null
  },
  outDate: {
    type: Date,
    default: null
  },
  kilometer: {
    type: Number,
    default: null
  },
  services: [[{
    _id: false,
    name: {
      type: String
    },
    price: {
      type: Number
    },
    paid: {
      type: Number
    },
    note: {
      type: String
    }
  }]],
  totalPrice: {
    type: Number,
    default: 0
  },
  notes: [{
    type: String
  }],
  city: {
    type: String,
    default: 'Manado'
  }
}, {collection: 'Invoices'});



export default model('Invoices', invoiceSchema);
