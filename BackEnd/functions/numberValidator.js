export default function numberValidator(value) {
  if (
    !value ||
    typeof(value) === 'string' ||
    Number.isNaN(value)
  ) return null;

  return parseInt(value);
};
