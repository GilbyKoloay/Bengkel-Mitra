import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Table,
  InputDate,
  Input
} from '../../components';
import { splitString, toProperString } from '../../functions';
import { Main } from '../../layouts';



export default function Invoice() {
  const navigate = useNavigate();
  
  const { _invoices } = useSelector(state => state._app);

  const [createDate, setCreateDate] = useState('--T00:00:00.000Z');
  const [customerName, setCustomerName] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [inDateOutDate, setInDateOutDate] = useState('--T00:00:00.000Z');
  const [kilometer, setKilometer] = useState('');
  const [calculated, setCalculated] = useState('');



  function filtered_invoices() {
    return _invoices?.filter(invoice =>
      (!createDate.split('T')[0].split('-')[2] || invoice.createDate?.split('T')[0].split('-')[2].includes(createDate.split('T')[0].split('-')[2])) &&
      (!createDate.split('T')[0].split('-')[1] || invoice.createDate?.split('T')[0].split('-')[1].includes(createDate.split('T')[0].split('-')[1])) &&
      (!createDate.split('T')[0].split('-')[0] || invoice.createDate?.split('T')[0].split('-')[0].includes(createDate.split('T')[0].split('-')[0])) &&
      (!customerName || ((customerName === '-') && !invoice.customerName) || invoice.customerName?.includes(toProperString(customerName))) &&
      (!vehicleType || ((vehicleType === '-') && !invoice.vehicleType) || invoice.vehicleType?.includes(toProperString(vehicleType))) &&
      (!vehiclePlate || ((vehiclePlate === '-') && !invoice.vehiclePlate) || invoice.vehiclePlate?.includes(toProperString(vehiclePlate))) &&
      (!inDateOutDate.split('T')[0].split('-')[2] || invoice.inDateOutDate?.split('T')[0]?.split('-')[2]?.includes(inDateOutDate.split('T')[0].split('-')[2])) &&
      (!inDateOutDate.split('T')[0].split('-')[1] || invoice.inDateOutDate?.split('T')[0]?.split('-')[1]?.includes(inDateOutDate.split('T')[0].split('-')[1])) &&
      (!inDateOutDate.split('T')[0].split('-')[0] || invoice.inDateOutDate?.split('T')[0]?.split('-')[0]?.includes(inDateOutDate.split('T')[0].split('-')[0])) &&
      (!kilometer || ((kilometer === '-') && !invoice.kilometer) || invoice.kilometer?.toString()?.includes(toProperString(kilometer))) &&
      (!calculated || ((calculated === '-') && !invoice.calculated) || invoice.calculated?.toString()?.includes(toProperString(calculated)))
    );
  }



  return (
    <>
      <Main
        header={
          <>
            <Button
              className='whitespace-nowrap'
              label='Tambah Faktur'
              onClick={() => navigate('/invoice/form')}
              size='md'
              theme='blue'
            />
          </>
        }
        title='Data Faktur'
        table={!_invoices ? (
          <div className='mt-4 text-center text-xl'>Sedang memuat data, mohon tunggu ...</div>
        ) : (_invoices.length === 0) ? (
          <div className='mt-4 text-center text-xl'>Data kosong</div>
        ) : (
          <Table
            titles={[
              <>
                {[
                  'Tanggal Pembuatan',
                  'Nama Pelanggan',
                  'Jenis Kendaraan',
                  'No. Polisi',
                  'Tgl Msk/Tgl Klr',
                  'Kilometer',
                  'Jumlah'
                ].map((title, index) => <th key={index}>{title}</th>)}
              </>
            ]}
            // filters={
            //   <>
            //     <th>
            //       <InputDate
            //         useTime={false}
            //         value={createDate}
            //         onChange={value => setCreateDate(value)}
            //         placeholder='filter'
            //       />
            //     </th>
            //     <th>
            //       <Input
            //         value={customerName}
            //         onChange={value => setCustomerName(value)}
            //         placeholder='filter'
            //       />
            //     </th>
            //     <th>
            //       <Input
            //         value={vehicleType}
            //         onChange={value => setVehicleType(value)}
            //         placeholder='filter'
            //       />
            //     </th>
            //     <th>
            //       <Input
            //         value={vehiclePlate}
            //         onChange={value => setVehiclePlate(value)}
            //         placeholder='filter'
            //       />
            //     </th>
            //     <th>
            //       <InputDate
            //         useTime={false}
            //         value={inDateOutDate}
            //         onChange={value => setInDateOutDate(value)}
            //         placeholder='filter'
            //       />
            //     </th>
            //     <th>
            //       <Input
            //         value={kilometer}
            //         onChange={value => setKilometer(value)}
            //         placeholder='filter'
            //       />
            //     </th>
            //     <th>
            //       <Input
            //         value={calculated}
            //         onChange={value => setCalculated(value)}
            //         placeholder='filter'
            //       />
            //     </th>
            //   </>
            // }
            // info={<th colSpan={9}>Total {filtered_invoices().length} dari {_invoices.length}</th>}
            info={<th colSpan={9}>Total {filtered_invoices().length}</th>}
            data={filtered_invoices()?.map((invoice, index) => (
              <tr key={index} className='hover:cursor-pointer'>
                {[
                  [(invoice?.createDate?.slice(0, 10) === '0000-00-00') ? '' : invoice?.createDate?.slice(0, 10)?.split('-')?.reverse()?.join('-'), ''],
                  [invoice?.info?.filter(info => info?.label?.toLowerCase()?.trim() === 'nama pelanggan')[0]?.value, ''],
                  [invoice?.info?.filter(info => info?.label?.toLowerCase()?.trim() === 'jenis kendaraan')[0]?.value, ''],
                  [invoice?.info?.filter(info => info?.label?.toLowerCase()?.trim() === 'nomor polisi')[0]?.value, 'whitespace-nowrap'],
                  [(invoice?.info?.filter(info => info?.label?.toLowerCase()?.trim() === 'tgl msk/tgl klr')[0]?.value?.slice(0, 10) === '0000-00-00') ? '' : invoice?.info?.filter(info => info?.label?.toLowerCase()?.trim() === 'tgl msk/tgl klr')[0]?.value?.slice(0, 10)?.split('-')?.reverse()?.join('-'), 'whitespace-nowrap'],
                  [invoice?.info?.filter(info => info?.label?.toLowerCase()?.trim() === 'kilometer')[0]?.value, 'whitespace-nowrap'],
                  [`Rp. ${splitString(invoice?.calculated, 3, '.')}`, 'text-right whitespace-nowrap']
                ].map(([value, className], index) => (
                  <td
                    key={index}
                    className={className}
                    onClick={() => navigate(`/invoice/form?_id=${invoice._id}`)}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          />
        )}
      />
    </>
  );
};
