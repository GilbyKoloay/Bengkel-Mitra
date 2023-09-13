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
  }
}, {collection: 'Services'});



export default model('Services', serviceSchema);
