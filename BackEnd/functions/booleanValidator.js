export default function booleanValidator(value) {
  if (typeof(value) !== 'boolean') return null;

  return value;
};
