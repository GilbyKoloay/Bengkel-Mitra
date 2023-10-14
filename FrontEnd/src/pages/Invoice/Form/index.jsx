import { PDFDownloadLink } from '@react-pdf/renderer';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

import {
  Button,
  Input,
  InputDateTime,
  ConfirmationDialog,
  InvoicePDF as PDF
} from '../../../components';
import {
  splitString,
  getCurrentDateTime,
  notificationToast,
  toProperString,
  toProperDateTime,
  Fetch,
  createSocket
} from '../../../functions';



const InputWrapper = ({ title, children }) => {
  return (
    <div className='flex items-center'>
      <div className='flex-1 whitespace-nowrap'>{title}</div>
      <div className='flex-1 flex items-center gap-1'>
        <div>:</div>
        {children}
      </div>
    </div>
  );
};



export default function InvoiceForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const isFormCreate = (location.pathname.split('/')[3] === 'create') ? true : false;
  const isFormUpdate = (location.pathname.split('/')[3] === 'update') ? true : false;
  const isFormDelete = (location.pathname.split('/')[3] === 'delete') ? true : false;

  const { _id } = useParams();

  const { _invoices } = useSelector(state => state._app);

  const [isFormLoading, setIsFormLoading] = useState(isFormCreate ? false : true);
  const [createDate, setCreateDate] = useState(getCurrentDateTime());
  const [customerName, setCustomerName] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [entryDate, setEntryDate] = useState('--T00:00:00.000Z');
  const [outDate, setOutDate] = useState('--T00:00:00.000Z');
  const [kilometer, setKilometer] = useState('');
  const [services, setServices] = useState([[{
    name: '',
    price: '',
    paid: '',
    note: ''
  }]]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [notes, setNotes] = useState(['']);
  const [city, setCity] = useState('Manado');
  const [isDeleteConfirmationDialogOpen, setIsDeleteConfirmationDialogOpen] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);



  useEffect(() => {
    if (isFormUpdate || isFormDelete) {
      const socket = createSocket();

      socket.on('invoice-update', updated_id => {
        if (_id === updated_id && !isPrintDialogOpen) notificationToast('Data ini sudah diperbarui pengguna lain.', 'Tekan tombol \'Muat Ulang\' untuk melihat data yang terbaru.', 'warning');
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
      onLoad();
    }
  }, [_invoices]);



  function onLoad() {
    const invoice = _invoices.filter(invoice => invoice._id === _id)[0];

    if (!invoice) navigate('/invoice');
    else {
      setCreateDate(invoice.createDate ? invoice.createDate : getCurrentDateTime());
      setCustomerName(invoice.customerName);
      setVehicleType(invoice.vehicleType);
      setVehiclePlate(invoice.vehiclePlate);
      setEntryDate(invoice.entryDate ? invoice.entryDate : '--T00:00:00.000Z');
      setOutDate(invoice.outDate ? invoice.outDate : '--T00:00:00.000Z');
      setKilometer(invoice.kilometer);
      setServices([
        ...invoice.services.map(subServices => [...subServices.map(subService => ({
          ...subService,
          price: subService.price ? subService.price.toString() : '',
          paid: subService.paid ? subService.paid.toString() : ''
        })), {
          name: '',
          price: '',
          paid: '',
          note: ''
        }]),
        [{
          name: '',
          price: '',
          paid: '',
          note: ''
        }]
      ]);
      setTotalPrice(totalPrice);
      setNotes([...invoice.notes, '']);
      setCity(invoice.city);
    }
  }

  function onClear() {
    setCreateDate(getCurrentDateTime());
    setCustomerName('');
    setVehicleType('');
    setVehiclePlate('');
    setEntryDate('--T00:00:00.000Z');
    setOutDate('--T00:00:00.000Z');
    setKilometer('');
    setServices([[{
      name: '',
      price: '',
      paid: '',
      note: ''
    }]]);
    setTotalPrice(0);
    setNotes(['']);
    setCity('Manado');
  }

  async function onSubmit(e) {
    e?.preventDefault();
    setIsFormSubmitting(true);

    let payload = {};
    if (isFormCreate) {
      payload = {
        createDate: toProperDateTime(createDate),
        customerName: toProperString(customerName),
        vehicleType: toProperString(vehicleType),
        vehiclePlate: toProperString(vehiclePlate),
        entryDate: toProperDateTime(entryDate),
        outDate: toProperDateTime(outDate),
        kilometer: parseInt(kilometer),
        services: services.slice(0, -1).map(subServices => subServices.slice(0, -1).map(subService => ({
          name: toProperString(subService.name),
          price: parseInt(subService.price.replaceAll('.', '')),
          paid: parseInt(subService.paid.replaceAll('.', '')),
          note: toProperString(subService.note)
        }))),
        totalPrice,
        notes: notes.slice(0, -1).map(note => toProperString(note)),
        city: toProperString(city)
      };
    } else if (isFormUpdate) {
      payload = {
        _id,
        createDate: toProperDateTime(createDate),
        customerName: toProperString(customerName),
        vehicleType: toProperString(vehicleType),
        vehiclePlate: toProperString(vehiclePlate),
        entryDate: toProperDateTime(entryDate),
        outDate: toProperDateTime(outDate),
        kilometer: parseInt(kilometer),
        services: services.slice(0, -1).map(subServices => subServices.slice(0, -1).map(subService => ({
          name: toProperString(subService.name),
          price: parseInt(subService.price.replaceAll('.', '')),
          paid: parseInt(subService.paid.replaceAll('.', '')),
          note: toProperString(subService.note)
        }))),
        totalPrice,
        notes: notes.slice(0, -1).map(note => toProperString(note)),
        city: toProperString(city)
      };
    } else if (isFormDelete) {
      payload = {
        _id
      }
    }
    console.log('payload', payload);

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
        else setIsPrintDialogOpen(payload);
      }
    }
  }

  function handleCopyTextOnClick(value) {
    const textArea = document.createElement('textarea');
    textArea.value = `${value} `;

    document.body.appendChild(textArea);

    textArea.select();
    document.execCommand('copy');

    document.body.removeChild(textArea);
  }

  function handleServicesOnChange(newValue, index, subIndex) {
    // get value
    let newServices = [...services];
    let newSubServices = [...newServices[index]];

    // add value
    newSubServices[subIndex] = newValue;
    newServices[index] = newSubServices;

    // filter sub services
    newServices = newServices.map(subServices => subServices.filter(subService => subService.name));

    // filter services
    newServices = newServices.filter(subServices => subServices.length > 0);

    // set new total price
    let newTotalPrice = 0;
    newServices.forEach(subServices => subServices.forEach(subService => {
      if (!isNaN(subService.paid)) newTotalPrice += (subService.price - subService.paid);
      else newTotalPrice += subService.price;
    }));
    setTotalPrice(newTotalPrice);
    
    // add new empty value to sub services
    newServices = newServices.map(subServices => [...subServices, {
      name: '',
      price: '',
      paid: '',
      note: ''
    }]);

    // add new empety value to services
    newServices = [...newServices, [{
      name: '',
      price: '',
      paid: '',
      note: ''
    }]];

    setServices(newServices);
  }

  function handleNotesOnChange(newValue, index) {
    let newNotes = [...notes];

    newNotes[index] = newValue;
    newNotes = newNotes.filter(note => note);
    newNotes = [...newNotes, ''];
    
    setNotes(newNotes);
  }



  return (
    <main className='flex-1 p-4 flex flex-col overflow-auto'>
      <form onSubmit={onSubmit} className='flex-1 flex gap-4 flex-col overflow-auto'>
        <div className='flex flex-col sm:flex-row gap-2'>
          <Button
            className='whitespace-nowrap'
            label='Kembali'
            onClick={() => navigate(`/${location.pathname.split('/')[1]}`)}
            size='md'
          />
          {!isFormCreate && (
            <Button
              className='whitespace-nowrap'
              label='Muat Ulang'
              onClick={onLoad}
              size='md'
            />
          )}
          {!isFormDelete && (
            <Button
              className='whitespace-nowrap'
              label='Bersihkan'
              onClick={onClear}
              size='md'
            />
          )}
          <Button
            className='whitespace-nowrap'
            label={isFormCreate ? 'Tambah' : isFormUpdate ? 'Perbarui' : isFormDelete ? 'Hapus' : ''}
            type='submit'
            size='md'
            theme={isFormCreate ? 'blue' : isFormUpdate ? 'yellow' : isFormDelete ? 'red' : ''}
          />
        </div>

        <div className='text-2xl text-center sm:text-start'>{isFormCreate ? 'Tambah' : isFormUpdate ? 'Perbarui' : isFormDelete ? 'Hapus' : ''} Faktur</div>

        <div className='flex-1 font-serif text-base border-2 border-neutral-900 p-8 flex flex-col gap-8 overflow-auto'>
          <section>
            <div className='text-2xl'>Mitra Oto</div>
            <div>Jl. Pingkan Matindas No. 48, Dendengan Dalam</div>
            <div className='text-xs'>No. HP: 081356071990</div>
          </section>

          <div className='border-y border-neutral-900' />

          <section className='w-1/2'>
            <div className='flex flex-col justify-center'>
              <InputWrapper title='Nama Pelanggan'>
                <Input
                  className='flex-1'
                  value={customerName}
                  onChange={value => setCustomerName(value)}
                  disabled={isFormDelete || isFormLoading || isFormSubmitting}
                  size='md'
                />
              </InputWrapper>
              <InputWrapper title='Jenis Kendaraan'>
                <Input
                  className='flex-1'
                  value={vehicleType}
                  onChange={value => setVehicleType(value)}
                  disabled={isFormDelete || isFormLoading || isFormSubmitting}
                  size='md'
                />
              </InputWrapper>
              <InputWrapper title='Nomor Polisi'>
                <Input
                  className='flex-1'
                  value={vehiclePlate}
                  onChange={value => setVehiclePlate(value)}
                  disabled={isFormDelete || isFormLoading || isFormSubmitting}
                  size='md'
                />
              </InputWrapper>
              <InputWrapper title='Tanggal Masuk'>
                <InputDateTime
                  className='flex-1'
                  useTime={false}
                  value={entryDate}
                  onChange={value => setEntryDate(value)}
                  disabled={isFormDelete || isFormLoading || isFormSubmitting}
                  size='md'
                />
              </InputWrapper>
              <InputWrapper title='Tanggal Keluar'>
                <InputDateTime
                  className='flex-1'
                  useTime={false}
                  value={outDate}
                  onChange={value => setOutDate(value)}
                  disabled={isFormDelete || isFormLoading || isFormSubmitting}
                  size='md'
                />
              </InputWrapper>
              <InputWrapper title='Kilometer'>
                <Input
                  className='flex-1'
                  value={kilometer}
                  onChange={value => setKilometer(value)}
                  disabled={isFormDelete || isFormLoading || isFormSubmitting}
                  size='md'
                />
              </InputWrapper>
            </div>
          </section>

          <section className='flex gap-1'>
            <Button
              className='w-8'
              label='●'
              onClick={() => handleCopyTextOnClick('•')}
            />
            <Button
              className='w-8'
              label='*'
              onClick={() => handleCopyTextOnClick('*')}
            />
            <Button
              className='w-8'
              label='-'
              onClick={() => handleCopyTextOnClick('-')}
            />
          </section>

          <section className='border-2 border-neutral-900'>
            <div className='flex flex-row text-lg border-b border-neutral-900'>
              <div className='w-1/12 p-1 flex justify-center'>
                <div>No</div>
              </div>
              <div className='w-11/12 flex flex-row'>
                <div className='w-6/12 p-1 flex justify-center border-l border-neutral-900'>
                  <div>Uraian Pekerjaan</div>
                </div>
                <div className='w-3/12 p-1 flex justify-center border-x border-neutral-900'>
                  <div>Harga</div>
                </div>
                <div className='w-3/12 p-1 flex justify-center'>
                  <div>Keterangan</div>
                </div>
              </div>
            </div>
            {services.map((subServices, index) => (
              <div key={index} className={`flex flex-row ${index ? 'border-t border-neutral-900 border-dashed' : ''}`}>
                <div className='w-1/12 p-1 flex justify-center'>
                  <div>{index+1}</div>
                </div>
                <div className='w-11/12 flex flex-col'>
                  {subServices.map((subService, subIndex) => (
                    <div key={subIndex} className='flex'>
                      <div className='w-6/12 p-1 h-22 flex flex-col border-l border-neutral-900'>
                        <div className='flex items-end flex-1'>
                          <Input
                            className='w-full'
                            value={subService.name}
                            onChange={value => handleServicesOnChange({
                              name: value,
                              price: subService.price,
                              paid: subService.paid,
                              note: subService.note
                            }, index, subIndex)}
                            size='md'
                            disabled={isFormDelete || isFormLoading || isFormSubmitting}
                          />
                        </div>
                        <div className='flex justify-end items-center flex-1'>
                          <div>Panjar</div>
                        </div>
                      </div>
                      <div className='w-3/12 p-1 h-22 flex flex-col border-x border-neutral-900'>
                        <div className='flex items-end flex-1'>
                          <Input
                            className='w-full'
                            value={splitString(subService.price, 3, '.')}
                            onChange={value => !isNaN(value.replaceAll('Rp. ', '').replaceAll('.', '')) && handleServicesOnChange({
                              name: subService.name,
                              price: value.replaceAll('Rp. ', '').replaceAll('.', ''),
                              paid: subService.paid,
                              note: subService.note
                            }, index, subIndex)}
                            disabled={isFormDelete || isFormLoading || isFormSubmitting || !subService.name}
                            size='md'
                          />
                        </div>
                        <div className='flex items-start flex-1'>
                          <Input
                            className='w-full'
                            value={splitString(subService.paid, 3, '.')}
                            onChange={value => !isNaN(value.replaceAll('Rp. ', '').replaceAll('.', '')) && handleServicesOnChange({
                              name: subService.name,
                              price: subService.price,
                              paid: value.replaceAll('Rp. ', '').replaceAll('.', ''),
                              note: subService.note
                            }, index, subIndex)}
                            disabled={isFormDelete || isFormLoading || isFormSubmitting || !subService.name}
                            size='md'
                          />
                        </div>
                      </div>
                      <div className='w-3/12 p-1'>
                        <Input
                          value={subService.note}
                          onChange={value => handleServicesOnChange({
                            name: subService.name,
                            price: subService.price,
                            paid: subService.paid,
                            note: value
                          }, index, subIndex)}
                          disabled={isFormDelete || isFormLoading || isFormSubmitting || !subService.name}
                          size='md'
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className='flex flex-row text-lg border-t border-neutral-900'>
              <div className='w-1/12 p-1 flex' />
              <div className='w-11/12 flex flex-row'>
                <div className='w-6/12 p-1 flex justify-center border-l border-neutral-900'>
                  <div>Jumlah</div>
                </div>
                <div className='w-3/12 p-1 flex justify-end border-x border-neutral-900'>
                  {isNaN(totalPrice) ? (
                    <div>Harga/Panjar tidak valid</div>
                  ) : (
                    <div>Rp. {splitString(totalPrice, 3, '.')}</div>
                  )}
                </div>
                <div className='w-3/12 p-1 flex' />
              </div>
            </div>
          </section>

          <section className='flex flex-col gap-4'>
            <div>
              <div className='text-lg'>*catatan:</div>
              {notes.map((note, index) => (
                <div key={index} className='w-64 ml-2 flex items-center gap-1'>
                  <div>- </div>
                  <Input
                    value={note}
                    onChange={value => handleNotesOnChange(value, index)}
                    disabled={isFormDelete || isFormLoading || isFormSubmitting}
                    size='md'
                  />
                </div>
              ))}
            </div>

            <div className='flex gap-1 justify-end items-center'>
              <Input
                className='w-32'
                value={city}
                onChange={value => setCity(value)}
                disabled={isFormDelete || isFormLoading || isFormSubmitting}
                size='md'
              />
              <div className='text-lg'>,</div>
              <InputDateTime
                className='w-64'
                useTime={false}
                value={createDate}
                onChange={value => setCreateDate(value)}
                disabled={isFormDelete || isFormLoading || isFormSubmitting}
                size='md'
              />
            </div>
          </section>
        </div>
      </form>



      {isPrintDialogOpen && (
        <ConfirmationDialog
          title='Konfirmasi pencetakan faktur'
          description='Apakah anda ingin mencetak faktur?'
        >
          <>
            <Button
              className='flex-1 sm:flex-[0]'
              label='Batal'
              onClick={() => {setIsPrintDialogOpen(false); navigate('/invoice');}}
              size='md'
            />
            <PDFDownloadLink
              className='flex-1 sm:flex-[0] border-2 py-1 px-4 text-lg bg-blue-300 border-blue-700 rounded text-center hover:bg-blue-500 hover:cursor-pointer focus:outline focus:outline-1 focus:outline-offset-1 focus:outline-blue-700'
              document={<PDF invoice={isPrintDialogOpen} />}
              fileName='Faktur.pdf'
              onClick={() => setTimeout(() => {setIsPrintDialogOpen(false); navigate('/invoice');}, 500)}
            >
              {({ blob, url, loading, error }) => loading ? '' : 'Konfirmasi'}
            </PDFDownloadLink>
          </>
        </ConfirmationDialog>
      )}

      {(isFormDelete && isDeleteConfirmationDialogOpen) && (
        <ConfirmationDialog
          title='Konfirmasi penghapusan data'
          description='Apakah anda yakin ingin menghapus data ini?'
          onCancel={() => setIsDeleteConfirmationDialogOpen(false)}
          onConfirm={() => {setIsDeleteConfirmationDialogOpen(false); onSubmit(); setIsDeleteConfirmationDialogOpen(false)}}
          theme='red'
        />
      )}
    </main>
  );
};
