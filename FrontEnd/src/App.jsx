import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';

import { Nav } from './components';
import {
  Login,
  Home,
  Service,
  ServiceForm,
  Transaction,
  TransactionForm
} from './pages';



export default function App() {
  const { _token } = useSelector(state => state._token);



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
          <Route path='/service-form/:formType' element={<ServiceForm />} />
          <Route path='/transaction' element={<Transaction />} />
          <Route path='/transaction-form/:formType' element={<TransactionForm />} />
          <Route path='*' element={<Navigate to='/home' />} />
        </Routes>
      )}
    </>
  );
};
