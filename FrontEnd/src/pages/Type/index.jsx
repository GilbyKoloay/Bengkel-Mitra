import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Table,
  Input,
  Select
} from '../../components';
import { toProperString } from '../../functions';
import { Main } from '../../layouts';



export default function Type() {
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
    <Main
      header={
        <>
          <Button
            className='whitespace-nowrap'
            label='Tambah Tipe'
            onClick={() => navigate('/type/form/create')}
            size='md'
            theme='blue'
          />
        </>
      }
      title='Data Tipe'
      table={!_types ? (
        <div className='mt-4 text-center text-xl'>Sedang memuat data, mohon tunggu ...</div>
      ) : (_types.length === 0) ? (
        <div className='mt-4 text-center text-xl'>Data kosong</div>
      ) : (
        <Table
          titles={[
            <>
              {[
                'Nama',
                'Keterangan',
                'Aksi'
              ].map((title, index) => <th key={index}>{title}</th>)}
            </>
          ]}
          filters={
            <>
              <th>
                <Input
                  value={name}
                  onChange={value => setName(value)}
                  placeholder='filter'
                />
              </th>
              <th>
                <Input
                  value={note}
                  onChange={value => setNote(value)}
                  placeholder='filter'
                />
              </th>
              <th>
                <Button
                  className='w-full'
                  label='Bersihkan filter'
                  onClick={clearFilter}
                />
              </th>
            </>
          }
          info={<th colSpan={3}>Total {filtered_types().length} dari {_types.length}</th>}
          data={filtered_types()?.map((type, index) => (
            <tr key={index}>
              <td>{type.name}</td>
              <td>{type.note ? type.note : '-'}</td>
              <td>
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
        />
      )}
    />
  );
};
