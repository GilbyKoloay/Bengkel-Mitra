export default function stringValidator(value, deleteAllSpace=false) {
  if (
    (!deleteAllSpace && !value?.replace(/ +/g, ' ').trim()) ||
    (deleteAllSpace && !value?.replaceAll(' ', ''))
  ) return '';
  
  if (!deleteAllSpace) return value.replace(/ +/g, ' ').trim();
  return value.replaceAll(' ', '');
};
