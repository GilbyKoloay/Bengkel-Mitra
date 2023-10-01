import html2pdf from 'html2pdf.js';

import { MitraOto as MitraOtoImg } from '../assets/img';
import { splitString } from './';



function toProperDate(dateTime) {
  const year = dateTime.split('T')[0].split('-')[0];
  let month = dateTime.split('T')[0].split('-')[1];
  let day = dateTime.split('T')[0].split('-')[2];

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

  return `${day} ${month} ${year}`
}



export default function createTransactionInvoicePDF(transaction) {
  let body = '';
  transaction.services.forEach((service, index) => {
    body += `
      <tr>
        <td>${index+1}</td>
        <td>${service.type ? `${service.type} ` : ''}${service.subType ? `(${service.subType})` : ''}</td>
        <td>${service.name}</td>
        <td>${service.class}</td>
        <td>Rp. ${splitString(service.price, 3, '.')}</td>
        <td>${service.quantity}</td>
      </tr>
    `;
  });

  const html = `
    <style>
      /* default value */
      body, section, div, table, th, td, h1, h2, h3, h4, h5, h6, p {
        margin: 0;
        padding: 0;
        font-family: 'Times New Roman', Times, serif;
        color: black;
        font-size: 16px;
      }
      h1 {
        font-size: 24px;
      }
      h2 {
        font-size: 20px;
      }

      /* header */
      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 16px;
        border-bottom: 1px solid black;
      }
      header img,
      header div {
        height: 96px;
        width: 96px;
        border-radius: 2px;
      }

      /* section - info top */
      section#info-top {
        display: flex;
        justify-content: space-between;
      }
      section#info-top .wrapper {
        margin-top: 32px;
        display: flex;
        gap: 16px;
      }

      /* section - table */
      section#table {
        margin-top: 32px;
      }
      section#table table {
        margin-top: 8px;
        width: 100%;
        border-collapse: collapse;
      }
      section#table table tr th,
      section#table table tr td {
        border: 1px solid black;
        padding: 4px 8px;
      }
      section#table table tr td:nth-child(1),
      section#table table tr td:nth-child(4),
      section#table table tr th:last-child {
        text-align: center;
      }
      section#table table tr td:nth-child(5),
      section#table table tr td:nth-child(6) {
        text-align: end;
      }
      section#table table tr td:nth-child(5),
      section#table table tr th:last-child {
        white-space: nowrap;
      }

      /* section - info bottom */
      section#info-bottom {
        margin-top: 32px;
        margin-bottom: 4px;
        display: flex;
        gap: 16px;
      }
      section#info-bottom .note {
        flex: 1;
      }
      section#info-bottom .paid-status {
        flex: 1;
        display: flex;
        justify-content: space-between;
      }
    </style>

    <body>
      <header>
        <img src=${MitraOtoImg} />
        <h1>BENGKEL MITRA</h1>
        <div></div>
      </header>

      <section id='info-top'>
        <div class='wrapper'>
          <div class='key'>
            <p>Tanggal & Waktu</p>
            <p>Nama Pelanggan</p>
            <p>Jenis Kendaraan</p>
            <p>Plat Kendaraan</p>
          </div>
          <div class='colon'>
            <p>:</p>
            <p>:</p>
            <p>:</p>
            <p>:</p>
          </div>
          <div class='value'>
            <p>${toProperDate(transaction.dateTime)}</p>
            <p>${transaction.customerName}</p>
            <p>${transaction.vehicleType ? transaction.vehicleType : '-'}</p>
            <p>${transaction.vehiclePlate ? transaction.vehiclePlate : '-'}</p>
          </div>
        </div>
        <div class='wrapper'>
          <div class='key'>
            <h1>No. Faktur</h1>
          </div>
          <div class='colon'>
            <h1>:</h1>
          </div>
          <div class='value'>
            <h1>${transaction.invoiceNumber}</h1>
          </div>
        </div>
      </section>

      <section id='table'>
        <h2>Daftar Layanan</h2>
        <table>
          <tr>
            <th>No.</th>
            <th>Tipe (Subtipe)</th>
            <th>Nama</th>
            <th>Kelas</th>
            <th>Harga</th>
            <th>Kuantitas</th>
          </tr>
          ${body}
          <tr>
            <th colspan='4'><h2>Total Harga</h2></th>
            <th colspan='2'><h2>Rp. ${splitString(transaction.totalPrice, 3, '.')}</h2></th>
          </tr>
        </table>
      </section>

      <section id='info-bottom'>
        <div class='note'>
          <h2>Keterangan:</h2>
          <p>${transaction.note ? transaction.note : '-'}</p>
        </div>
        <div class='paid-status'>
          <h2>Status Bayar:</h2>
          <h2>${transaction.paidStatus ? 'LUNAS' : 'TIDAK LUNAS'}</h2>
        </div>
      </section>
    </body>
  `;

  const element = document.createElement('div');
  element.innerHTML = html;

  const opt = {
    margin: 16
  };

  html2pdf()
    .set(opt)
    .from(element)
    .save(`Faktur ${transaction.invoiceNumber}.pdf`);
};
