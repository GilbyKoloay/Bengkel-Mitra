export default function stringValidator(key, value, allowEmpty=false) {
  if (!allowEmpty && !value?.trim()) return (() => {throw {
    statusCode: 400,
    description: `${key} tidak ada.`
  }})();
  else if (allowEmpty && !value?.trim()) return null;
  
  return value.trim().toUpperCase();
};
