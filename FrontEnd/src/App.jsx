import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';

import { Nav } from './components';
import { Login, Home } from './pages';



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
          <Route path='*' element={<Navigate to='/home' />} />
        </Routes>
      )}
    </>
  );
};
