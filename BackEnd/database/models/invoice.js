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
  services: [{
    _id: false,
    primary: [{
      type: String
    }],
    secondary: [{
      type: String
    }],
    price: {
      type: Number
    }
  }],
  totalPrice: {
    type: Number,
    required: true
  },
  note: {
    type: String,
    default: null
  }
}, {collection: 'Invoices'});



export default model('Invoices', invoiceSchema);
