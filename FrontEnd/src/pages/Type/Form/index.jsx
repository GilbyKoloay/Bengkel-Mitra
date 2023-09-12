import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Input, Button } from '../../../components';
import { Fetch } from '../../../functions';



export default function TypeForm() {
  const navigate = useNavigate();

  const { formType } = useParams();

  const [name, setName] = useState('');
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [formErrMsg, setFormErrMsg] = useState('');



  useEffect(() => {
    validateFormType();
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

  async function formOnSubmit(e) {
    e.preventDefault();
    setIsFormSubmitting(true);

    const payload = {name};
    // console.log('payload');

    const res = await Fetch('/type/create', 'POST', payload);
    if (res) {
      setIsFormSubmitting(false);
      if (res.ok) navigate('/type');
      else setFormErrMsg(res.message);
    }
  }

  function clearForm() {
    setName('');
  }



  return (
    <main>
      <form className='h-full flex flex-col' onSubmit={formOnSubmit}>
        <div className='text-xl'>{
          (formType === 'create') ? 'Tambah '
          : (formType === 'update') ? 'Perbarui '
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
          <Button
            className='flex-1'
            label='Bersihkan'
            onClick={clearForm}
            size='lg'
            color='red'
          />
          <Button
            className='flex-1'
            label='Tambah'
            type='submit'
            size='lg'
            color='blue'
            disabled={isFormSubmitting}
          />
        </div>
      </form>
    </main>
  );
};
