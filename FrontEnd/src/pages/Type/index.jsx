import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button, Input } from '../../components';



export default function Type() {
  const navigate = useNavigate();

  const { types } = useSelector(state => state.app);

  const [filteredTypes, setFilteredTypes] = useState(null);
  const [filter, setFilter] = useState({
    name: ''
  });



  useEffect(() => {
    if (types) {
      const newFilteredTypes = types.filter(type =>
        (!filter.name || (type.name.includes(filter.name)))
      );
      setFilteredTypes(newFilteredTypes);
    }
  }, [types, filter.name]);



  function clearFilter() {
    setFilter({
      name: ''
    });
  }



  return (
    <main>
      <div>
        <Button
          label='Tambah Tipe'
          onClick={() => navigate('/type/form/create')}
          size='lg'
          color='blue'
        />
      </div>

      <div className='mt-4 overflow-auto'>
        <table className='w-full border border-blue-500'>
          <thead className='bg-blue-300'>
            <tr className='text-lg border-y border-blue-500'>
              {['Nama', 'Aksi'].map((title, index) => <th key={index} className='p-2 border-x border-blue-500'>{title}</th>)}
            </tr>
            {types?.length > 0 && (
              <>
                <tr className='border-y border-blue-500'>
                  <th className='p-2 border-x border-blue-500'>
                    <Input
                      className='font-normal'
                      value={filter.name}
                      onChange={value => setFilter({...filter, name: value.trimStart().toUpperCase()})}
                      placeholder='filter nama'
                      size='md'
                    />
                  </th>
                  <th className='p-2 border-x border-blue-500 w-0 whitespace-nowrap'>
                    <Button
                      className='w-full font-normal'
                      label='Bersihkan Filter'
                      onClick={clearFilter}
                      size='md'
                    />
                  </th>
                </tr>
                <tr className='border-y border-blue-500'>
                  <th colSpan={2} className='p-2 text-start'>Total: {filteredTypes?.length} dari {types.length}</th>
                </tr>
              </>
            )}
          </thead>
          <tbody>
            {!types ? (
              <tr>
                <td colSpan={2} className='p-2 text-center'>Sedang memuat data mohon tunggu ...</td>
              </tr>
            ) : (types.length === 0) ? (
              <tr>
                <td colSpan={2} className='p-2 text-center'>Data kosong.</td>
              </tr>
            ) : (filteredTypes?.length === 0) && (
              <tr>
                <td colSpan={2} className='p-2 text-center'>Data tidak ditemukan.</td>
              </tr>
            )}
            {filteredTypes?.map((type, index) => (
              <tr key={index} className='odd:bg-neutral-200 even:bg-neutral-300 hover:bg-blue-300'>
                <td className='p-2'>{type.name}</td>
                <td className='p-2'>
                  <div className='flex justify-center gap-4'>
                    <Button
                      label='Ubah'
                      onClick={() => navigate(`/type/form/update?_id=${type._id}`)}
                      color='yellow'
                    />
                    <Button
                      label='Hapus'
                      onClick={() => navigate(`/type/form/delete?_id=${type._id}`)}
                      color='red'
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};
