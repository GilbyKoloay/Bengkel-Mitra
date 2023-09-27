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
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    subType: {
      type: String,
      default: null
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
  paidStatus: {
    type: Boolean,
    required: true
  },
  note: {
    type: String,
    default: null
  }
}, {collection: 'Transactions'});



export default model('Transactions', transactionSchema);
