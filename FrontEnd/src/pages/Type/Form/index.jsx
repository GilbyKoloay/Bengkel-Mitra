import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  useNavigate,
  useLocation,
  useParams,
  Navigate
} from 'react-router-dom';

import { Button, Input, ConfirmationDialog } from '../../../components';
import {
  Fetch,
  createSocket,
  notificationToast,
  toProperString
} from '../../../functions';
import { Form } from '../../../layouts';



export default function TypeForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const isFormCreate = (location.pathname.split('/')[3] === 'create') ? true : false;
  const isFormUpdate = (location.pathname.split('/')[3] === 'update') ? true : false;
  const isFormDelete = (location.pathname.split('/')[3] === 'delete') ? true : false;

  const { _id } = useParams();

  const { _types } = useSelector(state => state._app);

  const [isFormLoading, setIsFormLoading] = useState(isFormCreate ? false : true);
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [isDeleteConfirmationDialogOpen, setIsDeleteConfirmationDialogOpen] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);



  useEffect(() => {
    if (isFormUpdate || isFormDelete) {
      const socket = createSocket();

      socket.on('type-update', updated_id => {
        if (_id === updated_id) notificationToast('Data ini sudah diperbarui pengguna lain.', 'Tekan tombol \'Muat Ulang\' untuk melihat data yang terbaru.', 'warning');
      });

      socket.on('type-delete', deleted_id => {
        if (_id === deleted_id) {
          notificationToast('Data ini sudah dihapus pengguna lain.', null, 'warning');
          
          setTimeout(() => {
            navigate('/type');
          }, 2500);
        }
      });

      return () => socket.disconnect();
    }
  }, []);

  useEffect(() => {
    if (_types && isFormLoading) {
      setIsFormLoading(false);
      loadForm();
    }
  }, [_types]);


  
  function clearForm() {
    setName('');
    setNote('');
  }

  function loadForm() {
    const type = _types.filter(type => type._id === _id)[0];

    if (!type) navigate('/type');
    else {
      setName(type.name);
      setNote(type.note);
    }
  }

  async function formSubmit(e) {
    e?.preventDefault();
    setIsFormSubmitting(true);

    let payload = {};

    if (isFormCreate) {
      payload = {
        name: toProperString(name),
        note: toProperString(note)
      };
    } else if (isFormUpdate) {
      payload = {
        _id,
        name: toProperString(name),
        note: toProperString(note)
      };
    } else if (isFormDelete) {
      payload = {
        _id
      };
    }

    const res = await Fetch(
      '/type',
      isFormCreate ? 'POST' : isFormUpdate ? 'PUT' : isFormDelete ? 'DELETE' : undefined,
      payload, {title: `Sedang ${isFormCreate ? 'menambahkan' : isFormUpdate ? 'memperbarui' : isFormDelete ? 'menghapus' : ''} data tipe ...`},
      true
    );
    if (res) {
      setIsFormSubmitting(false);
      if (res.ok) {
        const socket = createSocket();
        if (isFormCreate) socket.emit('type-create');
        else if (isFormUpdate) socket.emit('type-update', _id);
        else if (isFormDelete) socket.emit('type-delete', _id);
        
        navigate('/type');
      }
    }
  }



  if (!isFormCreate && !isFormUpdate && !isFormDelete) return <Navigate to='/type' />

  return (
    <>
      <Form
        title={`${isFormCreate ? 'Tambah' : isFormUpdate ? 'Perbarui' : isFormDelete ? 'Hapus' : ''} Tipe`}
        form={(
          <div className='flex-1 overflow-auto gap-y-2 gap-x-4 flex flex-col sm:grid sm:grid-cols-2'>
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
          onConfirm={() => {setIsDeleteConfirmationDialogOpen(false); formSubmit(); setIsDeleteConfirmationDialogOpen(false)}}
          theme='red'
        />
      )}
    </>
  );
};
