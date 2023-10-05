import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Table,
  Input,
  Select
} from '../../components';
import { splitString, toProperString } from '../../functions';
import { Main } from '../../layouts';



export default function Service() {
  const navigate = useNavigate();
  
  const { _services, _types } = useSelector(state => state._app);

  const [type_name, setType_name] = useState('SEMUA');
  const [subType, setSubType] = useState('');
  const [name, setName] = useState('');
  const [priceClass1, setPriceClass1] = useState('');
  const [priceClass2, setPriceClass2] = useState('');
  const [priceClass3, setPriceClass3] = useState('');
  const [priceClass4, setPriceClass4] = useState('');
  const [priceClass5, setPriceClass5] = useState('');
  const [note, setNote] = useState('');



  function clearFilter() {
    setType_name('SEMUA');
    setSubType('');
    setName('');
    setPriceClass1('');
    setPriceClass2('');
    setPriceClass3('');
    setPriceClass4('');
    setPriceClass5('');
    setNote('');
  }

  function filtered_services() {
    return _services?.filter(service =>
      (type_name === 'SEMUA' || (type_name === '-' && !service.type) || (service.type?.name === type_name)) &&
      (!subType || ((subType === '-') && !service.subType) || service.subType?.includes(toProperString(subType))) &&
      (!name || service.name.includes(toProperString(name))) &&
      (!priceClass1 || ((priceClass1 === '-') && !service.price.class1) || service.price.class1?.toString().includes(priceClass1)) &&
      (!priceClass2 || ((priceClass2 === '-') && !service.price.class2) || service.price.class2?.toString().includes(priceClass2)) &&
      (!priceClass3 || ((priceClass3 === '-') && !service.price.class3) || service.price.class3?.toString().includes(priceClass3)) &&
      (!priceClass4 || ((priceClass4 === '-') && !service.price.class4) || service.price.class4?.toString().includes(priceClass4)) &&
      (!priceClass5 || ((priceClass5 === '-') && !service.price.class5) || service.price.class5?.toString().includes(priceClass5)) &&
      (!note || ((note === '-') && !service.note) || service.note?.includes(toProperString(note)))
    );
  }



  return (
    <Main
      header={
        <>
          <Button
            className='whitespace-nowrap'
            label='Tambah Layanan'
            onClick={() => navigate('/service/form/create')}
            size='md'
            theme='blue'
          />
        </>
      }
      title='Data Layanan'
      table={!_services ? (
        <div className='mt-4 text-center text-xl'>Sedang memuat data, mohon tunggu ...</div>
      ) : (_services.length === 0) ? (
        <div className='mt-4 text-center text-xl'>Data kosong</div>
      ) : (
        <Table
          titles={[
            <>
              {[
                'Tipe',
                'Subtipe',
                'Nama'
              ].map((title, index) => <th key={index} rowSpan={2}>{title}</th>)}
              {[
                'Harga',
              ].map((title, index) => <th key={index} colSpan={5}>{title}</th>)}
              {[
                'Keterangan',
                'Aksi'
              ].map((title, index) => <th key={index} rowSpan={2}>{title}</th>)}
            </>,
            <>
              {[
                'Kelas 1',
                'Kelas 2',
                'Kelas 3',
                'Kelas 4',
                'Kelas 5'
              ].map((title, index) => <th key={index}>{title}</th>)}
            </>
          ]}
          filters={
            <>
              <th>
                <Select
                  value={type_name}
                  options={[{name: 'SEMUA'}, ..._types, {name: '-'}].map(option => [option.name, option.name])}
                  onChange={value => setType_name(value)}
                  placeholder='filter'
                />
              </th>
              <th>
                <Input
                  value={subType}
                  onChange={value => setSubType(value)}
                  placeholder='filter'
                />
              </th>
              <th>
                <Input
                  value={name}
                  onChange={value => setName(value)}
                  placeholder='filter'
                />
              </th>
              <th>
                <Input
                  value={priceClass1}
                  onChange={value => setPriceClass1(value)}
                  placeholder='filter'
                />
              </th>
              <th>
                <Input
                  value={priceClass2}
                  onChange={value => setPriceClass2(value)}
                  placeholder='filter'
                />
              </th>
              <th>
                <Input
                  value={priceClass3}
                  onChange={value => setPriceClass3(value)}
                  placeholder='filter'
                />
              </th>
              <th>
                <Input
                  value={priceClass4}
                  onChange={value => setPriceClass4(value)}
                  placeholder='filter'
                />
              </th>
              <th>
                <Input
                  value={priceClass5}
                  onChange={value => setPriceClass5(value)}
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
          info={<th colSpan={10}>Total {filtered_services().length} dari {_services.length}</th>}
          data={filtered_services()?.map((service, index) => (
            <tr key={index}>
              <td>{service.type?.name ? service.type.name : '-'}</td>
              <td>{service.subType ? service.subType : '-'}</td>
              <td>{service.name}</td>
              <td className='text-right'>{service.price.class1 ? splitString(service.price.class1, 3, '.') : '-'}</td>
              <td className='text-right'>{service.price.class2 ? splitString(service.price.class2, 3, '.') : '-'}</td>
              <td className='text-right'>{service.price.class3 ? splitString(service.price.class3, 3, '.') : '-'}</td>
              <td className='text-right'>{service.price.class4 ? splitString(service.price.class4, 3, '.') : '-'}</td>
              <td className='text-right'>{service.price.class5 ? splitString(service.price.class5, 3, '.') : '-'}</td>
              <td>{service.note ? service.note : '-'}</td>
              <td>
                <Select
                  options={[
                    'PERBARUI',
                    'HAPUS'
                  ].map(option => [option, option])}
                  onChange={value => {
                    if (value === 'PERBARUI') navigate(`/service/form/update/${service._id}`);
                    else if (value === 'HAPUS') navigate(`/service/form/delete/${service._id}`);
                  }}
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
