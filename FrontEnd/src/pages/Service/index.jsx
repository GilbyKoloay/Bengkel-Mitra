import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button, Input, Select } from '../../components';
import { splitString } from '../../functions';



export default function Type() {
  const navigate = useNavigate();

  const { services, types } = useSelector(state => state.app);

  const [filteredServices, setFilteredServices] = useState(null);
  const [filter, setFilter] = useState({
    type: 'SEMUA',
    subType: '',
    name: '',
    priceClass1: '',
    priceClass2: '',
    priceClass3: '',
    priceClass4: '',
    priceClass5: '',
    note: ''
  });



  useEffect(() => {
    if (services) {
      const newFilteredServices = services.filter(service =>
        ((filter.type === 'SEMUA') || (service?.type?.name.includes(filter.type))) &&
        (!filter.subType || ((filter.subType === '-') && !service.subType) || (service.subType?.includes(filter.subType))) &&
        (!filter.name || (service.name.includes(filter.name))) &&
        (!filter.priceClass1 || ((filter.priceClass1 === '-') && !service.price.class1) || (service.price.class1?.toString().includes(filter.priceClass1))) &&
        (!filter.priceClass2 || ((filter.priceClass2 === '-') && !service.price.class2) || (service.price.class2?.toString().includes(filter.priceClass2))) &&
        (!filter.priceClass3 || ((filter.priceClass3 === '-') && !service.price.class3) || (service.price.class3?.toString().includes(filter.priceClass3))) &&
        (!filter.priceClass4 || ((filter.priceClass4 === '-') && !service.price.class4) || (service.price.class4?.toString().includes(filter.priceClass4))) &&
        (!filter.priceClass5 || ((filter.priceClass5 === '-') && !service.price.class5) || (service.price.class5?.toString().includes(filter.priceClass5))) &&
        (!filter.note || ((filter.note === '-') && !service.note) || (service.note?.includes(filter.note)))
      );
      setFilteredServices(newFilteredServices);
    }
  }, [services, types, filter.name, filter.type, filter.subType, filter.priceClass1, filter.priceClass2, filter.priceClass3, filter.priceClass4, filter.priceClass5, filter.note]);



  function clearFilter() {
    setFilter({
      type: 'SEMUA',
      subType: '',
      name: '',
      priceClass1: '',
      priceClass2: '',
      priceClass3: '',
      priceClass4: '',
      priceClass5: '',
      note: ''
    });
  }



  return (
    <main>
      <div>
        <Button
          label='Tambah Layanan'
          onClick={() => navigate('/service/form/create')}
          size='lg'
          color='blue'
        />
      </div>

      <div className='mt-4 overflow-auto'>
        <table className='w-full border border-blue-500'>
          <thead className='bg-blue-300'>
            <tr className='text-lg border-y border-blue-500'>
              {['Tipe', 'Subtipe', 'Nama'].map((title, index) => (
                <th
                  key={index}
                  rowSpan={2}
                  className='p-2 border-x border-blue-500'
                >
                  {title}
                </th>
              ))}
              <th colSpan={5} className='p-2 border-x border-blue-500'>Harga</th>
              {['Keterangan', 'Aksi'].map((title, index) => (
                <th
                  key={index}
                  rowSpan={2}
                  className='p-2 border-x border-blue-500'
                >
                  {title}
                </th>
              ))}
            </tr>
            <tr className='text-lg border-y border-blue-500'>
              {['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5'].map((title, index) => <th key={index} className='p-2 border-x border-blue-500'>{title}</th>)}
            </tr>
            {((services?.length > 0) && (types?.length > 0)) && (
              <>
                <tr className='border-y border-blue-500'>
                  <th className='p-2 border-x border-blue-500'>
                    <Select
                      className='font-normal'
                      value={filter.type}
                      options={[{name: 'SEMUA'}, ...types].map(option => [option.name, option.name])}
                      onChange={value => setFilter({...filter, type: value})}
                      size='md'
                    />
                  </th>
                  <th className='p-2 border-x border-blue-500'>
                    <Input
                      className='font-normal'
                      value={filter.subType}
                      onChange={value => setFilter({...filter, subType: value.trimStart().toUpperCase()})}
                      placeholder='filter subtipe'
                      size='md'
                    />
                  </th>
                  <th className='p-2 border-x border-blue-500'>
                    <Input
                      className='font-normal'
                      value={filter.name}
                      onChange={value => setFilter({...filter, name: value.trimStart().toUpperCase()})}
                      placeholder='filter nama'
                      size='md'
                    />
                  </th>
                  <th className='p-2 border-x border-blue-500'>
                    <Input
                      className='font-normal'
                      value={filter.priceClass1}
                      onChange={value => setFilter({...filter, priceClass1: value.trim()})}
                      placeholder='filter harga kelas 1'
                      size='md'
                    />
                  </th>
                  <th className='p-2 border-x border-blue-500'>
                    <Input
                      className='font-normal'
                      value={filter.priceClass2}
                      onChange={value => setFilter({...filter, priceClass2: value.trim()})}
                      placeholder='filter harga kelas 2'
                      size='md'
                    />
                  </th>
                  <th className='p-2 border-x border-blue-500'>
                    <Input
                      className='font-normal'
                      value={filter.priceClass3}
                      onChange={value => setFilter({...filter, priceClass3: value.trim()})}
                      placeholder='filter harga kelas 3'
                      size='md'
                    />
                  </th>
                  <th className='p-2 border-x border-blue-500'>
                    <Input
                      className='font-normal'
                      value={filter.priceClass4}
                      onChange={value => setFilter({...filter, priceClass4: value.trim()})}
                      placeholder='filter harga kelas 4'
                      size='md'
                    />
                  </th>
                  <th className='p-2 border-x border-blue-500'>
                    <Input
                      className='font-normal'
                      value={filter.priceClass5}
                      onChange={value => setFilter({...filter, priceClass5: value.trim()})}
                      placeholder='filter harga kelas 5'
                      size='md'
                    />
                  </th>
                  <th className='p-2 border-x border-blue-500'>
                    <Input
                      className='font-normal'
                      value={filter.note}
                      onChange={value => setFilter({...filter, note: value.trimStart().toUpperCase()})}
                      placeholder='filter keterangan'
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
                  <th colSpan={10} className='p-2 text-start'>Total: {filteredServices?.length} dari {services.length}</th>
                </tr>
              </>
            )}
          </thead>
          <tbody>
            {!services ? (
              <tr>
                <td colSpan={10} className='p-2 text-center'>Sedang memuat data mohon tunggu ...</td>
              </tr>
            ) : (services.length === 0) ? (
              <tr>
                <td colSpan={10} className='p-2 text-center'>Data kosong.</td>
              </tr>
            ) : (filteredServices?.length === 0) && (
              <tr>
                <td colSpan={10} className='p-2 text-center'>Data tidak ditemukan.</td>
              </tr>
            )}
            {filteredServices?.map((service, index) => (
              <tr key={index} className='odd:bg-neutral-200 even:bg-neutral-300 hover:bg-blue-300'>
                <td className='p-2'>{service?.type?.name ? service.type.name : '-'}</td>
                <td className='p-2'>{service.subType ? service.subType : '-'}</td>
                <td className='p-2'>{service.name}</td>
                <td className='p-2 text-end'>{service.price.class1 ? splitString(service.price.class1, 3, '.') : '-'}</td>
                <td className='p-2 text-end'>{service.price.class2 ? splitString(service.price.class2, 3, '.') : '-'}</td>
                <td className='p-2 text-end'>{service.price.class3 ? splitString(service.price.class3, 3, '.') : '-'}</td>
                <td className='p-2 text-end'>{service.price.class4 ? splitString(service.price.class4, 3, '.') : '-'}</td>
                <td className='p-2 text-end'>{service.price.class5 ? splitString(service.price.class5, 3, '.') : '-'}</td>
                <td className='p-2'>{service.note ? service.note : '-'}</td>
                <td className='p-2'>
                  <div className='flex justify-center gap-4'>
                    <Button
                      label='Ubah'
                      onClick={() => navigate(`/service/form/update?_id=${service._id}`)}
                      color='yellow'
                    />
                    <Button
                      label='Hapus'
                      onClick={() => navigate(`/service/form/delete?_id=${service._id}`)}
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
