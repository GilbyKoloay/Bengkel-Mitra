import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { Button, Select } from '../';
import { clear_token } from '../../redux/_token';



const PageButton = ({ label, URL }) => {
  const navigate = useNavigate();
  const location = useLocation();



  return (
    <Button
      label={label}
      onClick={() => navigate(URL)}
      color='blue'
      disabled={location.pathname === URL}
    />
  );
};



export default function Nav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();



  return (
    <nav className='bg-blue-300 flex-1 border round border-blue-700 px-8 flex justify-between gap-8'>
      <div className='hidden md:flex text-xl flex-col justify-center items-center hover:cursor-pointer'>
        <div>Bengkel</div>
        <div>Mitra</div>
      </div>

      <div className='flex-1 flex items-center'>
        <div className='md:hidden h-full w-full py-2'>
          <Select
            className='h-full w-full'
            onChange={value => navigate(value)}
            options={[
              ['/service', 'Layanan'],
              ['/service-form/create', 'Tambah Layanan'],
              ['/transaction', 'Transaksi'],
              ['/transaction-form/create', 'Tambah Transaksi']
            ]}
            size='lg'
            color='blue'
          />
        </div>
        <div className='hidden md:flex h-full w-full py-2 gap-4'>
          <PageButton label='Layanan' URL='/service' />
          <PageButton label='Tambah Layanan' URL='/service-form/create' />
          <PageButton label='Transaksi' URL='/transaction' />
          <PageButton label='Tambah Transaksi' URL='/transaction-form/create' />
        </div>
      </div>

      <div className='flex items-center'>
        <Button
          label='Keluar'
          onClick={() => dispatch(clear_token())}
          size='md'
          color='red'
        />
      </div>
    </nav>
  );
};
