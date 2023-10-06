import { Button } from '../../components';
import { splitString, toProperDateTime } from '../../functions';



export default function DetailDialog({
  title='',
  onClose='',
  invoice=null
}) {
  return (
    <div className='fixed top-0 left-0 h-screen w-screen flex justify-center items-center backdrop-blur-sm backdrop-brightness-50'>
      <div className='h-[90vh] w-[90vw] bg-neutral-100 rounded p-8 flex flex-col gap-8'>
        <div className='flex justify-between items-center'>
          <div className='text-2xl'>{title}</div>
          <Button
            label='X'
            onClick={onClose}
            size='md'
            theme='red'
          />
        </div>

        <div className='flex-1 flex flex-col gap-4 overflow-auto'>
          <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 whitespace-nowrap'>
            {[
              ['Nama Pelanggan', invoice.customerName ? invoice.customerName : '-'],
              ['Jenis Kendaraan', invoice.vehicleType ? invoice.vehicleType : '-'],
              ['No. Polisi', invoice.vehiclePlate ? invoice.vehiclePlate : '-'],
              ['Tanggal Masuk', invoice.entryDate ? toProperDateTime(invoice.entryDate, true) : '-'],
              ['Tanggal Keluar', invoice.outDate ? toProperDateTime(invoice.outDate, true) : '-'],
              ['Kilometer', invoice.kilometer ? invoice.kilometer : '-']
            ].map(([key, value], index) => (
              <div key={index} className='grid grid-cols-2'>
                <p>{key}</p>
                <p>: {value}</p>
              </div>
            ))}
          </section>

          <section className='flex-1 overflow-auto'>
            <table className='w-full border-2 border-neutral-900'>
              <thead className='border-b border-neutral-900'>
                <th className='px-2 border-r border-neutral-900'>No.</th>
                <th className='px-2'>Uraian Pekerjaan</th>
                <th className='px-2 border-x border-neutral-900'>Harga</th>
                <th className='px-2'>Keterangan</th>
              </thead>
              <tbody>
                {invoice.services.map((service, index) => (
                  <tr key={index} className={(index > 0) ? 'border-t border-neutral-900 border-dashed' : ''}>
                    <td className='px-2 text-center border-r border-neutral-900'>{index+1}</td>
                    <td className='px-2 whitespace-nowrap'>
                      {service.primary.map((primary, index) => <div key={index}>{primary}</div>)}
                      {service.secondary.map((secondary, index) => <div key={index}>• {secondary}</div>)}
                    </td>
                    <td className='px-2 text-end whitespace-nowrap border-x border-neutral-900'>Rp. {splitString(service.price, 3, '.')}</td>
                    {(index === 0) && <td rowSpan={invoice.services.length} className='px-2'>{invoice.note ? invoice.note : ''}</td>}
                  </tr>
                ))}
                <tr className='border-t border-neutral-900'>
                  <td colSpan={2} className='px-2 font-bold text-center'>Jumlah</td>
                  <td colSpan={2} className='px-2 font-bold text-center border-l border-neutral-900'>Rp. {splitString(invoice.totalPrice, 3, '.')}</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </div>
  );
};
