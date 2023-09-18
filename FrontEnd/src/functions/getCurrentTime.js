import { DateTime } from 'luxon';



export default function getCurrentDateTime(returnType='dateTime') {
  const dateTime = DateTime.now().setZone('Asia/Singapore').toISO();

  if (returnType === 'dateTime') return `${dateTime.slice(0, 23)}Z`;
  else if (returnType === 'date') return `${dateTime.slice(0, 10)}`;
  else if (returnType === 'time') return `${dateTime.slice(11, 23)}`;
  else if (returnType === 'object') return {
    year: dateTime.slice(0, 4),
    month: dateTime.slice(5, 7),
    day: dateTime.slice(8, 10),
    hour: dateTime.slice(11, 13),
    minute: dateTime.slice(14, 16),
    second: dateTime.slice(17, 19),
    milisecond: dateTime.slice(20, 23)
  };
};
