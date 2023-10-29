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
  const [entryDate, setEntryDate] = useState('--T00:00:00.000Z');
  const [outDate, setOutDate] = useState('--T00:00:00.000Z');
  const [kilometer, setKilometer] = useState('');
  const [totalPrice, setTotalPrice] = useState('');



  function filtered_invoices() {
    return _invoices?.filter(invoice =>
      (!createDate.split('T')[0].split('-')[2] || invoice.createDate?.split('T')[0].split('-')[2].includes(createDate.split('T')[0].split('-')[2])) &&
      (!createDate.split('T')[0].split('-')[1] || invoice.createDate?.split('T')[0].split('-')[1].includes(createDate.split('T')[0].split('-')[1])) &&
      (!createDate.split('T')[0].split('-')[0] || invoice.createDate?.split('T')[0].split('-')[0].includes(createDate.split('T')[0].split('-')[0])) &&
      (!customerName || ((customerName === '-') && !invoice.customerName) || invoice.customerName?.includes(toProperString(customerName))) &&
      (!vehicleType || ((vehicleType === '-') && !invoice.vehicleType) || invoice.vehicleType?.includes(toProperString(vehicleType))) &&
      (!vehiclePlate || ((vehiclePlate === '-') && !invoice.vehiclePlate) || invoice.vehiclePlate?.includes(toProperString(vehiclePlate))) &&
      (!entryDate.split('T')[0].split('-')[2] || invoice.entryDate?.split('T')[0]?.split('-')[2]?.includes(entryDate.split('T')[0].split('-')[2])) &&
      (!entryDate.split('T')[0].split('-')[1] || invoice.entryDate?.split('T')[0]?.split('-')[1]?.includes(entryDate.split('T')[0].split('-')[1])) &&
      (!entryDate.split('T')[0].split('-')[0] || invoice.entryDate?.split('T')[0]?.split('-')[0]?.includes(entryDate.split('T')[0].split('-')[0])) &&
      (!outDate.split('T')[0].split('-')[2] || invoice.outDate?.split('T')[0]?.split('-')[2]?.includes(outDate.split('T')[0].split('-')[2])) &&
      (!outDate.split('T')[0].split('-')[1] || invoice.outDate?.split('T')[0]?.split('-')[1]?.includes(outDate.split('T')[0].split('-')[1])) &&
      (!outDate.split('T')[0].split('-')[0] || invoice.outDate?.split('T')[0]?.split('-')[0]?.includes(outDate.split('T')[0].split('-')[0])) &&
      (!kilometer || ((kilometer === '-') && !invoice.kilometer) || invoice.kilometer?.toString()?.includes(toProperString(kilometer))) &&
      (!totalPrice || ((totalPrice === '-') && !invoice.totalPrice) || invoice.totalPrice?.toString()?.includes(toProperString(totalPrice)))
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
              onClick={() => navigate('/invoice/form/create')}
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
                  'Tanggal Masuk',
                  'Tanggal Keluar',
                  'Kilometer',
                  'Total Harga'
                ].map((title, index) => <th key={index}>{title}</th>)}
              </>
            ]}
            filters={
              <>
                <th>
                  <InputDate
                    useTime={false}
                    value={createDate}
                    onChange={value => setCreateDate(value)}
                    placeholder='filter'
                  />
                </th>
                <th>
                  <Input
                    value={customerName}
                    onChange={value => setCustomerName(value)}
                    placeholder='filter'
                  />
                </th>
                <th>
                  <Input
                    value={vehicleType}
                    onChange={value => setVehicleType(value)}
                    placeholder='filter'
                  />
                </th>
                <th>
                  <Input
                    value={vehiclePlate}
                    onChange={value => setVehiclePlate(value)}
                    placeholder='filter'
                  />
                </th>
                <th>
                  <InputDate
                    useTime={false}
                    value={entryDate}
                    onChange={value => setEntryDate(value)}
                    placeholder='filter'
                  />
                </th>
                <th>
                  <InputDate
                    useTime={false}
                    value={outDate}
                    onChange={value => setOutDate(value)}
                    placeholder='filter'
                  />
                </th>
                <th>
                  <Input
                    value={kilometer}
                    onChange={value => setKilometer(value)}
                    placeholder='filter'
                  />
                </th>
                <th>
                  <Input
                    value={totalPrice}
                    onChange={value => setTotalPrice(value)}
                    placeholder='filter'
                  />
                </th>
              </>
            }
            info={<th colSpan={10}>Total {filtered_invoices().length} dari {_invoices.length}</th>}
            data={filtered_invoices()?.map((invoice, index) => (
              <tr key={index} className='hover:cursor-pointer'>
                {[
                  [invoice?.createDate?.slice(0, 10)?.split('-')?.reverse()?.join('-'), ''],
                  [invoice?.customerName, ''],
                  [invoice?.vehicleType, ''],
                  [invoice?.vehiclePlate, 'whitespace-nowrap'],
                  [invoice?.entryDate?.slice(0, 10)?.split('-')?.reverse()?.join('-'), ''],
                  [invoice?.outDate?.slice(0, 10)?.split('-')?.reverse()?.join('-'), ''],
                  [invoice?.kilometer, ''],
                  [`Rp. ${splitString(invoice?.totalPrice, 3, '.')}`, 'text-right whitespace-nowrap']
                ].map(([value, className], index) => (
                  <td
                    key={index}
                    className={className}
                    onClick={() => navigate(`/invoice/${invoice._id}`)}
                  >
                    {value ? value : '-'}
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
