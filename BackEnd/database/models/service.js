import { Schema, Types, model } from 'mongoose';



const serviceSchema = new Schema({
  name: {
    type: String,
    required :true
  },
  type: {
    // type: String,
    // enum: [
    //   'PEMELIHARAAN / MAINTENANCE',
    //   'SISTEM PENDINGINAN / COOLING SYSTEM',
    //   'KELISTRIKAN MESIN / ENGINE ELECTRICITY',
    //   'SISTEM REM / BRAKE SYSTEM',
    //   'PEMINDAH DAYA / POWER TRAIN',
    //   'SISTEM PENGEMUDIAN / STEERING SYSTEM',
    //   'SUSPENSI DEPAN / FRONT SUSPENSION',
    //   'SUSPENSI BELAKANG / BACK SUSPENSION',
    //   'SISTEM BAHAN BAKAR / FUEL SYSTEM'
    // ],
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
  }
}, {collection: 'Service'});



export default model('Services', serviceSchema);
