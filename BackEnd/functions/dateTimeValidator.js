export default function dateValidator(value) {
  if (
    !/^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d{1,3})?(Z|[-+]\d{2}:\d{2})?$/.test(value?.replaceAll(' ', '')) ||
    isNaN(new Date(value?.replaceAll(' ', '')).getTime())
  ) return '0000-00-00T00:00:00.000Z';

  return new Date(value.replaceAll(' ', ''));
};
