import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button, Input, Select } from '../../components';
import { toProperString } from '../../functions';



export default function Form() {
  const navigate = useNavigate();
  
  const { _types } = useSelector(state => state._app);

  const [name, setName] = useState('');
  const [note, setNote] = useState('');



  function clearFilter() {
    setName('');
    setNote('');
  }

  function filtered_types() {
    return _types?.filter(type => 
      (!name || type.name.includes(toProperString(name))) &&
      (!note || ((note === '-') && !type.note) || type.note?.includes(toProperString(note)))
    );
  }



  return (
    <main>
      <Button
        className='whitespace-nowrap'
        label='Tambah Tipe'
        onClick={() => navigate('/type/form/create')}
        size='md'
        theme='blue'
      />

      {!_types ? (
        <div className='mt-4 text-center text-xl'>Sedang memuat data, mohon tunggu ...</div>
      ) : (_types.length === 0) ? (
        <div className='mt-4 text-center text-xl'>Data kosong</div>
      ) : (
        <div className='mt-8 overflow-auto'>
          <div className='text-2xl'>Data Tipe</div>
          <table className='mt-4 w-full'>
            <thead className='bg-blue-500 border-2 border-blue-700'>
              <tr>
                {['Nama', 'Keterangan', 'Aksi'].map((title, index) => <th key={index} className='border border-blue-700 p-2'>{title}</th>)}
              </tr>
              <tr>
                <th className='border border-blue-700 font-normal p-2'>
                  <Input
                    value={name}
                    onChange={value => setName(value)}
                    placeholder='filter'
                  />
                </th>
                <th className='border border-blue-700 font-normal p-2'>
                  <Input
                    value={note}
                    onChange={value => setNote(value)}
                    placeholder='filter'
                  />
                </th>
                <th className='border border-blue-700 font-normal p-2 whitespace-nowrap'>
                  <Button
                    className='w-full'
                    label='Bersihkan filter'
                    onClick={clearFilter}
                  />
                </th>
              </tr>
              <tr>
                <th colSpan={3} className='text-left p-2 font-normal'>Total {filtered_types().length} dari {_types.length}</th>
              </tr>
            </thead>
            <tbody className='border-2 border-blue-700'>
              {filtered_types()?.map((type, index) => (
                <tr key={index} className='odd:bg-neutral-200 even:bg-neutral-300 hover:bg-blue-300'>
                  <td className='p-2'>{type.name}</td>
                  <td className='p-2'>{type.note ? type.note : '-'}</td>
                  <td className='p-2'>
                    <Select
                      options={[
                        ['PERBARUI', `/type/form/update/${type._id}`],
                        ['HAPUS', `/type/form/delete/${type._id}`]
                      ].map(option => [option[1], option[0]])}
                      onChange={value => navigate(value)}
                      placeholder='(Aksi)'
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};
