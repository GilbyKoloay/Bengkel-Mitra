import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Input, Button } from '../../components';
import { Fetch } from '../../functions';
import { set_token } from '../../redux/app';



export default function Login() {
  const dispatch = useDispatch();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [formErrMsg, setFormErrMsg] = useState('');



  useEffect(() => {
    setFormErrMsg('');
  }, [username, password]);



  async function formOnSubmit(e) {
    e.preventDefault();
    setIsFormSubmitting(true);
    
    const payload = {username, password};
    // console.log('payload', payload);

    const res = await Fetch('/login', 'POST', payload);
    if (res) {
      setIsFormSubmitting(false);
      if (res.ok) dispatch(set_token(res.payload))
      else setFormErrMsg(res.message);
    }
  }



  return (
    <main className='flex justify-center items-center gap-8'>
      <form onSubmit={formOnSubmit}>
        <Input
          label='Nama Pengguna'
          value={username}
          onChange={value => setUsername(value)}
          size='lg'
          disabled={isFormSubmitting}
        />
        <Input
          className='mt-4'
          label='Kata Sandi'
          value={password}
          onChange={value => setPassword(value)}
          type='password'
          size='lg'
          disabled={isFormSubmitting}
        />

        {formErrMsg && <div className='my-4 text-center text-red-500'>{formErrMsg}</div>}
        
        <Button
          className={`w-full ${!formErrMsg ? 'mt-8' : ''}`}
          label='Masuk'
          type='submit'
          size='lg'
          color='blue'
          disabled={isFormSubmitting}
        />
      </form>
    </main>
  );
};
