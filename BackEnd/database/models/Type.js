import { Schema, model } from 'mongoose';



const typeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {collection: 'Types'});



export default model('Types', typeSchema);
