import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { Nav } from './components';
import { Fetch, createSocket } from './functions';
import {
  Login,
  Service,
  ServiceForm,
  Type,
  TypeForm,
  Transaction,
  TransactionForm
} from './pages';
import { _app } from './redux';



export default function App() {
  const dispatch = useDispatch();

  const { _token } = useSelector(state => state._app);



  useEffect(() => {
    if (_token) {
      const socket = createSocket();

      socket.on('type-create', () => {getType(); getService();});
      socket.on('type-update', () => {getType(); getService();});
      socket.on('type-delete', () => {getType(); getService();});

      socket.on('service-create', getService);
      socket.on('service-update', getService);
      socket.on('service-delete', getService);

      socket.on('transaction-create', getTransaction);
      socket.on('transaction-update', getTransaction);
      socket.on('transaction-delete', getTransaction);


      
      getType();
      getService();
      getTransaction();

      return () => socket.disconnect();
    } 
    else {
      dispatch(_app.clearTypes());
      dispatch(_app.clearServices());
      dispatch(_app.clearTransactions());
    }
  }, [_token]);



  async function getService() {
    const res = await Fetch('/service');
    if (res.ok) dispatch(_app.setServices(res.payload));
  }

  async function getType() {
    const res = await Fetch('/type');
    if (res.ok) dispatch(_app.setTypes(res.payload));
  }

  async function getTransaction() {
    const res = await Fetch('/transaction');
    if (res.ok) dispatch(_app.setTransactions(res.payload));
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
          <Route path='/service' element={<Service />} />
          <Route path='/service/form/create' element={<ServiceForm />} />
          <Route path='/service/form/update/:_id' element={<ServiceForm />} />
          <Route path='/service/form/delete/:_id' element={<ServiceForm />} />
          <Route path='/service/*' element={<Navigate to='/service' />} />

          <Route path='/type' element={<Type />} />
          <Route path='/type/form/create' element={<TypeForm />} />
          <Route path='/type/form/update/:_id' element={<TypeForm />} />
          <Route path='/type/form/delete/:_id' element={<TypeForm />} />
          <Route path='/type/*' element={<Navigate to='/type' />} />

          <Route path='/transaction' element={<Transaction />} />
          <Route path='/transaction/form/create' element={<TransactionForm />} />
          <Route path='/transaction/form/update/:_id' element={<TransactionForm />} />
          <Route path='/transaction/form/delete/:_id' element={<TransactionForm />} />
          <Route path='/transaction/*' element={<Navigate to='/transaction' />} />

          <Route path='*' element={<Navigate to='/service' />} />
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
