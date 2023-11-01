import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { useSelector } from 'react-redux';
import { useParams, Navigate, useNavigate } from 'react-router-dom';

import { Button } from '../../../components';
import { splitString, toProperDateTime } from '../../../functions';
import { InvoicePDF as PDF } from '../../../components';



export default function InvoiceSelected() {
  const navigate = useNavigate();

  const { _id } = useParams();

  const { _invoices } = useSelector(state => state._app);

  const invoice = _invoices?.filter(invoice => invoice._id === _id)[0];



  // if (!_id) return <Navigate to='/invoice' />
  if (_id) return <Navigate to={`/invoice/form/update/${invoice?._id}`} />

  return (
    <div className='fixed top-0 left-0 h-screen w-screen flex justify-center items-center backdrop-blur-sm backdrop-brightness-50'>
      <div className='h-[90vh] w-[90vw] bg-neutral-100 rounded p-8 flex flex-col gap-4'>
        <div className='flex flex-col-reverse gap-4 sm:gap-2 lg:flex-row lg:justify-between lg:items-center'>
          <div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
            <Button
              label='Kembali'
              onClick={() => navigate('/invoice')}
              size='md'
            />
            {!invoice ? (
              <Button
                label='Cetak'
                size='md'
                disabled
              />
            ) : (
              <PDFDownloadLink
                className='border-2 py-1 px-4 text-lg bg-neutral-300 border-neutral-700 rounded text-center hover:bg-neutral-500 hover:cursor-pointer focus:outline focus:outline-1 focus:outline-offset-1 focus:outline-neutral-700'
                document={invoice ? <PDF invoice={invoice} /> : null}
                fileName='Faktur.pdf'
              >
                {({ blob, url, loading, error }) => loading ? '' : 'Cetak'}
              </PDFDownloadLink>
            )}
            <Button
              label='Ubah'
              onClick={() => navigate(`/invoice/form/update/${invoice?._id}`)}
              size='md'
              theme='yellow'
              disabled={!invoice}
            />
            <Button
              label='Hapus'
              onClick={() => navigate(`/invoice/form/delete/${invoice?._id}`)}
              size='md'
              theme='red'
              disabled={!invoice}
            />
          </div>
          <div>
            <label className='text-lg'>Tanggal Pembuatan: {invoice?.createDate ? toProperDateTime(invoice.createDate, true) : '-'}</label>
          </div>
        </div>

        <hr />

        {!invoice ? (
          <div className='text-xl'>Sedang memuat data, mohon tunggu ...</div>
        ) : (
          // <div className='flex-1 flex flex-col gap-4 overflow-auto'>
          //   <div className='text-2xl'>Detail Faktur</div>

          //   <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 whitespace-nowrap'>
          //     {[
          //       ['Nama Pelanggan', invoice.customerName ? invoice.customerName : '-'],
          //       ['Jenis Kendaraan', invoice.vehicleType ? invoice.vehicleType : '-'],
          //       ['No. Polisi', invoice.vehiclePlate ? invoice.vehiclePlate : '-'],
          //       ['Tanggal Masuk', invoice.entryDate ? toProperDateTime(invoice.entryDate, true) : '-'],
          //       ['Tanggal Keluar', invoice.outDate ? toProperDateTime(invoice.outDate, true) : '-'],
          //       ['Kilometer', invoice.kilometer ? invoice.kilometer : '-']
          //     ].map(([key, value], index) => (
          //       <div key={index} className='grid grid-cols-2'>
          //         <p>{key}</p>
          //         <p>: {value}</p>
          //       </div>
          //     ))}
          //   </div>

          //   <div className='flex-1'>
          //     <table className='w-full border-2 border-neutral-900'>
          //       <thead className='border-b border-neutral-900'>
          //         <tr>
          //           <th className='px-2 border-r border-neutral-900'>No.</th>
          //           <th className='px-2'>Uraian Pekerjaan</th>
          //           <th className='px-2 border-x border-neutral-900'>Harga</th>
          //           <th className='px-2'>Keterangan</th>
          //         </tr>
          //       </thead>
          //       <tbody>
          //         {invoice.services.map((service, index) => (
          //           <tr key={index} className={(index > 0) ? 'border-t border-neutral-900 border-dashed' : ''}>
          //             <td className='px-2 text-center border-r border-neutral-900'>{index+1}</td>
          //             <td className='px-2 whitespace-nowrap'>
          //               {service.primary.map((primary, index) => <div key={index}>{primary}</div>)}
          //               {service.secondary.map((secondary, index) => <div key={index}>• {secondary}</div>)}
          //             </td>
          //             <td className='px-2 text-end whitespace-nowrap border-x border-neutral-900'>Rp. {splitString(service.price, 3, '.')}</td>
          //             {(index === 0) && <td rowSpan={invoice.services.length} className='px-2'>{invoice.note ? invoice.note : ''}</td>}
          //           </tr>
          //         ))}
          //         <tr className='border-t border-neutral-900'>
          //           <td colSpan={2} className='px-2 font-bold text-center'>Jumlah</td>
          //           <td colSpan={2} className='px-2 font-bold text-center border-l border-neutral-900'>Rp. {splitString(invoice.totalPrice, 3, '.')}</td>
          //         </tr>
          //       </tbody>
          //     </table>
          //   </div>
          // </div>
          <PDFViewer className='h-full'>
            <PDF invoice={invoice} />
          </PDFViewer>
        )}
      </div>
    </div>
  );
};
