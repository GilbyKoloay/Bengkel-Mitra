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
  const [loginButtonLabel, setLoginButonLabel] = useState('Masuk');
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);



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
    setLoginButonLabel('Masuk');
  }, [username, password]);



  async function formOnSubmit(e) {
    e.preventDefault();
    setIsFormSubmitting(true);
    
    const payload = {username, password};

    const res = await Fetch('/login', 'POST', payload);
    if (res) {
      setIsFormSubmitting(false);
      if (res.ok) dispatch(set_token(res.payload))
      else setLoginButonLabel(res.message);
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
        
        <Button
          className='w-full mt-8'
          label={loginButtonLabel}
          type='submit'
          size='lg'
          color={(loginButtonLabel === 'Masuk') ? 'blue' : 'red'}
          disabled={isFormSubmitting}
        />
      </form>
    </main>
  );
};
