import { Routes, Route, Navigate } from 'react-router-dom';

import { Login, Home } from './pages';



export default function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/home' element={<Home />} />
      <Route path='*' element={<Navigate to='/home' />} />
    </Routes>
  );
};
