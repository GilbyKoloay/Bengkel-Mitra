import { Types } from 'mongoose';



export default function documentValidator(value, collection) {
  if (
    (
      !value ||
      !value.replaceAll(' ', '')
    ) || (
      !Types.ObjectId.isValid(value.replaceAll(' ', ''))
    )
  ) return null;

  return new Types.ObjectId(value.replaceAll(' ', ''));
};
