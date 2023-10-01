import { DateTime } from 'luxon';



export default function getCurrentDateTime() {
  const dateTime = DateTime.now().setZone('Asia/Singapore').toISO();

  let year = dateTime.split('T')[0].split('-')[0];
  let month = dateTime.split('T')[0].split('-')[1];
  let day = dateTime.split('T')[0].split('-')[2];
  let hour = dateTime.split('T')[1].split(':')[0];
  let minute = dateTime.split('T')[1].split(':')[1];

  return `${year}-${month}-${day}T${hour}:${minute}:00.000Z`;
};
