import { Types } from 'mongoose';



export default async function documentValidator(key, value, collection) {
  if (
    !value ||
    !value.replaceAll(' ', '')
  ) return (() => {throw {
    statusCode: 400,
    description: `Id ${key} tidak ada.`
  }})();
  else if (Types.ObjectId.isValid(value.replaceAll(' ', ''))) return (() => {throw {
    statusCode: 400,
    description: `Id ${key} tidak valid.`
  }})();

  return new Types.ObjectId(value.replaceAll(' ', ''));
};
