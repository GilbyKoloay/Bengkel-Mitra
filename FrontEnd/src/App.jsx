import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { Nav } from './components';
import { Fetch, createSocket } from './functions';
import {
  Login,
  Invoice,
  InvoiceSelected,
  InvoiceForm
} from './pages';
import { _app } from './redux';



export default function App() {
  const dispatch = useDispatch();

  const { _token } = useSelector(state => state._app);



  useEffect(() => {
    if (_token) {
      const socket = createSocket();

      socket.on('invoice-create', getInvoice);
      socket.on('invoice-update', getInvoice);
      socket.on('invoice-delete', getInvoice);

      getInvoice();

      return () => socket.disconnect();
    } 
    else dispatch(_app.clearInvoices());
  }, [_token]);




  async function getInvoice() {
    const res = await Fetch('/invoice');
    if (res.ok) dispatch(_app.setInvoices(res.payload));
  }



  return (
    <>
      {_token && <Nav />}
      {!_token ? (
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='*' element={<Navigate to='/login' />} />
        </Routes>
      ) : (
        <Routes>
          <Route path='/invoice' element={<Invoice />} />
          <Route path='/invoice/:_id' element={<InvoiceSelected />} />
          <Route path='/invoice/form/create' element={<InvoiceForm />} />
          <Route path='/invoice/form/update/:_id' element={<InvoiceForm />} />
          <Route path='/invoice/form/delete/:_id' element={<InvoiceForm />} />
          <Route path='/invoice/*' element={<Navigate to='/invoice' />} />
          <Route path='*' element={<Navigate to='/invoice' />} />
        </Routes>
      )}

      <ToastContainer
        position='top-right'
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme='colored'
      />
    </>
  );
};
