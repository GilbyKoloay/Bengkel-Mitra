export default function toProperDateTime(value, isForPDF=false) {
  let year = value.split('T')[0].split('-')[0];
  let month = value.split('T')[0].split('-')[1];
  let day = value.split('T')[0].split('-')[2];
  let hour = value.split('T')[1].split(':')[0];
  let minute = value.split('T')[1].split(':')[1];
  let second = value.split('T')[1].split(':')[2].split('.')[0];
  let milisecond = value.split('T')[1].split(':')[2].split('.')[1].split('Z')[0];

  if (month.length === 1) month = `0${month}`;
  if (day.length === 1) day = `0${day}`;
  if (hour.length === 1) hour = `0${hour}`;
  if (minute.length === 1) minute = `0${minute}`;

  if (isForPDF) {
    if (month === '01') month = 'Januari';
    else if (month === '02') month = 'Februari';
    else if (month === '03') month = 'Maret';
    else if (month === '04') month = 'April';
    else if (month === '05') month = 'Mei';
    else if (month === '06') month = 'Juni';
    else if (month === '07') month = 'Juli';
    else if (month === '08') month = 'Agustus';
    else if (month === '09') month = 'September';
    else if (month === '10') month = 'Oktober';
    else if (month === '11') month = 'November';
    else if (month === '12') month = 'Desember';

    if (
      parseInt(day) > 0 &&
      parseInt(day) < 10
    ) day = day.slice(1);

    return `${day} ${month} ${year}`;
  }

  return `${year}-${month}-${day}T${hour}:${minute}:${second}.${milisecond}Z`;
};
