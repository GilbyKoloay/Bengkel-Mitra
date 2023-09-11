import { useState } from 'react';

import { Input, Button } from '../../components';



export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);



  function formOnSubmit(e) {
    e.preventDefault();
    setIsFormSubmitting(true);

    const payload = {username, password};
    console.log('payload', payload);

    setTimeout(() => {
      setIsFormSubmitting(false);
    }, 1000);
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
        <Button
          className='mt-16 w-full'
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
