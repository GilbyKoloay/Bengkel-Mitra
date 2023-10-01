import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  useNavigate,
  useLocation,
  useParams,
  Navigate
} from 'react-router-dom';

import {
  Button,
  Select,
  InputDateTime,
  Input,
  ConfirmationDialog,
  InputOption
} from '../../../components';
import {
  Fetch,
  createSocket,
  notificationToast,
  getCurrentTime,
  toProperString,
  toProperDateTime,
  createTransactionInvoicePDF,
  splitString
} from '../../../functions';



export default function TransactionForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const isFormCreate = (location.pathname.split('/')[3] === 'create') ? true : false;
  const isFormUpdate = (location.pathname.split('/')[3] === 'update') ? true : false;
  const isFormDelete = (location.pathname.split('/')[3] === 'delete') ? true : false;

  const { _id } = useParams();

  const { _transactions, _services } = useSelector(state => state._app);

  const [isFormLoading, setIsFormLoading] = useState(isFormCreate ? false : true);
  const [isDateTimeAuto, setIsDateTimeAuto] = useState(isFormCreate ? true : false);
  const [dateTime, setDateTime] = useState('--T::00.000Z');
  const [customerName, setCustomerName] = useState('');
  const [services, setServices] = useState([{
    _id: null,
    query: '',
    type: null,
    subType: null,
    name: null,
    priceList: null,
    class: '',
    price: 0,
    quantity: 0
  }]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isPaid, setIsPaid] = useState(false);
  const [vehicleType, setVehicleType] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [note, setNote] = useState('');
  const [isDeleteConfirmationDialogOpen, setIsDeleteConfirmationDialogOpen] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isPrintInvoiceDialogOpen, setIsPrintInvoiceDialogOpen] = useState(false);



  useEffect(() => {
    if (isFormUpdate || isFormDelete) {
      const socket = createSocket();

      socket.on('transaction-update', updated_id => {
        if (_id === updated_id && !isPrintInvoiceDialogOpen) notificationToast('Data ini sudah diperbarui pengguna lain.', 'Tekan tombol \'Muat Ulang\' untuk melihat data yang terbaru.', 'warning');
      });

      socket.on('transaction-delete', deleted_id => {
        if (_id === deleted_id) {
          notificationToast('Data ini sudah dihapus pengguna lain.', null, 'warning');
          
          setTimeout(() => {
            navigate('/transaction');
          }, 2500);
        }
      });

      return () => socket.disconnect();
    }
  }, []);

  useEffect(() => {
    if (_transactions && _services && isFormLoading) {
      setIsFormLoading(false);
      loadForm();
    }
  }, [_transactions]);


  
  function clearForm() {
    setIsDateTimeAuto(true);
    setDateTime('--T::00.000Z');
    setCustomerName('');
    setServices([{
      _id: null,
      query: '',
      type: '',
      subType: '',
      name: '',
      priceList: null,
      class: '',
      price: 0,
      quantity: 0
    }]);
    setTotalPrice(0);
    setIsPaid(false);
    setVehicleType('');
    setVehiclePlate('');
    setNote('');
  }

  function loadForm() {
    const transaction = _transactions.filter(transaction => transaction._id === _id)[0];

    if (!transaction) navigate('/transaction');
    else {
      setDateTime(transaction.dateTime);
      setCustomerName(transaction.customerName);
      setServices([...transaction.services.map(service => ({
        ...service,
        query: `${service.type ? service.type : ''}${service.subType ? ` (${service.subType})` : ''} - ${service.name}`,
        priceList: _services.filter(thisService => thisService._id === service._id)[0].price
      })), {
        _id: null,
        query: '',
        type: '',
        subType: '',
        name: '',
        priceList: null,
        class: '',
        price: 0,
        quantity: 0
      }]);
      setTotalPrice(transaction.totalPrice);
      setIsPaid(transaction.isPaid);
      setVehicleType(transaction.vehicleType ? transaction.vehicleType : '');
      setVehiclePlate(transaction.vehiclePlate ? transaction.vehiclePlate : '');
      setNote(transaction.note ? transaction.note : '');
    }
  }

  async function formSubmit(e) {
    e?.preventDefault();
    setIsFormSubmitting(true);

    let payload = {};

    if (isFormCreate) {
      payload = {
        dateTime: isDateTimeAuto ? getCurrentTime() : toProperDateTime(dateTime),
        customerName: toProperString(customerName),
        services: services.filter(service => service.quantity > 0).map(service => ({
          _id: service._id,
          type: service.type,
          subType: service.subType,
          name: service.name,
          class: service.class,
          price: service.price,
          quantity: service.quantity
        })),
        totalPrice,
        isPaid,
        vehicleType: toProperString(vehicleType),
        vehiclePlate: toProperString(vehiclePlate),
        note: toProperString(note)
      };
    } else if (isFormUpdate) {
      payload = {
        _id,
        dateTime: isDateTimeAuto ? getCurrentTime() : toProperDateTime(dateTime),
        customerName: toProperString(customerName),
        services: services.filter(service => service.quantity > 0).map(service => ({
          _id: service._id,
          type: service.type,
          subType: service.subType,
          name: service.name,
          class: service.class,
          price: service.price,
          quantity: service.quantity
        })),
        totalPrice,
        isPaid,
        vehicleType: toProperString(vehicleType),
        vehiclePlate: toProperString(vehiclePlate),
        note: toProperString(note)
      };
    } else if (isFormDelete) {
      payload = {
        _id
      };
    }

    const res = await Fetch(
      '/transaction',
      isFormCreate ? 'POST' : isFormUpdate ? 'PUT' : isFormDelete ? 'DELETE' : undefined,
      payload, {title: `Sedang ${isFormCreate ? 'menambahkan' : isFormUpdate ? 'memperbarui' : isFormDelete ? 'menghapus' : ''} data transaksi ...`},
      true
    );
    if (res) {
      setIsFormSubmitting(false);
      if (res.ok) {
        setIsPrintInvoiceDialogOpen(payload);

        const socket = createSocket();
        if (isFormCreate) socket.emit('transaction-create');
        else if (isFormUpdate) socket.emit('transaction-update', _id);
        else if (isFormDelete) socket.emit('transaction-delete', _id);
      }
    }
  }

  function handleChangeService(newService, index) {
    let newServices = [...services];
    newServices[index] = newService;
    newServices = [...newServices.filter(service => service.query)];
    newServices.push({
      _id: null,
      query: '',
      type: '',
      subType: '',
      name: '',
      priceList: null,
      class: '',
      price: 0,
      quantity: 0
    });
    setServices(newServices);
    
    const newTotalPrice = newServices.reduce((thisTotalPrice, service) => {
      return thisTotalPrice + (service.price*service.quantity);
    }, 0);
    setTotalPrice(newTotalPrice);
  }



  if (!isFormCreate && !isFormUpdate && !isFormDelete) return <Navigate to='/transaction' />

  return (
    <main>
      <Button
        label='Kembali'
        onClick={() => navigate('/transaction')}
        size='md'
      />

      <div className='mt-4 text-2xl'>
        {isFormCreate ? 'Tambah ' :
        isFormUpdate ? 'Perbarui ' :
        isFormDelete ? 'Hapus ' : ''}
        Transaksi
      </div>

      {(!_services) ? (
        <div className='mt-4 text-lg'>Sedang memuat data layanan, mohon tunggu ...</div>
      ) : (_services.length === 0) ? (
        <div className='mt-4 text-lg'>Data layanan kosong, silahkan tambah data layanan terlebih dahulu</div>
      ) : (
        <form onSubmit={formSubmit} className='mt-4'>
          <div className='grid gap-4 grid-cols-1 sm:grid-cols-2'>
            <div className='flex flex-col gap-4'>
              <Input
                label='Nama Pelanggan'
                value={customerName}
                onChange={value => setCustomerName(value)}
                size='lg'
                disabled={isFormDelete || isFormSubmitting}
              />
              <Input
                label='Jenis Kendaraan'
                value={vehicleType}
                onChange={value => setVehicleType(value)}
                size='lg'
                disabled={isFormDelete || isFormSubmitting}
              />
              <Input
                label='Plat Kendaraan'
                value={vehiclePlate}
                onChange={value => setVehiclePlate(value)}
                size='lg'
                disabled={isFormDelete || isFormSubmitting}
              />
              {services.map((service, index) => (
                <div key={index} className='flex gap-2 border border-neutral-700 rounded p-4'>
                  <div className='flex-1 flex flex-col justify-between'>
                    <InputOption
                      label={`Layanan ${index+1}`}
                      value={service._id ? `${service.type ? `${service.type}` : '-'}${service.subType ? ` (${service.subType})` : ''} - ${service.name}` : service.query}
                      options={_services.map(thisService => [thisService, `${thisService.type ? thisService.type.name : ''}${thisService.subType ? ` (${thisService.subType})` : ''} - ${thisService.name}`])}
                      onChange={value => value[0] ? handleChangeService({
                        _id: value[0]._id,
                        query: value[1],
                        type: value[0].type?.name,
                        subType: value[0].subType,
                        name: value[0].name,
                        priceList: value[0].price,
                        class: '',
                        price: 0,
                        quantity: 0
                      }, index) : handleChangeService({
                        ...service,
                        query: value[1]
                      }, index)}
                      placeholder='Tipe (Subtipe) - Nama'
                      size='lg'
                      disabled={isFormDelete || isFormSubmitting}
                    />
                    <Select
                      label='Kelas'
                      value={service.class}
                      options={service.priceList ? Object.keys(service.priceList).filter(key => service.priceList[key]).map(key => [key.slice(-1), `Kelas ${key.slice(-1)} (${splitString(service.priceList[key], 3, '.')})`]) : []}
                      onChange={value => {
                        handleChangeService({...service,
                          class: value,
                          price: service.priceList[`class${value}`],
                          quantity: 1
                        }, index);
                      }}
                      placeholder='Kelas (Harga)'
                      size='lg'
                      disabled={!service._id || isFormDelete || isFormSubmitting}
                    />
                  </div>
                  <div className='w-1/4 sm:w-1/5 flex flex-col'>
                    <label className='text-xl'>Kuantitas</label>
                    <div className='flex-1 grid gap-2'>
                      <Button
                        label='+'
                        onClick={() => handleChangeService({...service,
                          quantity: service.quantity+1
                        }, index)}
                        theme='blue'
                        disabled={!service._id || !service.class || isFormDelete || isFormSubmitting}
                      />
                      <Input
                        value={service.quantity}
                        size='lg'
                        disabled
                      />
                      <Button
                        label='-'
                        onClick={() => (service.quantity === 1) ? handleChangeService({
                          ...service,
                          query: ''
                        }, index) : handleChangeService({...service,
                          quantity: service.quantity-1
                        }, index)}
                        theme='red'
                        disabled={!service._id || !service.class || isFormDelete || isFormSubmitting}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className='flex flex-col gap-4'>
              <Select
                label='Tanggal & Waktu'
                value={isDateTimeAuto}
                options={[[true, 'AUTOMATIS'], [false, 'MANUAL']].map(option => [option[0], option[1]])}
                onChange={value => setIsDateTimeAuto(JSON.parse(value))}
                size='lg'
                disabled={isFormDelete || isFormSubmitting}
              />
              {!isDateTimeAuto && (
                <InputDateTime
                  className='-mt-4'
                  value={dateTime}
                  onChange={value => setDateTime(value)}
                  size='lg'
                  disabled={isFormDelete || isFormSubmitting}
                />
              )}
              <Select
                label='Status Bayar'
                value={isPaid}
                options={[[true, 'LUNAS'], [false, 'TIDAK LUNAS']].map(option => [option[0], option[1]])}
                onChange={value => setIsPaid(JSON.parse(value))}
                size='lg'
                theme={isPaid ? 'green' : 'red'}
                disabled={isFormDelete || isFormSubmitting}
              />
              <Input
                label='Keterangan'
                value={note}
                onChange={value => setNote(value)}
                size='lg'
                disabled={isFormDelete || isFormSubmitting}
              />
              <div>
                <label className='text-xl'>Total Layanan</label>
                <table className='w-full'>
                  <thead>
                    <tr className='bg-neutral-300'>
                      {[
                        'No.',
                        'Layanan',
                        'Kelas',
                        'Harga',
                        'Kuantitas',
                        'Total Harga'
                      ].map((title, index) => (
                        <th key={index} className='p-2 border border-neutral-700'>{title}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {services.filter(service => service._id && (service.quantity > 0)).map((service, index) => (
                      <tr key={index}>
                        <td className='p-2 border border-neutral-700 text-center'>{index+1}</td>
                        <td className='p-2 border border-neutral-700'>{service.type ? service.type : '-'}{service.subType ? ` (${service.subType})` : ''} - {service.name}</td>
                        <td className='p-2 border border-neutral-700 text-center'>{service.class}</td>
                        <td className='p-2 border border-neutral-700 text-end'>{splitString(service.price, 3, '.')}</td>
                        <td className='p-2 border border-neutral-700 text-end'>{service.quantity}</td>
                        <td className='p-2 border border-neutral-700 text-end'>{splitString(service.price*service.quantity, 3, '.')}</td>
                      </tr>
                    ))}
                    <tr className='bg-neutral-300'>
                      <td colSpan={5} className='p-2 border border-neutral-700 text-xl font-bold'>Total</td>
                      <td className='p-2 border border-neutral-700 text-xl font-bold text-end whitespace-nowrap'>Rp. {splitString(totalPrice, 3, '.')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {isFormCreate ? (
            <div className='mt-8 grid gap-4 grid-cols-1 sm:grid-cols-2'>
              <Button
                label='Bersihkan'
                onClick={clearForm}
                size='lg'
                disabled={isFormSubmitting}
              />
              <Button
                label='Tambah'
                type='submit'
                size='lg'
                theme='blue'
                disabled={isFormSubmitting}
              />
            </div>
          ) : isFormUpdate ? (
            <div className='mt-8 grid gap-4 grid-cols-1 sm:grid-cols-3'>
              <Button
                label='Bersihkan'
                onClick={clearForm}
                size='lg'
                disabled={isFormSubmitting}
              />
              <Button
                label='Muat Ulang'
                onClick={loadForm}
                size='lg'
                disabled={isFormSubmitting}
              />
              <Button
                label='Perbarui'
                type='submit'
                size='lg'
                theme='blue'
                disabled={isFormSubmitting}
              />
            </div>
          ) : isFormDelete && (
            <div className='mt-8 grid gap-4 grid-cols-1 sm:grid-cols-2'>
              <Button
                label='Muat Ulang'
                onClick={loadForm}
                size='lg'
                disabled={isFormSubmitting}
              />
              <Button
                label='Hapus'
                onClick={() => setIsDeleteConfirmationDialogOpen(true)}
                size='lg'
                theme='red'
                disabled={isFormSubmitting}
              />
            </div>
          )}
        </form>
      )}



      {(isFormDelete && isDeleteConfirmationDialogOpen) && (
        <ConfirmationDialog
          title='Konfirmasi penghapusan data'
          description='Apakah anda yakin ingin menghapus data ini?'
          onCancel={() => setIsDeleteConfirmationDialogOpen(false)}
          onConfirm={() => {setIsDeleteConfirmationDialogOpen(false); formSubmit(); setIsDeleteConfirmationDialogOpen(false);}}
          theme='red'
        />
      )}

      {isPrintInvoiceDialogOpen && (
        <ConfirmationDialog
          title='Konfirmasi pencetakan faktur'
          description='Apakah anda ingin mencetak faktur?'
          onCancel={() => {setIsPrintInvoiceDialogOpen(false); navigate('/transaction');}}
          onConfirm={() => {setIsPrintInvoiceDialogOpen(false); createTransactionInvoicePDF(isPrintInvoiceDialogOpen); navigate('/transaction');}}
          theme='blue'
        />
      )}
    </main>
  );
};
