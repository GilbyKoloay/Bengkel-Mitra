import html2pdf from 'html2pdf.js';

import { MitraOto as MitraOtoImg } from '../assets/img';
import { toProperDateTime, splitString, getCurrentTime } from './';



export default function createInvoicePDF(invoice) {
  let body = '';
  invoice.services.forEach((service, index) => {
    let primary = '';
    service.primary.forEach(thisPrimary => {
      primary += `
        <div>${thisPrimary}</div>
      `;
    });

    let secondary = '';
    service.secondary.forEach(thisSecondary => {
      secondary += `
        <div>• ${thisSecondary}</div>
      `;
    });

    body += `
      <tr>
        <td>${index+1}</td>
        <td>
          ${primary}
          ${secondary}
        </td>
        <td>Rp. ${splitString(service.price, 3, '.')}</td>
        ${index === 0 ? `<td rowspan='${invoice.services.length}'>${invoice.note ? invoice.note : ''}</td>` : ''}
      </tr>
    `;
  });

  const html = `
    <style>
      /* default value */
      body, section, div, hr, table, th, td {
        margin: 0;
        padding: 0;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        color: black;
        font-size: 12px;
      }

      /* header */
      header {
        margin-bottom: 16px;
        height: 96px;
        display: flex;
        align-items: center;
        gap: 32px;
      }
      header img {
        height: 100%;
        border-radius: 2px;
      }
      header div:first-child {
        font-size: 20px;
      }
      header div:nth-child(2) {
        font-size: 12px;
      }
      header div:last-child {
        font-size: 10px;
      }

      /* section - first */
      section:first-child {
        margin-top: 16px;
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      /* section - 2 */
      section:nth-child(2) {
        margin-top: 16px;
      }

      /* table */
      table {
        width: 100%;
        border-collapse: collapse;
        border: 2px solid black;
      }

      /* table - vertical border */
      table tr:first-child th:first-child,
      table tr td:first-child {
        border-right: 1px solid black;
      }

      table tr th:nth-child(3),
      table tr td:nth-child(3),
      table tr:last-child th:last-child {
        border-left: 1px solid black;
        border-right: 1px solid black;
      }

      /* table - horizontal border */
      table tr:first-child {
        border-bottom: 1px solid black;
      }
      table tr td:first-child,
      table tr td:nth-child(2),
      table tr td:last-child {
        border-top: 1px dashed black;
      }
      table tr:nth-child(2) td {
        border-top: 0;
      }
      table tr:last-child th:first-child,
      table tr:last-child th:nth-child(2) {
        border-top: 1px solid black;
      }

      /* table - padding */
      table tr th,
      table tr td {
        padding: 0 4px 8px 4px;
      }

      /* table - text */
      table tr td:first-child {
        text-align: center;
      }
      table tr td:nth-child(2) {
        white-space: nowrap;
      }
      table tr td:nth-child(3) {
        text-align: end;
        white-space: nowrap;
      }
      table tr:last-child th:last-child {
        white-space: nowrap;
      }

      /* section - last */
      section:last-child {
        margin-top: 64px;
        margin-bottom: 4px;
      }
      section:last-child div {
        text-align: end;
      }
    </style>

    <body>
      <header>
        <img src=${MitraOtoImg} />
        <div>
          <div>Mitra Oto</div>
          <div>Jl. Pingkan Matindas No. 48, Dendengan Dalam</div>
          <div>No. HP: 0813 5607 1990</div>
        </div>
      </header>

      <hr />

      <main>
        <section>
          <div>
            <p>Nama Pelanggan</p>
            <p>Jenis Kendaraan</p>
            <p>No. Polisi</p>
          </div>
          <div>
            <p>: ${invoice.customerName ? invoice.customerName : '-'}</p>
            <p>: ${invoice.vehicleType ? invoice.vehicleType : '-'}</p>
            <p>: ${invoice.vehiclePlate ? invoice.vehiclePlate : '-'}</p>
          </div>
          <div>
            <p>Tanggal Masuk</p>
            <p>Tanggal Keluar</p>
            <p>Kilometer</p>
          </div>
          <div>
            <p>: ${invoice.entryDate ? toProperDateTime(invoice.entryDate, true) : '-'}</p>
            <p>: ${invoice.outDate ? toProperDateTime(invoice.outDate, true) : '-'}</p>
            <p>: ${invoice.kilometer ? invoice.kilometer : '-'}</p>
          </div>
        </section>
          
        <section>
          <table>
            <tr>
              <th>No.</th>
              <th>Uraian Pekerjaan</th>
              <th>Harga</th>
              <th>Keterangan</th>
            </tr>
            ${body}
            <tr>
              <th colspan='2'>Jumlah</th>
              <th colspan='2'>Rp. ${splitString(invoice.totalPrice, 3, '.')}</th>
            </tr>
          </table>
        </section>

        <section>
          <div>Manado, ${toProperDateTime(getCurrentTime(), true)}</div>
        </section>
      </main>
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
    .save(`Faktur
      ${invoice.customerName ? `${invoice.customerName} ` : ''}
      ${invoice.vehicleType ? `${invoice.vehicleType} ` : ''}
      ${invoice.vehiclePlate ? `${invoice.vehiclePlate}` : ''}
    .pdf`);
};
