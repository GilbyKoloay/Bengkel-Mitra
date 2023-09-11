export default function numberValidator(key, value, allowEmpty=false) {
  if (!allowEmpty && !value) return (() => {throw {
    statusCode: 400,
    description: `${key} tidak ada.`
  }})();
  else if (
    typeof(value) === 'string' ||
    Number.isNaN(value)
  ) return (() => {throw {
    statusCode: 400,
    description: `${key} tidak valid.`
  }})();
  else if (allowEmpty && !value) return null;
  
  return value;
};
