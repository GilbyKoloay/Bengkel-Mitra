import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import {
  Input,
  Button,
  Select,
  ConfirmationDialog
} from '../../../components';
import { Fetch, createSocket } from '../../../functions';



export default function TypeForm() {
  const navigate = useNavigate();

  const { formType } = useParams();

  const [parameters] = useSearchParams();
  const _id = parameters.get('_id');

  const { types } = useSelector(state => state.app);

  const [type, setType] = useState('');
  const [subType, setSubType] = useState('');
  const [name, setName] = useState('');
  const [price_class1, setPrice_class1] = useState('');
  const [price_class2, setPrice_class2] = useState('');
  const [price_class3, setPrice_class3] = useState('');
  const [price_class4, setPrice_class4] = useState('');
  const [price_class5, setPrice_class5] = useState('');
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
    ) navigate('/service');

    if (
      formType === 'update' ||
      formType === 'delete'
    ) loadFormInitialData();
  }, []);

  useEffect(() => {
    setFormErrMsg('');
  }, [name, type, subType, price_class1, price_class2, price_class3, price_class4, price_class5, note]);



  async function loadFormInitialData() {
    const res = await Fetch(`/service/get-all?_id=${_id}&name&type&subType&price`);
    if (res?.ok) {
      if (res.payload.length === 0) navigate('/service');
      else {
        setType(res.payload[0].type?._id);
        setSubType(res.payload[0].subType ? res.payload[0].subType : '');
        setName(res.payload[0].name);
        setPrice_class1(res.payload[0].price.class1);
        setPrice_class2(res.payload[0].price.class2);
        setPrice_class3(res.payload[0].price.class3);
        setPrice_class4(res.payload[0].price.class4);
        setPrice_class5(res.payload[0].price.class5);
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
      type: type,
      subType: subType?.trimEnd(),
      name: name.trimEnd(),
      price: {
        class1: parseInt(price_class1),
        class2: parseInt(price_class2),
        class3: parseInt(price_class3),
        class4: parseInt(price_class4),
        class5: parseInt(price_class5)
      },
      note: note?.trimEnd()
    };

    const res = await Fetch(
      `/service/${formType}`,
      (formType === 'create') ? 'POST' : (formType === 'update') ? 'PUT' : 'DELETE',
      payload
    );
    if (res) {
      setIsFormSubmitting(false);
      if (res.ok) {
        const socket = createSocket();
        socket.emit(
          `service-${(formType === 'create') ? 'new' : formType}`,
          _id ? {_id} : undefined
        );

        navigate('/service');
      }
      else setFormErrMsg(res.message);
    }
  }

  function formClear() {
    setType('');
    setSubType('');
    setName('');
    setPrice_class1('');
    setPrice_class2('');
    setPrice_class3('');
    setPrice_class4('');
    setPrice_class5('');
    setNote('');
  }

  function formReset() {
    setIsFormLoadingInitialData(true);
    loadFormInitialData();
  }



  return (
    <main>
      <form className='h-full flex flex-col' onSubmit={formOnSubmit}>
        <div className='text-xl'>{(formType === 'create') ? 'Tambah' : (formType === 'update') ? 'Ubah' : 'Hapus'} Layanan</div>

        {(isFormLoadingInitialData || !types) && <div className='text-lg'>Sedang memuat data, mohon tunggu ...</div>}
        {(types?.length === 0) && <div className='text-lg text-red-500'>Tipe masih kosong, silahkan mengisi tipe terlebih dahulu.</div>}
        {isFormSubmitting && <div className='text-lg'>Sedang {(formType === 'create') ? 'menambahkan' : (formType === 'update') ? 'mengubah' : 'menghapus'} data, mohon tunggu ...</div>}
        {formErrMsg && <div className='text-lg text-red-500'>{formErrMsg}</div>}

        {(!isFormLoadingInitialData && types?.length > 0) && (
          <>
            <div className='pt-4 pb-8 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 md:gap-8 overflow-y-auto'>
              <div>
                <Select
                  label='Tipe'
                  value={type}
                  onChange={value => setType(value)}
                  options={types.map(option => ([option._id, option.name]))}
                  placeholder='(TIPE)'
                  size='lg'
                  disabled={isFormLoadingInitialData || isFormSubmitting || (formType === 'delete')}
                />
                <Input
                  className='mt-4'
                  label='Subtipe'
                  value={subType}
                  onChange={value => setSubType(value.trimStart().toUpperCase())}
                  size='lg'
                  disabled={isFormLoadingInitialData || isFormSubmitting || (formType === 'delete')}
                />
                <Input
                  className='mt-4'
                  label='Nama'
                  value={name}
                  onChange={value => setName(value.trimStart().toUpperCase())}
                  size='lg'
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
              <div>
                <Input
                  className='mt-4 sm:mt-0'
                  label='Harga Kelas 1'
                  value={price_class1}
                  onChange={value => setPrice_class1(value.trim())}
                  size='lg'
                  disabled={isFormLoadingInitialData || isFormSubmitting || (formType === 'delete')}
                />
                <Input
                  className='mt-4'
                  label='Harga Kelas 2'
                  value={price_class2}
                  onChange={value => setPrice_class2(value.trim())}
                  size='lg'
                  disabled={isFormLoadingInitialData || isFormSubmitting || (formType === 'delete')}
                />
                <Input
                  className='mt-4'
                  label='Harga Kelas 3'
                  value={price_class3}
                  onChange={value => setPrice_class3(value.trim())}
                  size='lg'
                  disabled={isFormLoadingInitialData || isFormSubmitting || (formType === 'delete')}
                />
                <Input
                  className='mt-4'
                  label='Harga Kelas 4'
                  value={price_class4}
                  onChange={value => setPrice_class4(value.trim())}
                  size='lg'
                  disabled={isFormLoadingInitialData || isFormSubmitting || (formType === 'delete')}
                />
                <Input
                  className='mt-4'
                  label='Harga Kelas 5'
                  value={price_class5}
                  onChange={value => setPrice_class5(value.trim())}
                  size='lg'
                  disabled={isFormLoadingInitialData || isFormSubmitting || (formType === 'delete')}
                />
              </div>
            </div>
            <div className='flex flex-col sm:flex-row gap-2 sm:gap-4 md:gap-8'>
              <Button
                className='flex-1'
                label='Kembali'
                onClick={() => navigate('/service')}
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
