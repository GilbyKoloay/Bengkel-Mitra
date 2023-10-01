export default function toProperDateTime(value) {
  let year = value.split('T')[0].split('-')[0];
  let month = value.split('T')[0].split('-')[1];
  let day = value.split('T')[0].split('-')[2];
  let hour = value.split('T')[1].split(':')[0];
  let minute = value.split('T')[1].split(':')[1];

  if (month.length === 1) month = `0${month}`;
  if (day.length === 1) day = `0${day}`;
  if (hour.length === 1) hour = `0${hour}`;
  if (minute.length === 1) minute = `0${minute}`;

  return `${year}-${month}-${day}T${hour}:${minute}:00.000Z`;
};
