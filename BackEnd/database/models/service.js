import { Schema, Types, model } from 'mongoose';



const serviceSchema = new Schema({
  name: {
    type: String,
    required :true
  },
  type: {
    type: Types.ObjectId,
    ref: 'Types',
    required: true
  },
  subType: {
    type: String,
    default: null
  },
  price: {
    class1: {
      type: Number,
      required: true
    },
    class2: {
      type: Number,
      required: true
    },
    class3: {
      type: Number,
      required: true
    },
    class4: {
      type: Number,
      required: true
    },
    class5: {
      type: Number,
      required: true
    }
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {collection: 'Service'});



export default model('Services', serviceSchema);
