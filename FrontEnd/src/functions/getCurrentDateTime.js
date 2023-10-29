import { DateTime } from 'luxon';



export default function getCurrentDateTime() {
  return `${DateTime.now().setZone('Asia/Singapore').toISO().slice(0, 23)}Z`;
};
