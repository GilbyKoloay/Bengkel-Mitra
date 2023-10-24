export default function toProperString(value, removeAllSpace=false) {
  if (
    !value ||
    !value?.replaceAll(' ', '')
  ) return null;

  if (removeAllSpace) return value.replaceAll(' ', '');
  return value.trim().replace(/ +/g, ' ');
};
