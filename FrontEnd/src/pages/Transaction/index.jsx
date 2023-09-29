import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  DateTime,
  Input,
  Select,
  ConfirmationDialog
} from '../../components';
import { splitString, createTransactionPDF } from '../../functions';



export default function Type() {
  const navigate = useNavigate();

  const { transactions, services } = useSelector(state => state.app);

  const [combinedServices, setCombinedServices] = useState(null);
  const [filteredTransactions, setFilteredServices] = useState(null);
  const [filter, setFilter] = useState({
    dateTime: '',
    customerName: '',
    service_name: '',
    service_type: 'SEMUA',
    service_subType: '',
    service_class: 'SEMUA',
    service_price: '',
    service_quantity: '',
    totalPrice: '',
    paidStatus: 'SEMUA',
    note: ''
  });
  const [printInvoiceDialog, setPrintInvoiceDialog] = useState(false);



  useEffect(() => {
    if (transactions && services) {
      const newCombinedServices = [
        ...services.map(service => service.type.name),
        ...transactions.map(transaction => transaction.services.map(service => service.type))
      ].flat().filter((value, index, self) => self.indexOf(value) === index);
      setCombinedServices(newCombinedServices);
    }
  }, [transactions, services]);

  useEffect(() => {
    if (transactions) {
      const newFilteredTransactions = transactions.filter(transaction =>
        (!filter.dateTime?.split('T')[0]?.split('-')[2] || transaction.dateTime.split('T')[0].split('-')[2].includes(filter.dateTime?.split('T')[0]?.split('-')[2])) &&
        (!filter.dateTime?.split('T')[0]?.split('-')[1] || transaction.dateTime.split('T')[0].split('-')[1].includes(filter.dateTime?.split('T')[0]?.split('-')[1])) &&
        (!filter.dateTime?.split('T')[0]?.split('-')[0] || transaction.dateTime.split('T')[0].split('-')[0].includes(filter.dateTime?.split('T')[0]?.split('-')[0])) &&
        (!filter.dateTime?.split('T')[1]?.split(':')[0] || transaction.dateTime.split('T')[1].split(':')[0].includes(filter.dateTime?.split('T')[1]?.split(':')[0])) &&
        (!filter.dateTime?.split('T')[1]?.split(':')[1] || transaction.dateTime.split('T')[1].split(':')[1].includes(filter.dateTime?.split('T')[1]?.split(':')[1])) &&
        (!filter.customerName || transaction.customerName.includes(filter.customerName)) &&
        ((filter.service_type === 'SEMUA') || transaction.services.some(service => service.type.includes(filter.service_type))) &&
        (!filter.service_subType || ((filter.service_subType === '-') && transaction.services.some(service => !service.subType)) || transaction.services.some(service => service.subType?.includes(filter.service_subType))) &&
        (!filter.service_name || transaction.services.some(service => service.name.includes(filter.service_name))) &&
        ((filter.service_class === 'SEMUA') || transaction.services.some(service => service.class.includes(filter.service_class))) &&
        (!filter.service_price || transaction.services.some(service => service.price.toString().includes(filter.service_price))) &&
        (!filter.service_quantity || transaction.services.some(service => service.quantity.toString().includes(filter.service_quantity))) &&
        (!filter.totalPrice || (transaction.totalPrice.toString().includes(filter.totalPrice))) &&
        ((filter.paidStatus === 'SEMUA') || (JSON.parse(filter.paidStatus) && transaction.paidStatus) || (!JSON.parse(filter.paidStatus) && !transaction.paidStatus)) &&
        (!filter.note || ((filter.note === '-') && !transaction.note) || (transaction.note?.includes(filter.note)))
      );
      setFilteredServices(newFilteredTransactions);
    }
  }, [transactions, services, filter.customerName, filter.dateTime, filter.service_type, filter.service_subType, filter.service_name, filter.service_class, filter.service_price, filter.service_quantity, filter.totalPrice, filter.paidStatus, filter.note]);



  function clearFilter() {
    setFilter({
      dateTime: '',
      customerName: '',
      service_name: '',
      service_type: 'SEMUA',
      service_subType: '',
      service_class: 'SEMUA',
      service_price: '',
      service_quantity: '',
      totalPrice: '',
      paidStatus: 'SEMUA',
      note: ''
    });
  }



  return (
    <main>
      <div>
        <Button
          label='Tambah Transaksi'
          onClick={() => navigate('/transaction/form/create')}
          size='lg'
          color='blue'
        />
      </div>

      <div className='mt-4 overflow-auto'>
        <table className='w-full border border-blue-500'>
          <thead className='bg-blue-300'>
            <tr className='text-lg border-y border-blue-500'>
              <th rowSpan={2} className='p-2 border-x border-blue-500'>Tanggal</th>
              <th rowSpan={2} className='p-2 border-x border-blue-500'>Nama Pelanggan</th>
              <th colSpan={6} className='p-2 border-x border-blue-500'>Layanan</th>
              {['Total Harga', 'Status Bayar', 'Keterangan', 'Aksi'].map((title, index) => (
                <th
                  key={index}
                  rowSpan={2}
                  className='p-2 border-x border-blue-500'
                >
                  {title}
                </th>
              ))}
            </tr>
            <tr className='text-lg border-y border-blue-500'>
              {['Tipe', 'Subtipe', 'Nama', 'Kelas', 'Harga', 'Kuantitas'].map((title, index) => <th key={index} className='p-2 border-x border-blue-500'>{title}</th>)}
            </tr>
            {((transactions?.length > 0) && (combinedServices?.length > 0)) && (
              <>
                <tr className='border-y border-blue-500'>
                  <th className='p-2 border-x border-blue-500'>
                    <DateTime
                      className='font-normal'
                      value={filter.dateTime}
                      onChange={value => setFilter({...filter, dateTime: value})}
                      placeholder='filter tanggal'
                      size='md'
                    />
                  </th>
                  <th className='p-2 border-x border-blue-500'>
                    <Input
                      className='font-normal'
                      value={filter.customerName}
                      onChange={value => setFilter({...filter, customerName: value.trimStart().toUpperCase()})}
                      placeholder='filter nama pelanggan'
                      size='md'
                    />
                  </th>
                  <th className='p-2 border-x border-blue-500'>
                    <Select
                      className='font-normal'
                      value={filter.service_type}
                      options={['SEMUA', ...combinedServices].map(option => [option, option])}
                      onChange={value => setFilter({...filter, service_type: value})}
                      size='md'
                    />
                  </th>
                  <th className='p-2 border-x border-blue-500'>
                    <Input
                      className='font-normal'
                      value={filter.service_subType}
                      onChange={value => setFilter({...filter, service_subType: value.trimStart().toUpperCase()})}
                      placeholder='filter subtipe layanan'
                      size='md'
                    />
                  </th>
                  <th className='p-2 border-x border-blue-500'>
                    <Input
                      className='font-normal'
                      value={filter.service_name}
                      onChange={value => setFilter({...filter, service_name: value.trimStart().toUpperCase()})}
                      placeholder='filter nama layanan'
                      size='md'
                    />
                  </th>
                  <th className='p-2 border-x border-blue-500'>
                    <Select
                      className='font-normal'
                      value={filter.service_class}
                      options={['SEMUA', '1', '2', '3', '4', '5'].map(option => [option, option])}
                      onChange={value => setFilter({...filter, service_class: value})}
                      size='md'
                    />
                  </th>
                  <th className='p-2 border-x border-blue-500'>
                    <Input
                      className='font-normal'
                      value={filter.service_price}
                      onChange={value => setFilter({...filter, service_price: value.trim()})}
                      placeholder='filter harga layanan'
                      size='md'
                    />
                  </th>
                  <th className='p-2 border-x border-blue-500'>
                    <Input
                      className='font-normal'
                      value={filter.service_quantity}
                      onChange={value => setFilter({...filter, service_quantity: value.trim()})}
                      placeholder='filter kuantitas layanan'
                      size='md'
                    />
                  </th>
                  <th className='p-2 border-x border-blue-500'>
                    <Input
                      className='font-normal'
                      value={filter.totalPrice}
                      onChange={value => setFilter({...filter, totalPrice: value.trim()})}
                      placeholder='filter total harga'
                      size='md'
                    />
                  </th>
                  <th className='p-2 border-x border-blue-500'>
                    <Select
                      className='font-normal'
                      value={filter.paidStatus}
                      onChange={value => setFilter({...filter, paidStatus: value})}
                      options={[['SEMUA', 'SEMUA'], [true, 'LUNAS'], [false, 'TIDAK LUNAS']]}
                      size='md'
                    />
                  </th>
                  <th className='p-2 border-x border-blue-500'>
                    <Input
                      className='font-normal'
                      value={filter.note}
                      onChange={value => setFilter({...filter, note: value.trimStart().toUpperCase()})}
                      placeholder='filter keterangan'
                      size='md'
                    />
                  </th>
                  <th className='p-2 border-x border-blue-500 w-0 whitespace-nowrap'>
                    <Button
                      className='w-full font-normal'
                      label='Bersihkan Filter'
                      onClick={clearFilter}
                      size='md'
                    />
                  </th>
                </tr>
                <tr className='border-y border-blue-500'>
                  <th colSpan={12} className='p-2 text-start'>Total: {filteredTransactions?.length} dari {transactions.length}</th>
                </tr>
              </>
            )}
          </thead>
          <tbody>
            {!transactions ? (
              <tr>
                <td colSpan={12} className='p-2 text-center'>Sedang memuat data mohon tunggu ...</td>
              </tr>
            ) : (transactions.length === 0) ? (
              <tr>
                <td colSpan={12} className='p-2 text-center'>Data kosong.</td>
              </tr>
            ) : (filteredTransactions?.length === 0) && (
              <tr>
                <td colSpan={12} className='p-2 text-center'>Data tidak ditemukan.</td>
              </tr>
            )}
            {filteredTransactions?.map((transaction, index) => (
              [0, 1].map(thisIndex => !thisIndex ? (
                <tr key={thisIndex} className='border-t border-blue-500'>
                  <td className='p-2' rowSpan={transaction.services.length}>{transaction.dateTime.slice(8, 10)}-{transaction.dateTime.slice(5, 7)}-{transaction.dateTime.slice(0, 4)} {transaction.dateTime.slice(11, 13)}:{transaction.dateTime.slice(14, 16)}</td>
                  <td className='p-2' rowSpan={transaction.services.length}>{transaction.customerName}</td>
                  <td className='p-2'>{transaction.services[0].type}</td>
                  <td className='p-2'>{transaction.services[0].subType ? transaction.services[0].subType : '-'}</td>
                  <td className='p-2'>{transaction.services[0].name}</td>
                  <td className='p-2 text-center'>{transaction.services[0].class}</td>
                  <td className='p-2 text-end'>{splitString(transaction.services[0].price, 3, '.')}</td>
                  <td className='p-2 text-center'>{transaction.services[0].quantity}</td>
                  <td className='p-2 text-end' rowSpan={transaction.services.length}>{splitString(transaction.totalPrice, 3, '.')}</td>
                  <td className='p-2 text-center' rowSpan={transaction.services.length}>{transaction.paidStatus ? 'LUNAS' : 'TIDAK LUNAS'}</td>
                  <td className='p-2' rowSpan={transaction.services.length}>{transaction.note ? transaction.note : '-'}</td>
                  <td className='p-2' rowSpan={transaction.services.length}>
                    <div className='flex justify-center gap-4'>
                      <Button
                        label='Cetak Faktur'
                        onClick={() => setPrintInvoiceDialog(transaction)}
                        color='neutral'
                      />
                      <Button
                        label='Ubah'
                        onClick={() => navigate(`/transaction/form/update?_id=${transaction._id}`)}
                        color='yellow'
                      />
                      <Button
                        label='Hapus'
                        onClick={() => navigate(`/transaction/form/delete?_id=${transaction._id}`)}
                        color='red'
                      />
                    </div>
                  </td>
                </tr>
              ) : (transaction.services.length > 0) && transaction.services.map((service, thisIndex) => (thisIndex !== 0) && (
                <tr key={thisIndex}>
                  <td className='p-2'>{service.type}</td>
                  <td className='p-2'>{service.subType ? service.subType : '-'}</td>
                  <td className='p-2'>{service.name}</td>
                  <td className='p-2 text-center'>{service.class}</td>
                  <td className='p-2 text-end'>{splitString(service.price, 3, '.')}</td>
                  <td className='p-2 text-center'>{service.quantity}</td>
                </tr>
              )))
            ))}
          </tbody>
        </table>
      </div>

      {/* Print Invoice Dialog */}
      {printInvoiceDialog && (
        <ConfirmationDialog
          title='Print Faktur'
          description='Apakah anda ingin mencetak faktur?'
          onCancel={() => {setPrintInvoiceDialog(false); navigate('/transaction');}}
          onConfirm={() => {setPrintInvoiceDialog(false); createTransactionPDF(printInvoiceDialog); navigate('/transaction')}}
        />
      )}
    </main>
  );
};
