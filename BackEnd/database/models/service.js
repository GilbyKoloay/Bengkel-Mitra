import { Schema, model } from 'mongoose';



const serviceSchema = new Schema({
  name: {
    type: String,
    required :true
  },
  type: {
    type: String,
    required: true,
    unique: true
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
  }
}, {collection: 'Service'});



export default model('Services', serviceSchema);
