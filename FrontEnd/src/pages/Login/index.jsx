import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Input, Button } from '../../components';
import { Fetch } from '../../functions';
import { _app } from '../../redux';



export default function Login() {
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);



  async function onSubmit(e) {
    e.preventDefault();
    setIsFormSubmitting(true);

    const payload = {
      username: username.trim(),
      password: password.trim()
    };

    const res = await Fetch('/login', 'POST', payload, {title: 'Mohon tunggu ...'}, true);
    if (res) {
      setIsFormSubmitting(false);
      if (res.ok) dispatch(_app.setToken(res.payload));
    }
  }



  return (
    <main className='h-screen flex justify-center items-center bg-gradient-to-b from-cyan-500 via-blue-500 to-violet-500'>
      <form onSubmit={onSubmit} className='w-5/6 sm:w-4/6 md:w-3/6 lg:w-2/6'>
      <Input
          label='Nama Pengguna'
          value={username}
          onChange={value => setUsername(value)}
          disabled={isFormSubmitting}
          size='lg'
        />
        <Input
          className='mt-4'
          label='Kata Sandi'
          value={password}
          onChange={value => setPassword(value)}
          disabled={isFormSubmitting}
          type='password'
          size='lg'
        />
        <Button
          className='mt-8 w-full'
          label='Masuk'
          type='submit'
          disabled={isFormSubmitting}
          size='lg'
          theme='blue'
        />
      </form>
    </main>
  );
};
