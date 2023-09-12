import { Schema, model } from 'mongoose';



const transactionSchema = new Schema({
  dateTime: {
    type: Date,
    required: true
  },
  services: [{
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  paidStatus: {
    type: Boolean,
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {collection: 'Transactions'});



export default model('Transactions', transactionSchema);
