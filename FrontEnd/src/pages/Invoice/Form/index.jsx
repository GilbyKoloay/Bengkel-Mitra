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
} from '../../../components';
import {
  Fetch,
  createSocket,
  notificationToast,
  getCurrentTime,
  toProperString,
  toProperDateTime,
  createInvoicePDF
} from '../../../functions';
import { Form } from '../../../layouts';



export default function InvoiceForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const isFormCreate = (location.pathname.split('/')[3] === 'create') ? true : false;
  const isFormUpdate = (location.pathname.split('/')[3] === 'update') ? true : false;
  const isFormDelete = (location.pathname.split('/')[3] === 'delete') ? true : false;

  const { _id } = useParams();

  const { _invoices } = useSelector(state => state._app);

  const [isFormLoading, setIsFormLoading] = useState(isFormCreate ? false : true);
  
  const [isCreateDateAuto, setIsCreateDateAuto] = useState(isFormCreate ? true : false);
  const [createDate, setCreateDate] = useState('--T00:00:00.000Z');
  const [customerName, setCustomerName] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [entryDate, setEntryDate] = useState('--T00:00:00.000Z');
  const [outDate, setOutDate] = useState('--T00:00:00.000Z');
  const [kilometer, setKilometer] = useState('');
  const [services, setServices] = useState([{
    primary: [''],
    secondary: [''],
    price: ''
  }]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [note, setNote] = useState('');
  const [isDeleteConfirmationDialogOpen, setIsDeleteConfirmationDialogOpen] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isPrintInvoiceDialogOpen, setIsPrintInvoiceDialogOpen] = useState(false);



  useEffect(() => {
    if (isFormUpdate || isFormDelete) {
      const socket = createSocket();

      socket.on('invoice-update', updated_id => {
        if (_id === updated_id && !isPrintInvoiceDialogOpen) notificationToast('Data ini sudah diperbarui pengguna lain.', 'Tekan tombol \'Muat Ulang\' untuk melihat data yang terbaru.', 'warning');
      });

      socket.on('invoice-delete', deleted_id => {
        if (_id === deleted_id) {
          notificationToast('Data ini sudah dihapus pengguna lain.', null, 'warning');
          
          setTimeout(() => {
            navigate('/invoice');
          }, 2500);
        }
      });

      return () => socket.disconnect();
    }
  }, []);

  useEffect(() => {
    if (_invoices && isFormLoading) {
      setIsFormLoading(false);
      loadForm();
    }
  }, [_invoices]);


  
  function clearForm() {
    setIsCreateDateAuto(true);
    setCreateDate('--T00:00:00.000Z');
    setCustomerName('');
    setVehicleType('');
    setVehiclePlate('');
    setEntryDate('--T00:00:00.000Z');
    setOutDate('--T00:00:00.000Z');
    setKilometer('');
    setServices([{
      primary: [''],
      secondary: [''],
      price: ''
    }]);
    setTotalPrice(0);
    setNote('');
  }

  function loadForm() {
    const invoice = _invoices.filter(invoice => invoice._id === _id)[0];

    if (!invoice) navigate('/invoice');
    else {
      setIsCreateDateAuto(false);
      setCreateDate(invoice.createDate);
      setCustomerName(invoice.customerName ? invoice.customerName : '');
      setVehicleType(invoice.vehicleType ? invoice.vehicleType : '');
      setVehiclePlate(invoice.vehiclePlate ? invoice.vehiclePlate : '');
      setEntryDate(invoice.outDate ? invoice.outDate : '--T00:00:00.000Z');
      setOutDate(invoice.entryDate ? invoice.entryDate : '--T00:00:00.000Z');
      setKilometer(invoice.kilometer ? invoice.kilometer : '');
      setServices([...invoice.services.map(service => ({
        primary: [...service.primary, ''],
        secondary: [...service.secondary, ''],
        price: service.price.toString()
      })), {
        primary: [''],
        secondary: [''],
        price: ''
      }]);
      setTotalPrice(invoice.totalPrice.toString());
      setNote(invoice.note ? invoice.note : '');
    }
  }

  async function formSubmit(e) {
    e?.preventDefault();
    setIsFormSubmitting(true);

    let payload = {};

    if (isFormCreate) {
      payload = {
        createDate: isCreateDateAuto ? getCurrentTime() : toProperDateTime(createDate),
        customerName: toProperString(customerName),
        vehicleType: toProperString(vehicleType),
        vehiclePlate: toProperString(vehiclePlate),
        entryDate: toProperDateTime(entryDate),
        outDate: toProperDateTime(outDate),
        kilometer: parseInt(kilometer),
        services: services.slice(0, -1).map(service => ({
          primary: service.primary.slice(0, -1).map(primary => toProperString(primary)),
          secondary: service.secondary.slice(0, -1).map(secondary => toProperString(secondary)),
          price: parseInt(service.price)
        })),
        totalPrice: parseInt(totalPrice),
        note: toProperString(note)
      };
    } else if (isFormUpdate) {
      payload = {
        _id,
        createDate: isCreateDateAuto ? getCurrentTime() : toProperDateTime(createDate),
        customerName: toProperString(customerName),
        vehicleType: toProperString(vehicleType),
        vehiclePlate: toProperString(vehiclePlate),
        entryDate: toProperDateTime(entryDate),
        outDate: toProperDateTime(outDate),
        kilometer: parseInt(kilometer),
        services: services.slice(0, -1).map(service => ({
          primary: service.primary.slice(0, -1).map(primary => toProperString(primary)),
          secondary: service.secondary.slice(0, -1).map(secondary => toProperString(secondary)),
          price: parseInt(service.price)
        })),
        totalPrice: parseInt(totalPrice),
        note: toProperString(note)
      };
    } else if (isFormDelete) {
      payload = {
        _id
      };
    }

    const res = await Fetch(
      '/invoice',
      isFormCreate ? 'POST' : isFormUpdate ? 'PUT' : isFormDelete ? 'DELETE' : undefined,
      payload, {title: `Sedang ${isFormCreate ? 'menambahkan' : isFormUpdate ? 'memperbarui' : isFormDelete ? 'menghapus' : ''} data transaksi ...`},
      true
    );
    if (res) {
      setIsFormSubmitting(false);
      if (res.ok) {
        const socket = createSocket();
        if (isFormCreate) socket.emit('invoice-create');
        else if (isFormUpdate) socket.emit('invoice-update', _id);
        else if (isFormDelete) socket.emit('invoice-delete', _id);

        if (isFormDelete) navigate('/invoice');
        else setIsPrintInvoiceDialogOpen(payload);
      }
    }
  }

  function handleServiceChange(newService, index) {
    let newServices = [...services];
    newServices[index] = newService;
    newServices = [...newServices
      .map(service => ({
        primary: [...service.primary.filter(primary => primary), ''],
        secondary: [...service.secondary.filter(secondary => secondary), ''],
        price: service.price
      }))
      .filter(service =>
        service.primary.length > 1 ||
        service.secondary.length > 1 ||
        service.price
      ),
      {
        primary: [''],
        secondary: [''],
        price: ''
      }
    ];
    setServices(newServices);

    const newTotalPrice = newServices.slice(0, -1).reduce((thisTotalPrice, service) => {
      return thisTotalPrice + parseInt(service.price)
    }, 0);
    setTotalPrice(newTotalPrice);
  }



  if (!isFormCreate && !isFormUpdate && !isFormDelete) return <Navigate to='/invoice' />

  return (
    <>
      <Form
        title={`${isFormCreate ? 'Tambah' : isFormUpdate ? 'Perbarui' : isFormDelete ? 'Hapus' : ''} Faktur`}
        form={
          <div className='flex-1 overflow-auto gap-y-2 gap-x-4 flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3'>
            <div className='flex flex-col gap-2'>
              <Select
                label='Tanggal & Waktu'
                value={isCreateDateAuto}
                options={[[true, 'AUTOMATIS'], [false, 'MANUAL']].map(option => [option[0], option[1]])}
                onChange={value => setIsCreateDateAuto(JSON.parse(value))}
                size='lg'
                disabled={isFormDelete || isFormSubmitting}
              />
              {!isCreateDateAuto && (
                <InputDateTime
                  useTime={false}
                  value={createDate}
                  onChange={value => setCreateDate(value)}
                  size='lg'
                  disabled={isFormDelete || isFormSubmitting}
                />
              )}
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
              <InputDateTime
                label='Tanggal Masuk'
                useTime={false}
                value={entryDate}
                onChange={value => setEntryDate(value)}
                size='lg'
                disabled={isFormDelete || isFormSubmitting}
              />
              <InputDateTime
                label='Tanggal Keluar'
                useTime={false}
                value={outDate}
                onChange={value => setOutDate(value)}
                size='lg'
                disabled={isFormDelete || isFormSubmitting}
              />
              <Input
                label='Kilometer'
                value={kilometer}
                onChange={value => setKilometer(value)}
                size='lg'
                disabled={isFormDelete || isFormSubmitting}
              />
            </div>
            <div className='flex flex-col gap-2'>
              {services.map((service, index) => (
                <div key={index} className='flex flex-col gap-2 border border-neutral-700 rounded p-4'>
                  <label className='text-xl'>Pekerjaan {index+1}</label>
                  <div className='grid grid-cols-2 gap-2'>
                    <div className='flex flex-col'>
                      <label className='text-xl'>Primer</label>
                      {service.primary.map((primary, subIndex) => (
                        <Input
                          key={subIndex}
                          value={primary}
                          onChange={value => handleServiceChange({
                            ...service,
                            primary: service.primary.map((thisPrimary, thisIndex) => (thisIndex === subIndex) ? value : thisPrimary)
                          }, index)}
                          size='lg'
                          disabled={isFormDelete || isFormSubmitting}
                        />
                      ))}
                    </div>
                    <div className='flex flex-col'>
                      <label className='text-xl'>Sekunder</label>
                      {service.secondary.map((secondary, subIndex) => (
                        <Input
                          key={subIndex}
                          value={secondary}
                          onChange={value => handleServiceChange({
                            ...service,
                            secondary: service.secondary.map((thisSecondary, thisIndex) => (thisIndex === subIndex) ? value : thisSecondary)
                          }, index)}
                          size='lg'
                          disabled={isFormDelete || isFormSubmitting}
                        />
                      ))}
                    </div>
                  </div>
                  <Input
                    label='Harga'
                    value={service.price}
                    onChange={value => handleServiceChange({
                      ...service,
                      price: value
                    }, index)}
                    size='lg'
                    disabled={isFormDelete || isFormSubmitting}
                  />
                </div>
              ))}
            </div>
            <div className='flex flex-col gap-2'>
              <Input
                label='Total Harga'
                value={totalPrice}
                size='lg'
                disabled
              />
              <Input
                label='Keterangan'
                value={note}
                onChange={value => setNote(value)}
                size='lg'
                disabled={isFormDelete || isFormSubmitting}
              />
            </div>
          </div>
        }
        onSubmit={formSubmit}
        isLoading={isFormLoading}
        actions={isFormCreate ? (
          <>
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
          </>
        ) : isFormUpdate ? (
          <>
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
          </>
        ) : isFormDelete && (
          <>
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
          </>
        )}
      />



      {isPrintInvoiceDialogOpen && (
        <ConfirmationDialog
          title='Konfirmasi pencetakan faktur'
          description='Apakah anda ingin mencetak faktur?'
          onCancel={() => {setIsPrintInvoiceDialogOpen(false); navigate('/invoice');}}
          onConfirm={() => {setIsPrintInvoiceDialogOpen(false); createInvoicePDF(isPrintInvoiceDialogOpen); navigate('/invoice');}}
          theme='blue'
        />
      )}

      {(isFormDelete && isDeleteConfirmationDialogOpen) && (
        <ConfirmationDialog
          title='Konfirmasi penghapusan data'
          description='Apakah anda yakin ingin menghapus data ini?'
          onCancel={() => setIsDeleteConfirmationDialogOpen(false)}
          onConfirm={() => {setIsDeleteConfirmationDialogOpen(false); formSubmit(); setIsDeleteConfirmationDialogOpen(false)}}
          theme='red'
        />
      )}
    </>
  );
};
