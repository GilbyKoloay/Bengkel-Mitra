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
  InputOption,
  Input,
  ConfirmationDialog,
} from '../../../components';
import {
  Fetch,
  createSocket,
  notificationToast,
  toProperString
} from '../../../functions';
import { Form } from '../../../layouts';



export default function ServiceForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const isFormCreate = (location.pathname.split('/')[3] === 'create') ? true : false;
  const isFormUpdate = (location.pathname.split('/')[3] === 'update') ? true : false;
  const isFormDelete = (location.pathname.split('/')[3] === 'delete') ? true : false;

  const { _id } = useParams();

  const { _services, _types } = useSelector(state => state._app);

  const [isFormLoading, setIsFormLoading] = useState(isFormCreate ? false : true);
  const [type, setType] = useState([null, '']);
  const [subType, setSubType] = useState('');
  const [name, setName] = useState('');
  const [price_class1, setPrice_class1] = useState('');
  const [price_class2, setPrice_class2] = useState('');
  const [price_class3, setPrice_class3] = useState('');
  const [price_class4, setPrice_class4] = useState('');
  const [price_class5, setPrice_class5] = useState('');
  const [note, setNote] = useState('');
  const [isDeleteConfirmationDialogOpen, setIsDeleteConfirmationDialogOpen] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);



  useEffect(() => {
    if (isFormUpdate || isFormDelete) {
      const socket = createSocket();

      socket.on('service-update', updated_id => {
        if (_id === updated_id) notificationToast('Data ini sudah diperbarui pengguna lain.', 'Tekan tombol \'Muat Ulang\' untuk melihat data yang terbaru.', 'warning');
      });

      socket.on('service-delete', deleted_id => {
        if (_id === deleted_id) {
          notificationToast('Data ini sudah dihapus pengguna lain.', null, 'warning');
          
          setTimeout(() => {
            navigate('/service');
          }, 2500);
        }
      });

      return () => socket.disconnect();
    }
  }, []);

  useEffect(() => {
    if (_services && isFormLoading) {
      setIsFormLoading(false);
      loadForm();
    }
  }, [_services]);


  
  function clearForm() {
    setType([null, '']);
    setSubType('');
    setName('');
    setPrice_class1('');
    setPrice_class2('');
    setPrice_class3('');
    setPrice_class4('');
    setPrice_class5('');
    setNote('');
  }

  function loadForm() {
    const service = _services.filter(service => service._id === _id)[0];

    if (!service) navigate('/service');
    else {
      setType([
        service.type,
        service.type?.name ? service.type.name : ''
      ]);
      setSubType(service.subType ? service.subType : '');
      setName(service.name);
      setPrice_class1(service.price.class1 ? service.price.class1 : '');
      setPrice_class2(service.price.class2 ? service.price.class2 : '');
      setPrice_class3(service.price.class3 ? service.price.class3 : '');
      setPrice_class4(service.price.class4 ? service.price.class4 : '');
      setPrice_class5(service.price.class5 ? service.price.class5 : '');
      setNote(service.note ? service.note : '');
    }
  }

  async function formSubmit(e) {
    e?.preventDefault();
    setIsFormSubmitting(true);

    let payload = {};

    if (isFormCreate) {
      payload = {
        type: type[0]?._id,
        subType: toProperString(subType),
        name: toProperString(name),
        price: {
          class1: parseInt(price_class1),
          class2: parseInt(price_class2),
          class3: parseInt(price_class3),
          class4: parseInt(price_class4),
          class5: parseInt(price_class5),
        },
        note: toProperString(note)
      };
    } else if (isFormUpdate) {
      payload = {
        _id,
        type: type[0]?._id,
        subType: toProperString(subType),
        name: toProperString(name),
        price: {
          class1: parseInt(price_class1),
          class2: parseInt(price_class2),
          class3: parseInt(price_class3),
          class4: parseInt(price_class4),
          class5: parseInt(price_class5),
        },
        note: toProperString(note)
      };
    } else if (isFormDelete) {
      payload = {
        _id
      };
    }

    const res = await Fetch(
      '/service',
      isFormCreate ? 'POST' : isFormUpdate ? 'PUT' : isFormDelete ? 'DELETE' : undefined,
      payload, {title: `Sedang ${isFormCreate ? 'menambahkan' : isFormUpdate ? 'memperbarui' : isFormDelete ? 'menghapus' : ''} data layanan ...`},
      true
    );
    if (res) {
      setIsFormSubmitting(false);
      if (res.ok) {
        const socket = createSocket();
        if (isFormCreate) socket.emit('service-create');
        else if (isFormUpdate) socket.emit('service-update', _id);
        else if (isFormDelete) socket.emit('service-delete', _id);
        
        navigate('/service');
      }
    }
  }



  if (!isFormCreate && !isFormUpdate && !isFormDelete) return <Navigate to='/service' />

  return (
    <>
      <Form
        title={`${isFormCreate ? 'Tambah' : isFormUpdate ? 'Perbarui' : isFormDelete ? 'Hapus' : ''} Layanan`}
        form={!_types ? (
          <div className='text-center text-xl col-span-full'>Sedang memuat data, mohon tunggu ...</div>
        ) : (_types.length === 0) ? (
          <div className='text-center text-xl col-span-full'>Data tipe kosong, silahkan tambah data tipe terlebih dahulu</div>
        ) : (
          <div className='flex-1 overflow-auto gap-y-2 gap-x-4 flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3'>
            <div className='flex flex-col gap-2'>
              <InputOption
                label='Tipe'
                value={type[1]}
                options={_types.map(type => [type, type.name])}
                onChange={value => setType([value[0], value[1]])}
                size='lg'
                disabled={isFormDelete || isFormSubmitting}
              />
              <Input
                label='Subtipe'
                value={subType}
                onChange={value => setSubType(value)}
                size='lg'
                disabled={isFormDelete || isFormSubmitting}
              />
            </div>
            <div className='flex flex-col gap-2'>
              <Input
                label='Nama'
                value={name}
                onChange={value => setName(value)}
                size='lg'
                disabled={isFormDelete || isFormSubmitting}
              />
              <Input
                label='Keterangan'
                value={note}
                onChange={value => setNote(value)}
                size='lg'
                disabled={isFormDelete || isFormSubmitting}
              />
            </div>
            <div className='flex flex-col gap-2'>
              <Input
                className='sm:col-start-1'
                label='Harga Kelas 1'
                value={price_class1}
                onChange={value => setPrice_class1(value)}
                size='lg'
                disabled={isFormDelete || isFormSubmitting}
              />
              <Input
                className='sm:col-start-2'
                label='Harga Kelas 2'
                value={price_class2}
                onChange={value => setPrice_class2(value)}
                size='lg'
                disabled={isFormDelete || isFormSubmitting}
              />
              <Input
                className='sm:col-start-1'
                label='Harga Kelas 3'
                value={price_class3}
                onChange={value => setPrice_class3(value)}
                size='lg'
                disabled={isFormDelete || isFormSubmitting}
              />
              <Input
                className='sm:col-start-2'
                label='Harga Kelas 4'
                value={price_class4}
                onChange={value => setPrice_class4(value)}
                size='lg'
                disabled={isFormDelete || isFormSubmitting}
              />
              <Input
                className='sm:col-start-1'
                label='Harga Kelas 5'
                value={price_class5}
                onChange={value => setPrice_class5(value)}
                size='lg'
                disabled={isFormDelete || isFormSubmitting}
              />
            </div>
          </div>
        )}
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
    
      {(isFormDelete && isDeleteConfirmationDialogOpen) && (
        <ConfirmationDialog
          title='Konfirmasi penghapusan data'
          description='Apakah anda yakin ingin menghapus data ini?'
          onCancel={() => setIsDeleteConfirmationDialogOpen(false)}
          onConfirm={() => {setIsDeleteConfirmationDialogOpen(false); formSubmit(); setIsDeleteConfirmationDialogOpen(false);}}
          theme='red'
        />
      )}
    </>
  );
};
