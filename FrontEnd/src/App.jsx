import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';

import { Nav } from './components';
import { Fetch, createSocket } from './functions';
import {
  Login,
  Home,
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

    return () => {
      socket.disconnect();
    }
  }, []);

  useEffect(() => {
    if (_token) getAllAppData();
  }, [_token]);



  async function getAllAppData() {
    const typesRes = await Fetch('/type/get-all');
    if (typesRes?.ok) dispatch(setTypes(typesRes.payload));
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
          <Route path='/home' element={<Home />} />
          <Route path='/service' element={<Service />} />
          <Route path='/service/form/:formType' element={<ServiceForm />} />
          <Route path='/type' element={<Type />} />
          <Route path='/type/form/:formType' element={<TypeForm />} />
          <Route path='/transaction' element={<Transaction />} />
          <Route path='/transaction/form/:formType' element={<TransactionForm />} />
          <Route path='*' element={<Navigate to='/home' />} />
        </Routes>
      )}
    </>
  );
};
