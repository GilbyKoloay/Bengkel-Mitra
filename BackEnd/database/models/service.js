import { Schema, Types, model } from 'mongoose';



const serviceSchema = new Schema({
  type: {
    type: Types.ObjectId,
    ref: 'Types',
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
  price: {
    class1: {
      type: Number,
      default: null
    },
    class2: {
      type: Number,
      default: null
    },
    class3: {
      type: Number,
      default: null
    },
    class4: {
      type: Number,
      default: null
    },
    class5: {
      type: Number,
      default: null
    }
  },
  note: {
    type: String,
    default: null
  }
}, {collection: 'Services'});



export default model('Services', serviceSchema);
