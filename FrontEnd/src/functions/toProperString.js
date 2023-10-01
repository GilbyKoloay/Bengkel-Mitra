export default function toProperString(value, removeAllSpace=false) {
  if (
    !value ||
    !value?.replaceAll(' ', '')
  ) return null;

  if (removeAllSpace) return value.replaceAll(' ', '').toUpperCase();
  return value.trim().replace(/ +/g, ' ').toUpperCase();
};
