import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { Input, Button, ConfirmationDialog } from '../../../components';
import { Fetch, createSocket } from '../../../functions';



export default function TypeForm() {
  const navigate = useNavigate();

  const { formType } = useParams();

  const [parameters] = useSearchParams();
  const _id = parameters.get('_id');

  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [isFormLoadingInitialData, setIsFormLoadingInitialData] = useState((formType === 'create') ? false : true);
  const [openFormDeleteDialog, setOpenFormDeleteDialog] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [formErrMsg, setFormErrMsg] = useState('');



  useEffect(() => {
    if (
      formType !== 'create' &&
      formType !== 'update' &&
      formType !== 'delete'
    ) navigate('/type');

    if (
      formType === 'update' ||
      formType === 'delete'
    ) loadFormInitialData();
  }, []);

  useEffect(() => {
    setFormErrMsg('');
  }, [name, note]);



  async function loadFormInitialData() {
    const res = await Fetch(`/type/get-all?_id=${_id}&name&note`);
    if (res?.ok) {
      if (res.payload.length === 0) navigate('/type');
      else {
        setName(res.payload[0].name);
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
      name: name.trimEnd(),
      note: note?.trimEnd()
    };

    const res = await Fetch(
      `/type/${formType}`,
      (formType === 'create') ? 'POST' : (formType === 'update') ? 'PUT' : 'DELETE',
      payload
    );
    if (res) {
      setIsFormSubmitting(false);
      if (res.ok) {
        const socket = createSocket();
        socket.emit(
          `type-${(formType === 'create') ? 'new' : formType}`,
          _id ? {_id} : undefined
        );

        navigate('/type');
      }
      else setFormErrMsg(res.message);
    }
  }

  function formClear() {
    setName('');
    setNote('');
  }

  function formReset() {
    setIsFormLoadingInitialData(true);
    loadFormInitialData();
  }



  return (
    <main>
      <form className='h-full flex flex-col' onSubmit={formOnSubmit}>
        <div className='text-xl'>{(formType === 'create') ? 'Tambah' : (formType === 'update') ? 'Ubah' : 'Hapus'} Tipe</div>

        {isFormLoadingInitialData && <div className='text-lg'>Sedang memuat data, mohon tunggu ...</div>}
        {isFormSubmitting && <div className='text-lg'>Sedang {(formType === 'create') ? 'menambahkan' : (formType === 'update') ? 'mengubah' : 'menghapus'} data, mohon tunggu ...</div>}
        {formErrMsg && <div className='text-lg text-red-500'>{formErrMsg}</div>}

        {!isFormLoadingInitialData && (
          <>
            <div className='pt-4 pb-8 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 md:gap-8 overflow-y-auto'>
              <div>
                <Input
                  label='Nama'
                  value={name}
                  onChange={value => setName(value.trimStart().toUpperCase())}
                  size='lg'
                  disabled={isFormLoadingInitialData || isFormSubmitting || (formType === 'delete')}
                />
              </div>
              <div>
                <Input
                  className='mt-4 sm:mt-0'
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
                onClick={() => navigate('/type')}
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
