import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button, Input, Select } from '../../components';
import { splitString, toProperString } from '../../functions';



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
    <main>
      <Button
        className='whitespace-nowrap'
        label='Tambah Layanan'
        onClick={() => navigate('/service/form/create')}
        size='md'
        theme='blue'
      />

      {!_services ? (
        <div className='mt-4 text-center text-xl'>Sedang memuat data, mohon tunggu ...</div>
      ) : (_services.length === 0) ? (
        <div className='mt-4 text-center text-xl'>Data kosong</div>
      ) : (
        <div className='mt-8 overflow-auto'>
          <div className='text-2xl'>Data Layanan</div>
          <table className='mt-4 w-full'>
            <thead className='bg-blue-500 border-2 border-blue-700'>
              <tr>
                {['Tipe', 'Subtipe', 'Nama'].map((title, index) => <th key={index} rowSpan={2} className='border border-blue-700 p-2'>{title}</th>)}
                {['Harga'].map((title, index) => <th key={index} colSpan={5} className='border border-blue-700 p-2'>{title}</th>)}
                {['Keterangan', 'Aksi'].map((title, index) => <th key={index} rowSpan={2} className='border border-blue-700 p-2'>{title}</th>)}
              </tr>
              <tr>
                {['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5'].map((title, index) => <th key={index} className='border border-blue-700 p-2'>{title}</th>)}
              </tr>
              <tr>
                <th className='border border-blue-700  font-normal p-2'>
                  <Select
                    value={type_name}
                    options={[{name: 'SEMUA'}, ..._types, {name: '-'}].map(option => [option.name, option.name])}
                    onChange={value => setType_name(value)}
                    placeholder='filter'
                  />
                </th>
                <th className='border border-blue-700 font-normal p-2'>
                  <Input
                    value={subType}
                    onChange={value => setSubType(value)}
                    placeholder='filter'
                  />
                </th>
                <th className='border border-blue-700 font-normal p-2'>
                  <Input
                    value={name}
                    onChange={value => setName(value)}
                    placeholder='filter'
                  />
                </th>
                <th className='border border-blue-700 font-normal p-2'>
                  <Input
                    value={priceClass1}
                    onChange={value => setPriceClass1(value)}
                    placeholder='filter'
                  />
                </th>
                <th className='border border-blue-700 font-normal p-2'>
                  <Input
                    value={priceClass2}
                    onChange={value => setPriceClass2(value)}
                    placeholder='filter'
                  />
                </th>
                <th className='border border-blue-700 font-normal p-2'>
                  <Input
                    value={priceClass3}
                    onChange={value => setPriceClass3(value)}
                    placeholder='filter'
                  />
                </th>
                <th className='border border-blue-700 font-normal p-2'>
                  <Input
                    value={priceClass4}
                    onChange={value => setPriceClass4(value)}
                    placeholder='filter'
                  />
                </th>
                <th className='border border-blue-700 font-normal p-2'>
                  <Input
                    value={priceClass5}
                    onChange={value => setPriceClass5(value)}
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
                <th colSpan={10} className='text-left p-2 font-normal'>Total {filtered_services().length} dari {_services.length}</th>
              </tr>
            </thead>
            <tbody className='border-2 border-blue-700'>
              {filtered_services()?.map((service, index) => (
                <tr key={index} className='odd:bg-neutral-200 even:bg-neutral-300 hover:bg-blue-300'>
                  <td className='p-2'>{service.type?.name ? service.type.name : '-'}</td>
                  <td className='p-2'>{service.subType ? service.subType : '-'}</td>
                  <td className='p-2'>{service.name}</td>
                  <td className='p-2 text-right'>{service.price.class1 ? splitString(service.price.class1, 3, '.') : '-'}</td>
                  <td className='p-2 text-right'>{service.price.class2 ? splitString(service.price.class2, 3, '.') : '-'}</td>
                  <td className='p-2 text-right'>{service.price.class3 ? splitString(service.price.class3, 3, '.') : '-'}</td>
                  <td className='p-2 text-right'>{service.price.class4 ? splitString(service.price.class4, 3, '.') : '-'}</td>
                  <td className='p-2 text-right'>{service.price.class5 ? splitString(service.price.class5, 3, '.') : '-'}</td>
                  <td className='p-2'>{service.note ? service.note : '-'}</td>
                  <td className='p-2'>
                    <Select
                      options={[
                        ['PERBARUI', `/service/form/update/${service._id}`],
                        ['HAPUS', `/service/form/delete/${service._id}`]
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
