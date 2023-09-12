import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Input, Button } from '../../components';
import { Fetch } from '../../functions';



export default function ServiceForm() {
  const navigate = useNavigate();

  const { formType } = useParams();

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [subType, setSubType] = useState('');
  const [priceClass1, setPriceClass1] = useState('');
  const [priceClass2, setPriceClass2] = useState('');
  const [priceClass3, setPriceClass3] = useState('');
  const [priceClass4, setPriceClass4] = useState('');
  const [priceClass5, setPriceClass5] = useState('');
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [formErrMsg, setFormErrMsg] = useState('');



  useEffect(() => {
    validateFormType();
  }, []);

  useEffect(() => {
    setFormErrMsg('');
  }, [name, type, subType, priceClass1, priceClass2, priceClass3, priceClass4, priceClass5]);



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

    const payload = {
      name,
      type,
      subType,
      price: {
        class1: priceClass1,
        class2: priceClass2,
        class3: priceClass3,
        class4: priceClass4,
        class5: priceClass5
      }
    };
    console.log('payload');

    const res = await Fetch('/service/create', 'POST', payload);
    if (res) {
      setIsFormSubmitting(false);
      if (!res.ok) setFormErrMsg(res.message);
    }
  }

  function clearForm() {
    setName('');
    setType('');
    setSubType('');
    setPriceClass1('');
    setPriceClass2('');
    setPriceClass3('');
    setPriceClass4('');
    setPriceClass5('');
  }



  return (
    <main>
      <form className='h-full flex flex-col' onSubmit={formOnSubmit}>
        {isFormSubmitting && <div className='mb-4 text-xl'>Sedang menambahkan data, mohon tunggu ...</div>}
        {formErrMsg && <div className='mb-4 text-xl text-red-500'>{formErrMsg}</div>}

        <div className='flex-1 pb-8 grid grid-cols-1 sm:grid-cols-2 sm:gap-8 md:gap-16 overflow-y-auto'>
          <div>
            <Input
              label='Nama'
              value={name}
              onChange={value => setName(value)}
              size='lg'
            />
            <Input
              className='mt-4'
              label='Tipe'
              value={type}
              onChange={value => setType(value)}
              size='lg'
            />
            <Input
              className='mt-4'
              label='Subtipe'
              value={subType}
              onChange={value => setSubType(value)}
              size='lg'
            />
          </div>
          <div>
            <Input
              className='mt-4 sm:mt-0'
              label='Harga Kelas 1'
              value={priceClass1}
              onChange={value => setPriceClass1(value)}
              size='lg'
            />
            <Input
              className='mt-4'
              label='Harga Kelas 2'
              value={priceClass2}
              onChange={value => setPriceClass2(value)}
              size='lg'
            />
            <Input
              className='mt-4'
              label='Harga Kelas 3'
              value={priceClass3}
              onChange={value => setPriceClass3(value)}
              size='lg'
            />
            <Input
              className='mt-4'
              label='Harga Kelas 4'
              value={priceClass4}
              onChange={value => setPriceClass4(value)}
              size='lg'
            />
            <Input
              className='mt-4'
              label='Harga Kelas 5'
              value={priceClass5}
              onChange={value => setPriceClass5(value)}
              size='lg'
            />
          </div>
        </div>
        <div className='flex gap-4 sm:gap-8 md:gap-16'>
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
