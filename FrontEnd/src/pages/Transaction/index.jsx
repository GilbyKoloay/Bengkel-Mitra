import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  InputDateTime,
  Input,
  Select
} from '../../components';
import { createTransactionInvoicePDF, splitString, toProperString } from '../../functions';



export default function Transaction() {
  const navigate = useNavigate();
  
  const { _transactions } = useSelector(state => state._app);

  const [dateTime, setDateTime] = useState('--T::00.000Z');
  const [customerName, setCustomerName] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [service_type_name, setService_type_name] = useState('');
  const [service_subType, setService_subType] = useState('');
  const [service_name, setService_name] = useState('');
  const [service_class, setService_class] = useState('');
  const [service_price, setService_price] = useState('');
  const [service_quantity, setService_quantity] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [isPaid, setIsPaid] = useState('SEMUA');
  const [note, setNote] = useState('');



  function clearFilter() {
    setDateTime('--T::00.000Z');
    setCustomerName('');
    setVehicleType('');
    setVehiclePlate('');
    setService_type_name('');
    setService_subType('');
    setService_name('');
    setService_class('');
    setService_price('');
    setService_quantity('');
    setTotalPrice('');
    setIsPaid('SEMUA');
    setNote('');
  }

  function filtered_transactions() {
    return _transactions?.filter(transaction =>
      (!dateTime.split('T')[0].split('-')[2] || transaction.dateTime.split('T')[0].split('-')[2].includes(dateTime.split('T')[0].split('-')[2])) &&
      (!dateTime.split('T')[0].split('-')[1] || transaction.dateTime.split('T')[0].split('-')[1].includes(dateTime.split('T')[0].split('-')[1])) &&
      (!dateTime.split('T')[0].split('-')[0] || transaction.dateTime.split('T')[0].split('-')[0].includes(dateTime.split('T')[0].split('-')[0])) &&
      (!dateTime.split('T')[1].split(':')[0] || transaction.dateTime.split('T')[1].split(':')[0].includes(dateTime.split('T')[1].split(':')[0])) &&
      (!dateTime.split('T')[1].split(':')[1] || transaction.dateTime.split('T')[1].split(':')[1].includes(dateTime.split('T')[1].split(':')[1])) &&
      (!customerName || transaction.customerName.includes(toProperString(customerName))) &&
      (!vehicleType || ((vehicleType === '-') && !transaction.vehicleType) || transaction.vehicleType?.includes(toProperString(vehicleType))) &&
      (!vehiclePlate || ((vehiclePlate === '-') && !transaction.vehiclePlate) || transaction.vehiclePlate?.includes(toProperString(vehiclePlate))) &&
      (!service_type_name || transaction.services.some(service => service.type.includes(toProperString(service_type_name)))) &&
      (!service_subType || ((service_subType === '-') && transaction.services.some(service => !service.subType)) || transaction.services.some(service => service.subType?.includes(toProperString(service_subType)))) &&
      (!service_name || transaction.services.some(service => service.name.includes(toProperString(service_name)))) &&
      (!service_class || transaction.services.some(service => service.class.includes(toProperString(service_class)))) &&
      (!service_price || transaction.services.some(service => service.price.toString().includes(toProperString(service_price)))) &&
      (!service_quantity || transaction.services.some(service => service.quantity.toString().includes(toProperString(service_quantity)))) &&
      (!totalPrice || transaction.totalPrice.toString().includes(totalPrice)) &&
      (isPaid === 'SEMUA' || (transaction.isPaid && JSON.parse(isPaid)) || (!transaction.isPaid && !JSON.parse(isPaid))) &&
      (!note || ((note === '-') && !transaction.note) || transaction.note?.includes(toProperString(note)))
    );
  }



  return (
    <main>
      <Button
        className='whitespace-nowrap'
        label='Tambah Transaksi'
        onClick={() => navigate('/transaction/form/create')}
        size='md'
        theme='blue'
      />

      {!_transactions ? (
        <div className='mt-4 text-center text-xl'>Sedang memuat data, mohon tunggu ...</div>
      ) : (_transactions.length === 0) ? (
        <div className='mt-4 text-center text-xl'>Data kosong</div>
      ) : (
        <div className='mt-8 overflow-auto'>
          <div className='text-2xl'>Data Transaksi</div>
          <table className='mt-4 w-full'>
            <thead className='bg-blue-500 border-2 border-blue-700'>
              <tr>
                {['Tanggal & Waktu', 'Nama Pelanggan'].map((title, index) => <th key={index} rowSpan={2} className='border border-blue-700 p-2'>{title}</th>)}
                {['Kendaraan'].map((title, index) => <th key={index} colSpan={2} className='border border-blue-700 p-2'>{title}</th>)}
                {['Layanan'].map((title, index) => <th key={index} colSpan={6} className='border border-blue-700 p-2'>{title}</th>)}
                {['Total Harga', 'Status Bayar', 'Keterangan', 'Aksi'].map((title, index) => <th key={index} rowSpan={2} className='border border-blue-700 p-2'>{title}</th>)}
              </tr>
              <tr>
                {['Jenis', 'Plat', 'Tipe', 'Subtipe', 'Nama', 'Kelas', 'Harga', 'Kuantitas'].map((title, index) => <th key={index} className='border border-blue-700 p-2'>{title}</th>)}
              </tr>
              <tr>
                <th className='border border-blue-700 font-normal p-2'>
                  <InputDateTime
                    value={dateTime}
                    onChange={value => setDateTime(value)}
                  />
                </th>
                <th className='border border-blue-700 font-normal p-2'>
                  <Input
                    value={customerName}
                    onChange={value => setCustomerName(value)}
                    placeholder='filter'
                  />
                </th>
                <th className='border border-blue-700 font-normal p-2'>
                  <Input
                    value={vehicleType}
                    onChange={value => setVehicleType(value)}
                    placeholder='filter'
                  />
                </th>
                <th className='border border-blue-700 font-normal p-2'>
                  <Input
                    value={vehiclePlate}
                    onChange={value => setVehiclePlate(value)}
                    placeholder='filter'
                  />
                </th>
                <th className='border border-blue-700 font-normal p-2'>
                  <Input
                    value={service_type_name}
                    onChange={value => setService_type_name(value)}
                    placeholder='filter'
                  />
                </th>
                <th className='border border-blue-700 font-normal p-2'>
                  <Input
                    value={service_subType}
                    onChange={value => setService_subType(value)}
                    placeholder='filter'
                  />
                </th>
                <th className='border border-blue-700 font-normal p-2'>
                  <Input
                    value={service_name}
                    onChange={value => setService_name(value)}
                    placeholder='filter'
                  />
                </th>
                <th className='border border-blue-700 font-normal p-2'>
                  <Input
                    value={service_class}
                    onChange={value => setService_class(value)}
                    placeholder='filter'
                  />
                </th>
                <th className='border border-blue-700 font-normal p-2'>
                  <Input
                    value={service_price}
                    onChange={value => setService_price(value)}
                    placeholder='filter'
                  />
                </th>
                <th className='border border-blue-700 font-normal p-2'>
                  <Input
                    value={service_quantity}
                    onChange={value => setService_quantity(value)}
                    placeholder='filter'
                  />
                </th>
                <th className='border border-blue-700 font-normal p-2'>
                  <Input
                    value={totalPrice}
                    onChange={value => setTotalPrice(value)}
                    placeholder='filter'
                  />
                </th>
                <th className='border border-blue-700 font-normal p-2'>
                  <Select
                    value={isPaid}
                    options={[
                      ['SEMUA', 'SEMUA'],
                      [true, 'LUNAS'],
                      [false, 'TIDAK LUNAS']
                    ]}
                    onChange={value => setIsPaid(value)}
                    placeholder='filter'
                  />
                </th>
                <th className='border border-blue-700 font-normal p-2'>
                  <Input
                    value={note}
                    onChange={value => setNote(value)}
                    placeholder='filter'
                  />
                </th>
                <th className='border border-blue-700 font-normal p-2 whitespace-nowrap'>
                  <Button
                    className='w-full'
                    label='Bersihkan filter'
                    onClick={clearFilter}
                  />
                </th>
              </tr>
              <tr>
                <th colSpan={14} className='text-left p-2 font-normal'>Total {filtered_transactions().length} dari {_transactions.length}</th>
              </tr>
            </thead>
            <tbody className='border-2 border-blue-700'>
              {filtered_transactions().map(transaction => [0, 1].map(index => !index ? (
                <tr key={index} className='border-t border-neutral-500'>
                  <td rowSpan={transaction.services.length} className='p-2 align-text-top'>{transaction.dateTime.slice(0, 10).split('-').reverse().join('-')} {transaction.dateTime.slice(11, 16)}</td>
                  <td rowSpan={transaction.services.length} className='p-2 align-text-top'>{transaction.customerName}</td>
                  <td rowSpan={transaction.services.length} className='p-2 align-text-top'>{transaction.vehicleType ? transaction.vehicleType : '-'}</td>
                  <td rowSpan={transaction.services.length} className='p-2 align-text-top'>{transaction.vehiclePlate ? transaction.vehiclePlate : '-'}</td>
                  <td className='p-2'>{transaction.services[0].type}</td>
                  <td className='p-2'>{transaction.services[0].subType ? transaction.services[0].subType : '-'}</td>
                  <td className='p-2'>{transaction.services[0].name}</td>
                  <td className='p-2 text-center'>{transaction.services[0].class}</td>
                  <td className='p-2 text-end'>{splitString(transaction.services[0].price, 3, '.')}</td>
                  <td className='p-2 text-end'>{transaction.services[0].quantity}</td>
                  <td rowSpan={transaction.services.length} className='p-2 align-text-top text-right'>{splitString(transaction.totalPrice, 3, '.')}</td>
                  <td rowSpan={transaction.services.length} className='p-2 align-text-top'>{transaction.isPaid ? 'LUNAS' : 'TIDAK LUNAS'}</td>
                  <td rowSpan={transaction.services.length} className='p-2 align-text-top'>{transaction.note ? transaction.note : '-'}</td>
                  <td rowSpan={transaction.services.length} className='p-2 align-text-top'>
                    <Select
                      options={[
                        'CETAK FAKTUR',
                        'PERBARUI',
                        'HAPUS'
                      ].map(option => [option, option])}
                      onChange={value => {
                        if (value === 'CETAK FAKTUR') createTransactionInvoicePDF(transaction);
                        else if (value === 'PERBARUI') navigate(`/transaction/form/update/${transaction._id}`);
                        else if (value === 'HAPUS') navigate(`/transaction/form/delete/${transaction._id}`);
                      }}
                      placeholder='(Aksi)'
                    />
                  </td>
                </tr>
              ) : (transaction.services.length > 0) && transaction.services.map((service, thisIndex) => (thisIndex > 0) && (
                <tr key={thisIndex} className='border-t border-neutral-500'>
                  <td className='p-2'>{service.type}</td>
                  <td className='p-2'>{service.subType ? service.subType : '-'}</td>
                  <td className='p-2'>{service.name}</td>
                  <td className='p-2 text-center'>{service.class}</td>
                  <td className='p-2 text-end'>{splitString(service.price, 3, '.')}</td>
                  <td className='p-2 text-end'>{service.quantity}</td>
                </tr>
              ))))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};
