import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Input, Button } from '../../components';
import { Fetch } from '../../functions';
import { set_token } from '../../redux/app';



export default function Login() {
  const dispatch = useDispatch();
  
  const [bgColorShade, setBgColorShade] = useState(100);
  const [incrementBgColorShade, setIncrementBgColorShade] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [formErrMsg, setFormErrMsg] = useState('');



  useEffect(() => {
    const interval = setInterval(() => {
      if (incrementBgColorShade) {
        if (bgColorShade < 900) setBgColorShade(prev => prev + 100);
        else setIncrementBgColorShade(false);
      }
      else {
        if (bgColorShade > 100) setBgColorShade(prev => prev - 100);
        else setIncrementBgColorShade(true);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [bgColorShade, incrementBgColorShade]);

  useEffect(() => {
    setFormErrMsg('');
  }, [username, password]);



  async function formOnSubmit(e) {
    e.preventDefault();
    setIsFormSubmitting(true);
    
    const payload = {username, password};

    const res = await Fetch('/login', 'POST', payload);
    if (res) {
      setIsFormSubmitting(false);
      if (res.ok) dispatch(set_token(res.payload))
      else setFormErrMsg(res.message);
    }
  }



  return (
    <main className={`flex justify-center items-center gap-8 bg-blue-${bgColorShade} transition-colors duration-[2500ms]`}>
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
