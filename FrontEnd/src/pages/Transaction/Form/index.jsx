import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import {
  Select,
  DateTime,
  Input,
  InputOption,
  Button,
  ConfirmationDialog
} from '../../../components';
import {
  Fetch,
  createSocket,
  getCurrentTime,
  splitString
} from '../../../functions';



export default function TypeForm() {
  const navigate = useNavigate();

  const { formType } = useParams();

  const [parameters] = useSearchParams();
  const _id = parameters.get('_id');

  const { services:SERVICES } = useSelector(state => state.app);

  const [dateTime, setDateTime] = useState({isAuto: true, value: ''});
  const [customerName, setCustomerName] = useState('');
  const [services, setServices] = useState([{
    _id: null,
    type: '',
    subType: '',
    name: '',
    class: '',
    price: 0,
    quantity: 0
  }]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paidStatus, setPaidStatus] = useState(false);
  const [note, setNote] = useState('');
  const [isFormLoadingInitialData, setIsFormLoadingInitialData] = useState((formType === 'create') ? false : true);
  const [openFormDeleteDialog, setOpenFormDeleteDialog] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [formErrMsg, setFormErrMsg] = useState('');
  const [openPrintInvoiceDialog, setOpenPrintInvoiceDialog] = useState(false);



  useEffect(() => {
    if (
      formType !== 'create' &&
      formType !== 'update' &&
      formType !== 'delete'
    ) navigate('/transaction');

    if (
      formType === 'update' ||
      formType === 'delete'
    ) loadFormInitialData();
  }, []);

  useEffect(() => {
    setFormErrMsg('');
  }, [dateTime, services, totalPrice, paidStatus, note]);

  useEffect(() => {
    let newTotalPrice = 0;

    for (let index=0; index<services.length; index++) {
      if (services[index].quantity) newTotalPrice += services[index].quantity * services[index].price;

      if (
        services[index].name &&
        index+1 === services.length
      ) {
        setServices([...services, {
          _id: null,
          type: '',
          subType: '',
          name: '',
          class: '',
          price: 0,
          quantity: 0
        }]);
        break;
      }
      if (
        !services[index].name &&
        services[index+1]?.name
      ) {
        setServices([...services.slice(0, index), ...services.slice(index+1, services.length)]);
        break;
      }
      if (
        services.length > 1 &&
        !services[services.length-1].name &&
        !services[services.length-2].name
      ) {
        setServices(services.slice(0, services.length-1));
        break;
      }
    }

    setTotalPrice(newTotalPrice);
  }, [services]);



  async function loadFormInitialData() {
    const res = await Fetch(`/transaction/get-all?_id=${_id}&dateTime&services&totalPrice&paidStatus&note`);
    if (res?.ok) {
      if (res.payload.length === 0) navigate('/transaction');
      else {
        setDateTime({isAuto: false, value: res.payload[0].dateTime});
        setCustomerName(res.payload[0].customerName);
        setServices(res.payload[0].services);
        setTotalPrice(res.payload[0].totalPrice);
        setPaidStatus(res.payload[0].paidStatus);
        setNote(res.payload[0].note ? res.payload[0].note : '');
        setIsFormLoadingInitialData(false);
      }
    }
  }

  async function formOnSubmit(e) {
    e.preventDefault();
    if (openFormDeleteDialog) setOpenFormDeleteDialog(false);
    setIsFormSubmitting(true);

    const payload = {
      _id,
      dateTime: dateTime.isAuto ? getCurrentTime() : dateTime.value,
      customerName: customerName.trimEnd(),
      services: services.filter(service => service.quantity > 0),
      totalPrice: parseInt(totalPrice),
      paidStatus,
      note: note?.trimEnd()
    };

    const res = await Fetch(
      `/transaction/${formType}`,
      (formType === 'create') ? 'POST' : (formType === 'update') ? 'PUT' : 'DELETE',
      payload
    );
    if (res) {
      setIsFormSubmitting(false);
      if (res.ok) {
        const socket = createSocket();
        socket.emit(
          `transaction-${(formType === 'create') ? 'new' : formType}`,
          _id ? {_id} : undefined
        );
      }
      else setFormErrMsg(res.message);

      if (formType === 'delete') navigate('/transaction');
      else setOpenPrintInvoiceDialog(true);
    }
  }

  function formClear() {
    setDateTime({isAuto: true, value: null});
    setServices([{
      _id: null,
      type: '',
      subType: '',
      name: '',
      class: '',
      price: 0,
      quantity: 0
    }]);
    setTotalPrice(0);
    setPaidStatus(false);
    setNote('');
  }

  function formReset() {
    setIsFormLoadingInitialData(true);
    loadFormInitialData();
  }

  function serviceNameOnChange(value, index) {
    const newServices = services.map((service, thisIndex) => {
      if (index === thisIndex) {
        if (value[0]) {
          const selectedService = SERVICES.filter(SERVICE => value[0] === SERVICE._id)[0];
          return {
            _id: value[0],
            type: selectedService.type.name,
            subType: selectedService.subType,
            name: selectedService.name,
            class: '',
            price: 0,
            quantity: 0
          };
        }

        return {
          _id: null,
          type: '',
          subType: '',
          name: value[1].trimStart().toUpperCase(),
          class: '',
          price: 0,
          quantity: 0
        };
      }

      return service;
    });

    setServices(newServices);
  }

  function serviceClassOnChange(value, index) {
    const newServices = services.map((service, thisIndex) => {
      if (index === thisIndex) {
        const selectedService = SERVICES.filter(SERVICE => service._id === SERVICE._id)[0];
        return {
          ...service,
          class: value,
          quantity: 1,
          price: selectedService.price[`class${value}`]
        };
      }
      
      return service;
    });

    setServices(newServices);
  }

  function serviceQuantityOnChange(value, index) {
    const newServices = services.map((service, thisIndex) => {
      if (index === thisIndex) {
        return {
          ...service,
          quantity: value ? (service.quantity+1) : (service.quantity-1)
        };
      }

      return service;
    });

    setServices(newServices);
  }

  function printInvoice() {
    setOpenPrintInvoiceDialog(false);
    console.log('printInvoice');
    navigate('/transaction');
  }



  return (
    <main>
      <form className='h-full flex flex-col' onSubmit={formOnSubmit}>
        <div className='text-xl'>{(formType === 'create') ? 'Tambah' : (formType === 'update') ? 'Ubah' : 'Hapus'} Transaksi</div>

        {(isFormLoadingInitialData || !SERVICES) && <div className='text-lg'>Sedang memuat data, mohon tunggu ...</div>}
        {(SERVICES?.length === 0) && <div className='text-lg text-red-500'>Layanan masih kosong, silahkan mengisi layanan terlebih dahulu.</div>}
        {isFormSubmitting && <div className='text-lg'>Sedang {(formType === 'create') ? 'menambahkan' : (formType === 'update') ? 'mengubah' : 'menghapus'} data, mohon tunggu ...</div>}
        {formErrMsg && <div className='text-lg text-red-500'>{formErrMsg}</div>}

        {(!isFormLoadingInitialData && SERVICES?.length > 0) && (
          <>
            <div className='pt-4 pb-8 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 md:gap-8 overflow-y-auto'>
              <div>
                <Input
                  label='Nama Pelanggan'
                  value={customerName}
                  onChange={value => setCustomerName(value.trimStart().toUpperCase())}
                  size='lg'
                  disabled={isFormLoadingInitialData || isFormSubmitting || (formType === 'delete')}
                />
                <Select
                  className='mt-4'
                  label='Tanggal & Waktu'
                  value={dateTime.isAuto}
                  onChange={value => setDateTime({...dateTime, isAuto: JSON.parse(value)})}
                  options={[[true, 'AUTOMATIS'], [false, 'MANUAL']]}
                  size='lg'
                  disabled={isFormLoadingInitialData || isFormSubmitting || (formType === 'delete')}
                />
                {(!dateTime.isAuto) && (
                  <DateTime
                    className='mt-2'
                    value={dateTime.value}
                    onChange={value => setDateTime({...dateTime, value})}
                    size='lg'
                    disabled={isFormLoadingInitialData || isFormSubmitting || (formType === 'delete')}
                  />
                )}
                {services.map((service, index) => (
                  <div key={index} className='mt-8'>
                    <div className='text-xl'>Layanan {index+1}</div>
                    <div className='flex flex-row justify-between gap-2 md:gap-4'>
                      <div className='flex flex-col justify-between w-3/4 md:w-4/5 lg:w-5/6'>
                        <div className=''>
                          <InputOption
                            label='Tipe - Subtipe - Nama'
                            value={service._id ? `(${service.type}${service.subType ? ` - ${service.subType}` : ''}) ${service.name}` : service.name}
                            onChange={value => serviceNameOnChange(value, index)}
                            options={SERVICES.map(thisService => [thisService._id, `(${thisService.type.name}${thisService.subType ? ` - ${thisService.subType}` : ''}) ${thisService.name}`])}
                            size='lg'
                            disabled={isFormLoadingInitialData || isFormSubmitting || (formType === 'delete')}
                          />
                        </div>
                        <div className=''>
                          <Select
                            label='Kelas - Harga'
                            value={service.class}
                            onChange={value => serviceClassOnChange(value, index)}
                            options={['1', '2', '3', '4', '5'].map(number => SERVICES.filter(SERVICE => service?._id === SERVICE._id)[0]?.price[`class${number}`] && [number, `Kelas ${number} - ${splitString(SERVICES.filter(SERVICE => service?._id === SERVICE._id)[0]?.price[`class${number}`], 3, '.')}`])?.filter(option => option)}
                            placeholder='(Kelas - Harga)'
                            size='lg'
                            disabled={!service._id || isFormLoadingInitialData || isFormSubmitting || (formType === 'delete')}
                          />
                        </div>
                      </div>
                      <div className='w-1/4 md:w-1/5 lg:w-1/6 flex flex-col'>
                        <div className='text-lg text-center'>Kuantitas</div>
                        <div className='flex-1 mt-2 flex flex-col gap-2'>
                          <Button
                            className='flex-1'
                            label='+'
                            onClick={() => serviceQuantityOnChange(true, index)}
                            color='blue'
                            size='md'
                            disabled={!service.class || isFormLoadingInitialData || isFormSubmitting || (formType === 'delete')}
                          />
                          <Input
                            className='flex-1'
                            value={service.quantity}
                            size='md'
                            disabled
                          />
                          <Button
                            className='flex-1'
                            label='-'
                            onClick={() => serviceQuantityOnChange(false, index)}
                            color='red'
                            size='md'
                            disabled={service.quantity === 0 || isFormLoadingInitialData || isFormSubmitting || (formType === 'delete')}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <table className='w-full'>
                  <thead className='bg-neutral-300'>
                    <tr>
                      <th rowSpan={2} className='p-2 border border-neutral-500'>No.</th>
                      <th rowSpan={2} className='p-2 border border-neutral-500 text-start'>Tipe (Subtipe) - Nama</th>
                      <th rowSpan={2} className='p-2 border border-neutral-500'>Kelas Kendaraan</th>
                      <th className='p-2 border border-neutral-500'>Harga</th>
                      <th rowSpan={2} className='p-2 border border-neutral-500'>Total Harga</th>
                    </tr>
                    <tr>
                      <th className='p-2 border border-neutral-500'>Kuantitas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service, index) => (service.quantity > 0) && (
                      [0, 1].map(thisIndex => !thisIndex ? (
                        <tr key={thisIndex}>
                          <td rowSpan={2} className='p-2 border border-neutral-500 text-center'>{index+1}</td>
                          <td rowSpan={2} className='p-2 border border-neutral-500'>{service.type}{service.subType ? ` (${service.subType})` : ''} - {service.name}</td>
                          <td rowSpan={2} className='p-2 border border-neutral-500 text-center'>{service.class}</td>
                          <td className='p-2 border border-neutral-500 text-center'>{splitString(service.price, 3, '.')}</td>
                          <td rowSpan={2} className='p-2 border border-neutral-500 text-center'>{splitString(service.quantity * service.price, 3, '.')}</td>
                        </tr>
                      ) : (
                        <tr key={thisIndex}>
                          <td className='p-2 border border-neutral-500 text-center'>{service.quantity}</td>
                        </tr>
                      ))
                    ))}
                    <tr className='bg-neutral-300 border border-neutral-500 font-bold text-lg'>
                      <td className='p-2 border border-neutral-500'>Total</td>
                      <td colSpan={3} className='p-2 border border-neutral-500 text-center'>{services.reduce((accumulator, service) => {return accumulator + service.quantity}, 0)} Layanan</td>
                      <td className='p-2 border border-neutral-500 text-center'>{splitString(totalPrice, 3, '.')}</td>
                    </tr>
                  </tbody>
                </table>
                <Select
                  className='mt-8'
                  label='Status Bayar'
                  value={paidStatus}
                  onChange={value => setPaidStatus(JSON.parse(value))}
                  options={[[true, 'LUNAS'], [false, 'TIDAK LUNAS']]}
                  size='lg'
                  color={paidStatus ? 'green' : 'red'}
                  disabled={isFormLoadingInitialData || isFormSubmitting || (formType === 'delete')}
                />
                <Input
                  className='mt-4'
                  label='Keterangan'
                  value={note}
                  onChange={value => setNote(value.trimStart().toUpperCase())}
                  size='lg'
                  disabled={isFormLoadingInitialData || isFormSubmitting || (formType === 'delete')}
                />
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-2 sm:gap-4 md:gap-8'>
              <Button
                className='flex-1'
                label='Kembali'
                onClick={() => navigate('/transaction')}
                size='lg'
              />
              {(formType === 'create') ? (
                <Button
                  className='flex-1'
                  label='Bersihkan'
                  onClick={formClear}
                  size='lg'
                  color='red'
                  disabled={isFormSubmitting}
                />
              ) : (formType === 'update') && (
                <Button
                  className='flex-1'
                  label='Atur Ulang'
                  onClick={formReset}
                  size='lg'
                  color='red'
                  disabled={isFormLoadingInitialData || isFormSubmitting}
                />
              )}
              <Button
                className='flex-1'
                label={(formType === 'create') ? 'Tambah' : (formType === 'update') ? 'Ubah' : 'Hapus'}
                onClick={(formType === 'delete') ? () => setOpenFormDeleteDialog(true) : null}
                type={(formType === 'delete') ? 'button' : 'submit'}
                size='lg'
                color={(formType === 'delete') ? 'red' : 'blue'}
                disabled={isFormLoadingInitialData || isFormSubmitting}
              />
            </div>
          </>
        )}
      </form>

      {/* Print Invoice Dialog */}
      {openPrintInvoiceDialog && (
        <ConfirmationDialog
          title='Print Faktur'
          description='Apakah anda ingin mencetak faktur?'
          onCancel={() => {setOpenPrintInvoiceDialog(false); navigate('/transaction');}}
          onConfirm={printInvoice}
        />
      )}

      {/* Form Delete Dialog */}
      {openFormDeleteDialog && (
        <ConfirmationDialog
          title='Hapus data'
          description='Apakah anda yakin ingin menghapus data ini?'
          onCancel={() => setOpenFormDeleteDialog(false)}
          onConfirm={formOnSubmit}
          color='red'
        />
      )}
    </main>
  );
};
