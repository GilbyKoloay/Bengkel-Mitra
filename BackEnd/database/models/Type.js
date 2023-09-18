import { Schema, model } from 'mongoose';



const typeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  note: {
    type: String,
    default: null
  }
}, {collection: 'Types'});



export default model('Types', typeSchema);
