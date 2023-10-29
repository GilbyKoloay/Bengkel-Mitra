export default function numberValidator(value) {
  if (
    !value ||
    typeof(value) === 'string' ||
    Number.isNaN(value)
  ) return 0;

  return parseInt(value);
};
