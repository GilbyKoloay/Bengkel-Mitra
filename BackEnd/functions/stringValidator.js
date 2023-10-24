export default function stringValidator(value, deleteAllSpace=false) {
  if (
    (!deleteAllSpace && !value?.replace(/ +/g, ' ').trim()) ||
    (deleteAllSpace && !value?.replaceAll(' ', ''))
  ) return null;
  
  if (!deleteAllSpace) return value.replace(/ +/g, ' ').trim();
  return value.replaceAll(' ', '');
};
