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

      <div className='mt-4'>
        <table className='w-full border border-blue-500'>
          <thead className='bg-blue-300'>
            <tr className='text-lg border-b border-blue-500'>
              {['Nama', 'Aksi'].map((title, index) => <th key={index} className='py-2'>{title}</th>)}
            </tr>
            {types?.length > 0 && (
              <>
                <tr className='border-b border-blue-500'>
                  <th className='py-2 pl-2'>
                    <Input
                      className='font-normal'
                      value={filter.name}
                      onChange={value => setFilter({...filter, name: value.trimStart().toUpperCase()})}
                      placeholder='filter nama'
                      size='md'
                      disabled={!types?.length > 0}
                    />
                  </th>
                  <th className='py-2 pr-2 w-0 whitespace-nowrap'>
                    <Button
                      className='w-full font-normal'
                      label='Bersihkan Filter'
                      size='md'
                      disabled={!types?.length > 0}
                    />
                  </th>
                </tr>
                <tr className='border-b border-blue-500'>
                  <th colSpan={2} className='text-start py-2 px-2'>Total: {filteredTypes?.length} dari {types.length}</th>
                </tr>
              </>
            )}
          </thead>
          <tbody>
            {!types ? (
              <tr>
                <td colSpan={2} className='py-2 px-2 text-center'>Sedang memuat data mohon tunggu ...</td>
              </tr>
            ) : (types.length === 0) ? (
              <tr>
                <td colSpan={2} className='py-2 px-2 text-center'>Data kosong.</td>
              </tr>
            ) : (filteredTypes?.length === 0) && (
              <tr>
                <td colSpan={2} className='py-2 px-2 text-center'>Data tidak ditemukan.</td>
              </tr>
            )}
            {filteredTypes?.map((type, index) => (
              <tr key={index} className='odd:bg-neutral-200 even:bg-neutral-300 hover:bg-blue-300'>
                <td className='px-2'>{type.name}</td>
                <td className='py-2'>
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
