import { Schema, model } from 'mongoose';



const transactionSchema = new Schema({
  dateTime: {
    type: Date,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  services: [{
    type: {
      type: String,
      required: true
    },
    subType: {
      type: String,
      default: null
    },
    name: {
      type: String,
      required: true
    },
    class: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  }],
  totalPrice: {
    type: Number,
    required: true
  },
  isPaid: {
    type: Boolean,
    required: true
  },
  vehicleType: {
    type: String,
    default: null
  },
  vehiclePlate: {
    type: String,
    default: null
  },
  note: {
    type: String,
    default: null
  }
}, {collection: 'Transactions'});



export default model('Transactions', transactionSchema);
