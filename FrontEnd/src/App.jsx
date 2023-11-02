import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { Nav } from './components';
import { Fetch } from './functions';
import {
  Login,
  Invoice,
  InvoiceForm,
  InvoicePDFView
} from './pages';
import { _app } from './redux';



export default function App() {
  const dispatch = useDispatch();

  const { _token } = useSelector(state => state._app);



  useEffect(() => {
    if (_token) getInvoice();
    else dispatch(_app.clearInvoices());
  }, [_token]);



  async function getInvoice() {
    const res = await Fetch('/invoice');
    if (res.ok) dispatch(_app.setInvoices(res.payload));
  }



  return (
    <>
      {/* {_token && <Nav />} */}
      {!_token ? (
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='*' element={<Navigate to='/login' />} />
        </Routes>
      ) : (
        <Routes>
          <Route path='/invoice' element={<Invoice />} />
          <Route path='/invoice/form' element={<InvoiceForm />} />
          <Route path='/invoice/pdf-view' element={<InvoicePDFView />} />
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
