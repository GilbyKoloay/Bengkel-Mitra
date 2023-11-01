import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

import { Button } from '../../../components';
import {
  Fetch,
  createSocket,
  getCurrentDateTime,
  toProperDateTime
} from '../../../functions';
import Header from './Header';
import Info from './Info';
import Table from './Table';
import Notes from './Notes';
import Footer from './Footer';



export default function InvoiceForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const isFormCreate = (location.pathname.split('/')[3] === 'create') ? true : false;
  const isFormUpdate = (location.pathname.split('/')[3] === 'update') ? true : false;
  const isFormDelete = (location.pathname.split('/')[3] === 'delete') ? true : false;

  const { _id } = useParams();

  const { _invoices } = useSelector(state => state._app);

  const [isFormLoading, setIsFormLoading] = useState(isFormCreate ? false : true);
  const [isDeleteConfirmationDialogOpen, setIsDeleteConfirmationDialogOpen] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);

  const [headerLabels, setHeaderLabels] = useState({
    top: 'Mitra Oto',
    mid: 'Jl. Pingkan Matindas No. 48, Dendengan Dalam',
    bot: 'No. HP: 081356071990'
  });

  const [info, setInfo] = useState([{
    label: 'Nama Pelanggan',
    value: '',
    type: 'text'
  }, {
    label: 'Jenis Kendaraan',
    value: '',
    type: 'text'
  }, {
    label: 'Nomor Polisi',
    value: '',
    type: 'text'
  }, {
    label: 'Tanggal Masuk',
    value: '--T00:00:00.000Z',
    type: 'date'
  }, {
    label: 'Tanggal Keluar',
    value: '--T00:00:00.000Z',
    type: 'date'
  }, {
    label: 'Kilometer',
    value: '',
    type: 'text'
  }]);

  const [priceShow, setPriceShow] = useState('all');
  const [paidShow, setPaidShow] = useState('all');
  const [tableLabels, setTableLabels] = useState({
    col1: 'No',
    col2: 'Uraian Pekerjaan',
    col3: 'Harga',
    col4: 'Keterangan',
    paid: 'Panjar',
    totalPaid: 'Biaya Panjar',
    totalPrice: 'Biaya Service',
    calculated: 'Jumlah :'
  });
  const [services, setServices] = useState([{
    no: '',
    subServices: [{
      type: 'SERVICE',
      name: '',
      price: '',
      paid: '',
      note: ''
    }]
  }]);
  const [totalPriceErr, setTotalPriceErr] = useState('');
  const [totalPrice, setTotalPrice] = useState('0');
  const [totalPaidErr, setTotalPaidErr] = useState('');
  const [totalPaid, setTotalPaid] = useState('0');
  const [calculated, setCalculated] = useState(0);

  const [noteLabel, setNoteLabel] = useState('*catatan');
  const [notes, setNotes] = useState(['']);
  const [paymentLabels, setPaymentLabels] = useState({
    top: 'Pembayaran via',
    mid: 'BCA 7878792619',
    bot: 'A/N Peggy Sheriman'
  });

  const [city, setCity] = useState('Manado');
  const [createDate, setCreateDate] = useState(getCurrentDateTime());



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
      setHeaderLabels(invoice.headerLabels);

      setInfo(invoice.info);

      setPriceShow(invoice.priceShow);
      setPaidShow(invoice.paidShow);
      setTableLabels(invoice.tableLabels);
      setServices([...invoice.services.map(service => ({
        ...service,
        subServices: [...service.subServices, {
          type: 'SERVICE',
          name: '',
          price: '',
          paid: '',
          note: ''
        }]
      })), {
        no: '',
        subServices: [{
          type: 'SERVICE',
          name: '',
          price: '',
          paid: '',
          note: ''
        }]
      }]);
      setTotalPriceErr(invoice.totalPriceErr);
      setTotalPrice(invoice.totalPrice);
      setTotalPaidErr(invoice.totalPaidErr);
      setTotalPaid(invoice.totalPaid);
      setCalculated(invoice.calculated);

      setNoteLabel(invoice.noteLabel);
      setNotes([...invoice.notes, '']);
      setPaymentLabels(invoice.paymentLabels);

      setCity(invoice.city);
      setCreateDate(invoice.createDate);
    }
  }

  function onReset() {
    setHeaderLabels({
      top: 'Mitra Oto',
      mid: 'Jl. Pingkan Matindas No. 48, Dendengan Dalam',
      bot: 'No. HP: 081356071990'
    });

    setInfo([{
      label: 'Nama Pelanggan',
      value: '',
      type: 'text'
    }, {
      label: 'Jenis Kendaraan',
      value: '',
      type: 'text'
    }, {
      label: 'Nomor Polisi',
      value: '',
      type: 'text'
    }, {
      label: 'Tanggal Masuk',
      value: '--T00:00:00.000Z',
      type: 'date'
    }, {
      label: 'Tanggal Keluar',
      value: '--T00:00:00.000Z',
      type: 'date'
    }, {
      label: 'Kilometer',
      value: '',
      type: 'text'
    }]);

    setPriceShow('all');
    setPaidShow('all');
    setTableLabels({
      col1: 'No',
      col2: 'Uraian Pekerjaan',
      col3: 'Harga',
      col4: 'Keterangan',
      paid: 'Panjar',
      totalPaid: 'Biaya Panjar',
      totalPrice: 'Biaya Service',
      calculated: 'Jumlah :'
    });
    setServices([{
      no: '',
      subServices: [{
        type: 'SERVICE',
        name: '',
        price: '',
        paid: '',
        note: ''
      }]
    }]);
    setTotalPriceErr('');
    setTotalPrice('0');
    setTotalPaidErr('');
    setTotalPaid('0');
    setCalculated(0);

    setNoteLabel('*catatan');
    setNotes(['']);
    setPaymentLabels({
      top: 'Pembayaran via',
      mid: 'BCA 7878792619',
      bot: 'A/N Peggy Sheriman'
    });

    setCity('Manado');
    setCreateDate(getCurrentDateTime());
  }

  async function onSubmit(e) {
    e?.preventDefault();
    setIsFormSubmitting(true);

    let payload = {
      _id,

      headerLabels,

      info: info.map(item => {
        if (item.type === 'date') return {...item, value: toProperDateTime(item.value)}
        else return item;
      }),

      priceShow,
      paidShow,
      tableLabels,
      services: services.map(service => ({...service, subServices: service.subServices.slice(0, -1)})).slice(0, -1),
      totalPriceErr,
      totalPrice,
      totalPaidErr,
      totalPaid,
      calculated,

      noteLabel,
      notes: notes.slice(0, -1),
      paymentLabels,

      city,
      createDate: toProperDateTime(createDate)
    };

    if (isFormCreate) payload = {
      _id: undefined,
      ...payload
    };
    else if (isFormDelete) payload = {
      _id: payload._id
    };
    console.log('payload', payload);

    const res = await Fetch(
      '/invoice',
      isFormCreate ? 'POST' : isFormUpdate ? 'PUT' : isFormDelete ? 'DELETE' : undefined,
      payload, {title: `Sedang ${isFormCreate ? 'menambahkan' : isFormUpdate ? 'memperbarui' : isFormDelete ? 'menghapus' : ''} data faktur ...`},
      true, true
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



  return (
    <main className='flex-1 p-4 flex flex-col gap-4 overflow-auto'>
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
            label='Atur Ulang'
            onClick={onReset}
            size='md'
          />
        )}
        <Button
          className='whitespace-nowrap'
          label={isFormCreate ? 'Tambah' : isFormUpdate ? 'Perbarui' : isFormDelete ? 'Hapus' : ''}
          onClick={onSubmit}
          size='md'
          theme={isFormCreate ? 'blue' : isFormUpdate ? 'yellow' : isFormDelete ? 'red' : ''}
        />
      </div>



      <div className='text-2xl'>{isFormCreate ? 'Tambah' : isFormUpdate ? 'Perbarui' : isFormDelete ? 'Hapus' : ''} Faktur</div>



      {(
        isFormCreate ||
        (isFormUpdate && !isFormLoading) ||
        (isFormDelete && !isFormLoading)
      ) && (
        <div className='flex-1 overflow-auto border-2 border-neutral-700 p-8 flex flex-col gap-8'>
          <Header headerLabels={headerLabels} setHeaderLabels={setHeaderLabels} />

          <div className='border-t-2 border-neutral-900' />

          <Info
            info={info}
            setInfo={setInfo}
            disabled={isFormDelete || isFormLoading || isFormSubmitting}
          />
          
          <Table
            services={services}
            setServices={setServices}
            setPriceShow={setPriceShow}
            setPaidShow={setPaidShow}
            priceShow={priceShow}
            paidShow={paidShow}
            tableLabels={tableLabels}
            setTableLabels={setTableLabels}
            disabled={isFormDelete || isFormLoading || isFormSubmitting}
            totalPriceErr={totalPriceErr}
            setTotalPriceErr={setTotalPriceErr}
            totalPrice={totalPrice}
            setTotalPrice={setTotalPrice}
            totalPaidErr={totalPaidErr}
            setTotalPaidErr={setTotalPaidErr}
            totalPaid={totalPaid}
            setTotalPaid={setTotalPaid}
            calculated={calculated}
            setCalculated={setCalculated}
          />

          <Notes
            noteLabel={noteLabel}
            setNoteLabel={setNoteLabel}
            disabled={isFormDelete || isFormLoading || isFormSubmitting}
            notes={notes}
            setNotes={setNotes}
            paymentLabels={paymentLabels}
            setPaymentLabels={setPaymentLabels}
          />

          <Footer
            city={city}
            setCity={setCity}
            disabled={isFormDelete || isFormLoading || isFormSubmitting}
            createDate={createDate}
            setCreateDate={setCreateDate}
          />
        </div>
      )}
    </main>
  );
};
