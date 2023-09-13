import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';

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
import { setServices, setTypes, setTransactions } from './redux/app';



export default function App() {
  const dispatch = useDispatch();

  const { _token } = useSelector(state => state.app);



  useEffect(() => {
    const socket = createSocket();

    if (_token) {
      getService();
      getType();

      socket.on('service-new', getService);
      socket.on('type-new', () => {
        getService();
        getType();
      });
    }

    return () => {
      socket.disconnect();
    }
  }, [_token]);



  async function getService() {
    const res = await Fetch('/service/get-all');
    if (res?.ok) dispatch(setServices(res.payload));
  }

  async function getType() {
    const res = await Fetch('/type/get-all');
    if (res?.ok) dispatch(setTypes(res.payload));
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
          <Route path='/service/form/:formType' element={<ServiceForm />} />
          <Route path='/type' element={<Type />} />
          <Route path='/type/form/:formType' element={<TypeForm />} />
          <Route path='/transaction' element={<Transaction />} />
          <Route path='/transaction/form/:formType' element={<TransactionForm />} />
          <Route path='*' element={<Navigate to='/service' />} />
        </Routes>
      )}
    </>
  );
};
