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
    // ['/service', 'Layanan'],
    // ['/type', 'Tipe'],
    // ['/transaction', 'Transaksi'],
    ['/invoice', 'Faktur']
  ];

  const [isLogoutConfirmDialogOpen, setIsLogoutConfirmDialogOpen] = useState(false);



  return (
    <nav className='bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 border-b-2 border-blue-700 h-16 px-4 flex justify-between items-center gap-4'>
      <div className='w-full flex items-center gap-2'>
        <Select
          className='w-full sm:hidden'
          value={
            (location.pathname.includes('/service')) ? '/service' :
            (location.pathname.includes('/type')) ? '/type' :
            (location.pathname.includes('/transaction')) ? '/transaction' :
            (location.pathname.includes('/invoice')) ? '/invoice' : ''
          }
          options={pages}
          onChange={value => navigate(value)}
          placeholder='(Halaman)'
          size='lg'
          theme='blue'
        />

        {pages.map((page, index) => (
          <Button
            key={index}
            className='hidden sm:inline-block'
            label={page[1]}
            onClick={() => navigate(page[0])}
            disabled={location.pathname.includes(page[0])}
            size='md'
            theme='blue'
          />
        ))}
      </div>

      <Button
        label='Keluar'
        onClick={() => setIsLogoutConfirmDialogOpen(true)}
        size='md'
        theme='red'
      />



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
