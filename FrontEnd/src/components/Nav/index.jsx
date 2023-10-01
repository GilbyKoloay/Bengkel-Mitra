import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { Select, Button, ConfirmationDialog } from '../';
import { _app } from '../../redux';



export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const pages = [
    ['/service', 'Layanan'],
    ['/type', 'Tipe'],
    ['/transaction', 'Transaksi']
  ];

  const [isLogoutConfirmDialogOpen, setIsLogoutConfirmDialogOpen] = useState(false);



  return (
    <nav className='h-[10vh] bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 border-b-2 border-blue-500 flex justify-between items-center px-4'>
      <div className='flex sm:hidden'>
        <Select
          className='flex-1 mx-4'
          value={
            (location.pathname.includes('/service')) ? '/service' :
            (location.pathname.includes('/type')) ? '/type' :
            (location.pathname.includes('/transaction')) ? '/transaction' : ''
          }
          options={pages}
          onChange={value => navigate(value)}
          placeholder='(Halaman)'
          size='md'
          theme='blue'
        />
      </div>
      <div className='hidden sm:flex gap-4'>
        {pages.map((page, index) => (
          <Button
            key={index}
            label={page[1]}
            onClick={() => navigate(page[0])}
            disabled={location.pathname.includes(page[0])}
            size='md'
            theme='blue'
          />
        ))}
      </div>

      <div>
        <Button
          label='Keluar'
          onClick={() => setIsLogoutConfirmDialogOpen(true)}
          size='md'
          theme='red'
        />
      </div>

      {isLogoutConfirmDialogOpen && (
        <ConfirmationDialog
          title='Konfirmasi Keluar'
          description='Apakah anda yakin ingin keluar?'
          onCancel={() => setIsLogoutConfirmDialogOpen(false)}
          onConfirm={() => {setIsLogoutConfirmDialogOpen(false); dispatch(_app.clearToken())}}
          theme='red'
        />
      )}
    </nav>
  );
};
