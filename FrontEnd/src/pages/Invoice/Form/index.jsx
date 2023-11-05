import { PDFDownloadLink } from '@react-pdf/renderer';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';

import { Button, ConfirmationDialog, InvoicePDF } from '../../../components';
import { Fetch, getCurrentDateTime, toProperDateTime } from '../../../functions';
import { _app } from '../../../redux';
import Header from './Header';
import Info from './Info';
import Table from './Table';
import Notes from './Notes';
import Footer from './Footer';



export default function InvoiceForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [params] = useSearchParams();
  const _id = params.get('_id');

  const { _invoices } = useSelector(state => state._app);

  const [isFormLoading, setIsFormLoading] = useState(_id ? true : false);
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
    label: 'Tgl Msk/Tgl Klr',
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
    col1: 'No.',
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
    if (_id && isFormLoading && _invoices) {
      setIsFormLoading(false);
      onLoad();
    }
  }, [_invoices]);



  function onLoad() {
    const invoice = _invoices.filter(invoice => invoice._id === _id)[0];

    if (!invoice) navigate('/invoice');
    else {
      setHeaderLabels(invoice.headerLabels);

      setInfo(invoice.info.map(info => ({
        ...info,
        value: (info.type !== 'date') ? info.value : (info.value.slice(0, 10) === '0000-00-00') ? '--T00:00:00.000Z' : info.value
      })));

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
      // setCreateDate(invoice.createDate);
      setCreateDate((invoice.createDate.slice(0, 10) === '0000-00-00') ? '--T00:00:00.000Z' : invoice.createDate);
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
      label: 'Tgl Msk/Tgl Klr',
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
      col1: 'No.',
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

  function handleShowPDFViewOnClick() {
    sessionStorage.setItem('invoicePDFView', JSON.stringify(getPayload()));
    window.open('/invoice/pdf-view');
  }

  async function onSubmit(method) {
    setIsFormSubmitting(true);

    let payload = getPayload();

    if (method === 'POST') payload = {
      _id: undefined,
      ...payload
    };
    else if (method === 'DELETE') payload = {
      _id: payload._id
    };
    // console.log('payload', payload);

    const res = await Fetch(
      '/invoice',
      method,
      payload, {title: `Sedang ${(method === 'POST') ? 'menambahkan' : (method === 'PUT') ? 'memperbarui' : (method === 'DELETE') ? 'menghapus' : ''} data faktur ...`},
      true, true
    );
    
    if (res) {
      setIsFormSubmitting(false);

      if (res.ok) {
        getInvoice();

        if (method === 'DELETE') navigate('/invoice');
        else setIsPrintDialogOpen(payload);
      }
    }
  }

  async function getInvoice() {
    const res = await Fetch('/invoice');
    if (res.ok) dispatch(_app.setInvoices(res.payload));
  }

  function getPayload() {
    return {
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
  }

  function getPDFFileName() {
    const fileName = [];

    const customerName = info.filter(item => item.label.toLowerCase().trim() === 'nama pelanggan')[0];
    if (customerName?.value) fileName.push(customerName);

    const vehicleType = info.filter(item => item.label.toLowerCase().trim() === 'jenis kendaraan')[0];
    if (vehicleType?.value) fileName.push(vehicleType);

    const vehiclePlate = info.filter(item => item.label.toLowerCase().trim() === 'nomor polisi')[0];
    if (vehiclePlate?.value) fileName.push(vehiclePlate);

    const inDateOutDate = info.filter(item => item.label.toLowerCase().trim() === 'tgl msk/tgl klr')[0];
    if (
      inDateOutDate.type === 'date' &&
      inDateOutDate?.value &&
      (inDateOutDate?.value?.slice(0, 10) !== '0000-00-00')
    ) fileName.push({...inDateOutDate, value: toProperDateTime(inDateOutDate.value, true)});

    return fileName.map(item => {
      if (item.label.toLowerCase().trim() === 'nomor polisi') return item.value.replaceAll(' ', '');
      else return item.value.replaceAll(' ', '').replace(/(?:^\w|[A-Z]|\b\w)/g, (match, index) => {
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
      });
    }).join('_');
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
        {!isFormLoading && (
          <Button
            className='whitespace-nowrap'
            label='Lihat Tampilan PDF'
            onClick={handleShowPDFViewOnClick}
            size='md'
          />
        )}
        <Button
          className='whitespace-nowrap'
          label='Atur Ulang'
          onClick={onReset}
          size='md'
        />

        {!_id ? (
          <Button
            className='whitespace-nowrap'
            label='Tambah'
            onClick={() => onSubmit('POST')}
            size='md'
            theme='blue'
          />
        ) : !isFormLoading && (
          <>
            <Button
              className='whitespace-nowrap'
              label='Muat Ulang'
              onClick={onLoad}
              size='md'
            />
            <Button
              className='whitespace-nowrap'
              label='Cetak'
              onClick={() => setIsPrintDialogOpen(true)}
              size='md'
              theme='blue'
            />
            <Button
              className='whitespace-nowrap'
              label='Perbarui'
              onClick={() => onSubmit('PUT')}
              size='md'
              theme='yellow'
            />
            <Button
              className='whitespace-nowrap'
              label='Hapus'
              onClick={() => setIsDeleteConfirmationDialogOpen(true)}
              size='md'
              theme='red'
            />
          </>
        )}
      </div>



      <div className='text-2xl'>{!_id ? 'Lihat' : 'Data'} Faktur</div>



      {(!_id || (_id && !isFormLoading)) && (
        <div className='flex-1 overflow-auto border-2 border-neutral-700 p-8 flex flex-col gap-8'>
          <Header headerLabels={headerLabels} setHeaderLabels={setHeaderLabels} />

          <div className='border-t-2 border-neutral-900' />

          <Info
            info={info}
            setInfo={setInfo}
            disabled={isFormLoading || isFormSubmitting}
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
            disabled={isFormLoading || isFormSubmitting}
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
            disabled={isFormLoading || isFormSubmitting}
            notes={notes}
            setNotes={setNotes}
            paymentLabels={paymentLabels}
            setPaymentLabels={setPaymentLabels}
          />

          <Footer
            city={city}
            setCity={setCity}
            disabled={isFormLoading || isFormSubmitting}
            createDate={createDate}
            setCreateDate={setCreateDate}
          />
        </div>
      )}



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
              document={<InvoicePDF invoice={{...getPayload()}} />}
              fileName={`${getPDFFileName()}`}
              onClick={() => setTimeout(() => {setIsPrintDialogOpen(false); navigate('/invoice');}, 500)}
            >
              {({ blob, url, loading, error }) => loading ? '' : 'Konfirmasi'}
            </PDFDownloadLink>
          </>
        </ConfirmationDialog>
      )}

      {isDeleteConfirmationDialogOpen && (
        <ConfirmationDialog
          title='Konfirmasi penghapusan faktur'
          description='Apakah anda yakin ingin menghapus faktur ini?'
          onCancel={() => setIsDeleteConfirmationDialogOpen(false)}
          onConfirm={() => {setIsDeleteConfirmationDialogOpen(false); onSubmit('DELETE'); setIsDeleteConfirmationDialogOpen(false)}}
          theme='red'
        />
      )}
    </main>
  );
};
