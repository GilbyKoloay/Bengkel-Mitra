import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { Input, Button } from '../../../components';
import { Fetch } from '../../../functions';



export default function TypeForm() {
  const navigate = useNavigate();

  const { formType } = useParams();

  const [parameters, setParameters] = useSearchParams();
  const _id = parameters.get('_id');

  const [name, setName] = useState('');
  const [isFormValid, setIsFormValid] = useState((formType === 'create') ? true : false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [formErrMsg, setFormErrMsg] = useState('');



  useEffect(() => {
    validateFormType();
    if (
      formType === 'update' ||
      formType === 'delete'
    ) getType();
  }, []);

  useEffect(() => {
    setFormErrMsg('');
  }, [name]);



  function validateFormType() {
    if (
      formType !== 'create' &&
      formType !== 'update' &&
      formType !== 'delete'
    ) navigate('/home');
  }

  async function getType() {
    const res = await Fetch(`/type/get-all?_id=${_id}&name`);
    if (res?.ok) {
      setName(res.payload[0].name);
      setIsFormValid(true);
    }
  }

  async function formOnSubmit(e) {
    e.preventDefault();
    setIsFormSubmitting(true);

    const payload = {_id, name};
    // console.log('payload');

    const res = await Fetch(
      `/type/${formType}`,
      (formType === 'create') ? 'POST' : 'PUT',
      payload
    );
    if (res) {
      setIsFormSubmitting(false);
      if (res.ok) navigate('/type');
      else setFormErrMsg(res.message);
    }
  }

  function formClear() {
    setName('');
  }

  function formReset() {
    setIsFormValid(false);
    getType();
  }



  return (
    <main>
      <form className='h-full flex flex-col' onSubmit={formOnSubmit}>
        <div className='text-xl'>{
          (formType === 'create') ? 'Tambah '
          : (formType === 'update') ? 'Ubah '
          : (formType === 'delete') ? 'Hapus ' : ''}
          Tipe
        </div>

        {isFormSubmitting && <div className='text-lg'>Sedang menambahkan data, mohon tunggu ...</div>}
        {formErrMsg && <div className='text-lg text-red-500'>{formErrMsg}</div>}

        <div className='pt-4 pb-8 grid grid-cols-1 overflow-y-auto'>
          <div>
            <Input
              label='Nama'
              value={name}
              onChange={value => setName(value)}
              size='lg'
              disabled={!isFormValid || isFormSubmitting || (formType === 'delete')}
            />
          </div>
        </div>
        <div className='flex gap-2 sm:gap-4 md:gap-8'>
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
              disabled={!isFormValid || isFormSubmitting}
            />
          )}
          <Button
            className='flex-1'
            label={(formType === 'create') ? 'Tambah' : (formType === 'update') ? 'Ubah' : 'Hapus'}
            type='submit'
            size='lg'
            color={(formType === 'delete') ? 'red' : 'blue'}
            disabled={!isFormValid || isFormSubmitting}
          />
        </div>
      </form>
    </main>
  );
};
