export default function numberValidator(value) {
  if (
    !value?.replaceAll(' ', '') ||
    !/^\d+$/.test(value.replaceAll(' ', ''))
  ) return null;

  
  return parseInt(value.replaceAll(' ', ''));
};
