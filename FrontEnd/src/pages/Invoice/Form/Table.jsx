import { useEffect } from 'react';

import { Button, Select } from '../../../components';
import { splitString } from '../../../functions';



const TableInput = ({
  className,
  value,
  onChange,
  disabled
}) => {
  return (
    <input
      className={`h-full w-full bg-transparent p-1 border border-neutral-300 focus:bg-neutral-300 focus:outline-none ${className}`}
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
    />
  );
};

const TableSelect = ({
  className,
  options,
  value,
  onChange,
  disabled
}) => {
  return (
    <select
    className={`h-full w-full bg-transparent p-1 border border-neutral-300 hover:cursor-pointer focus:bg-neutral-300 focus:outline-none ${className}`}
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
    >
      {options?.map((option, index) => <option key={index} value={option[0]}>{option[1]}</option>)}
    </select>
  );
};

const LabelInput = ({
  className,
  value,
  onChange,
  disabled
}) => {
  return (
    <input
      className={`col-start-7 col-span-2 h-full w-full bg-transparent p-1 font-bold focus:outline focus:outline-1 focus:outline-neutral-900 ${className}`}
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
    />
  );
};



export default function Table({
  services,
  setServices,
  setPriceShow,
  setPaidShow,
  priceShow,
  paidShow,
  tableLabels,
  setTableLabels,
  disabled,
  totalPriceErr,
  setTotalPriceErr,
  totalPrice,
  setTotalPrice,
  totalPaidErr,
  setTotalPaidErr,
  totalPaid,
  setTotalPaid,
  calculated,
  setCalculated
}) {
  useEffect(() => {
    let totalPriceOfService = 0;
    let totalPriceOfNote = 0;
    let newTotalPaid = 0;

    services.forEach(service => service.subServices.forEach(subService => {
      if (
        /^[0-9]+$/.test(subService.price.trim()) &&
        (subService.type === 'SERVICE')
      ) totalPriceOfService += parseInt(subService.price.trim());
      if (
        /^[0-9]+$/.test(subService.price.trim()) &&
        (subService.type === 'NOTE')
      ) totalPriceOfNote += parseInt(subService.price.trim());
      if (/^[0-9]+$/.test(subService.paid.trim())) newTotalPaid += parseInt(subService.paid.trim());
    }));

    setTotalPrice(totalPriceOfService.toString());
    setTotalPaid(newTotalPaid.toString());
    setCalculated(((totalPriceOfService + totalPriceOfNote) - newTotalPaid).toString());
  }, [services]);

  useEffect(() => {
    let sumOfItemTotalPrice = 0;
    let sumOfItemTotalPaid = 0;

    services.forEach(service => service.subServices.forEach(subService => {
      if (/^[0-9]+$/.test(subService.price.trim())) sumOfItemTotalPrice += parseInt(subService.price.trim());
      if (/^[0-9]+$/.test(subService.paid.trim())) sumOfItemTotalPaid += parseInt(subService.paid.trim());
    }));

    if (!/^[0-9]+$/.test(totalPrice.trim())) setTotalPriceErr(`${tableLabels.totalPrice} tidak valid karena mengandung karakter yang bukan angka.`);
    else if (parseInt(totalPrice.trim()) < sumOfItemTotalPrice) setTotalPriceErr(`${tableLabels.totalPrice} tidak valid karena kurang dari total ${tableLabels.col3} per item (${sumOfItemTotalPrice}).`);
    else setTotalPriceErr('');

    if (!/^[0-9]+$/.test(totalPaid.trim())) setTotalPaidErr(`${tableLabels.totalPaid} tidak valid karena mengandung karakter yang bukan angka.`);
    else if (parseInt(totalPaid.trim()) < sumOfItemTotalPaid) setTotalPaidErr(`${tableLabels.totalPaid} tidak valid karena kurang dari total ${tableLabels.paid} per item (${sumOfItemTotalPaid}).`);
    else setTotalPaidErr('');

    if (/^[0-9]+$/.test(totalPrice.trim()) && /^[0-9]+$/.test(totalPaid.trim())) setCalculated(parseInt(totalPrice) - parseInt(totalPaid));
    if (/^[0-9]+$/.test(totalPrice.trim()) && !/^[0-9]+$/.test(totalPaid.trim())) setCalculated(parseInt(totalPrice) - 0);
    if (!/^[0-9]+$/.test(totalPrice.trim()) && /^[0-9]+$/.test(totalPaid.trim())) setCalculated(0 - parseInt(totalPaid));
  }, [totalPrice, totalPaid, tableLabels]);



  function handleCopyTextOnClick(value) {
    const textArea = document.createElement('textarea');
    textArea.value = `${value} `;

    document.body.appendChild(textArea);

    textArea.select();
    document.execCommand('copy');

    document.body.removeChild(textArea);
  }

  function handleServiceOnChange(index, newValue) {
    let newServices = [...services];

    newServices[index] = newValue;

    newServices = [
      ...newServices.filter(service => service.no || (service.subServices.length > 1)),
      {
        no: '',
        subServices: [{
          type: newServices.slice(-1)[0].subServices.slice(-1)[0].type,
          name: '',
          price: '',
          paid: '',
          note: ''
        }]
      }
    ];

    setServices(newServices);
  }

  function handleSubServiceOnChange(index, subIndex, newValue) {
    let newSubServices = [...services[index].subServices];
    
    newSubServices[subIndex] = newValue;

    newSubServices = [
      ...newSubServices.filter(subService => subService.name || subService.price || subService.paid || subService.note),
      {
        type: newSubServices.slice(-1)[0].type,
        name: '',
        price: '',
        paid: '',
        note: ''
      }
    ];
    
    const newService = {
      no: services[index].no,
      subServices: newSubServices
    };

    handleServiceOnChange(index, newService);
  }



  return (
    <section>
      <div className='grid grid-cols-12 grid-rows-2'>
        <div className='col-start-2 col-span-2 row-start-2 flex gap-1'>
          <Button
            className='w-8'
            label='●'
            onClick={() => handleCopyTextOnClick('•')}
          />
          <Button
            className='w-8'
            label='*'
            onClick={() => handleCopyTextOnClick('*')}
          />
          <Button
            className='w-8'
            label='-'
            onClick={() => handleCopyTextOnClick('-')}
          />
        </div>

        <div className='col-start-7 col-span-4 row-span-2 flex flex-col gap-1 justify-center'>
          <Select
            options={[
              ['all', `Gunakan ${tableLabels.col3} per item dan ${tableLabels.totalPrice}`],
              ['item', `Gunakan ${tableLabels.col3} per item`],
              ['total', `Gunakan ${tableLabels.totalPrice}`]
            ]}
            value={priceShow}
            onChange={setPriceShow}
          />
          <Select
            options={[
              ['all', `Gunakan ${tableLabels.paid} per item dan ${tableLabels.totalPaid}`],
              ['item', `Gunakan ${tableLabels.paid} per item`],
              ['total', `Gunakan ${tableLabels.totalPaid}`]
            ]}
            value={paidShow}
            onChange={setPaidShow}
          />
        </div>
      </div>



      <div className='mt-2 border-x border-neutral-900'>
        <div className='grid grid-cols-12 border-y border-neutral-900'>
          <TableInput
            className='col-span-1 text-center'
            value={tableLabels.col1}
            onChange={value => setTableLabels({...tableLabels, col1: value})}
            disabled={disabled}
          />
          <TableInput
            className='col-span-7 text-center'
            value={tableLabels.col2}
            onChange={value => setTableLabels({...tableLabels, col2: value})}
            disabled={disabled}
          />
          <TableInput
            className='col-span-2 text-center'
            value={tableLabels.col3}
            onChange={value => setTableLabels({...tableLabels, col3: value})}
            disabled={disabled}
          />
          <TableInput
            className='col-span-2 text-center'
            value={tableLabels.col4}
            onChange={value => setTableLabels({...tableLabels, col4: value})}
            disabled={disabled}
          />
        </div>



        {services.map((service, index) => (
          <div key={index} className={`grid grid-cols-12 ${index ? 'border-t border-neutral-900 border-dashed' : ''}`}>
            <TableInput
              className='col-span-1 text-center'
              value={service.no}
              onChange={value => handleServiceOnChange(index, {...service, no: value})}
              disabled={disabled}
            />
            <div className='col-span-11'>
              {service.subServices.map((subService, subIndex) => (
                <div key={subIndex} className={`grid grid-cols-11 grid-rows-${(paidShow === 'total' ? '1' : '2')}`}>
                  <TableSelect
                    className='row-span-1 col-span-2'
                    options={[['SERVICE', 'Pekerjaan'], ['NOTE', 'Nota']]}
                    value={subService.type}
                    onChange={value => handleSubServiceOnChange(index, subIndex, {...subService, type: value})}
                    disabled={disabled}
                  />
                  <TableInput
                    className='row-span-1 col-span-5'
                    value={subService.name}
                    onChange={value => handleSubServiceOnChange(index, subIndex, {...subService, name: value})}
                    disabled={disabled}
                  />
                  <TableInput
                    className='row-span-1 col-span-2 text-center'
                    value={subService.price}
                    onChange={value => handleSubServiceOnChange(index, subIndex, {...subService, price: value})}
                    disabled={disabled || (priceShow === 'total')}
                  />
                  <TableInput
                    className='row-span-2 col-span-2'
                    value={subService.note}
                    onChange={value => handleSubServiceOnChange(index, subIndex, {...subService, note: value})}
                    disabled={disabled}
                  />
                  {(paidShow !== 'total') && (
                    <>
                      <TableInput
                        className='col-start-6 row-span-1 col-span-2'
                        value={tableLabels.paid}
                        onChange={value => setTableLabels({...tableLabels, paid: value})}
                        disabled={disabled}
                      />
                      <TableInput
                        className='row-span-1 col-span-2 text-center'
                        value={subService.paid}
                        onChange={value => handleSubServiceOnChange(index, subIndex, {...subService, paid: value})}
                        disabled={disabled}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}



        <div className='grid grid-cols-12 border-y border-neutral-900'>
          <TableInput className='col-span-6 text-right text-red-500' value={totalPriceErr} disabled />
          <TableInput
            className='col-start-7 col-span-2'
            value={tableLabels.totalPrice}
            onChange={value => setTableLabels({...tableLabels, totalPrice: value})}
            disabled={disabled}
          />
          <TableInput
            className='col-span-2 text-center'
            value={totalPrice}
            onChange={setTotalPrice}
            disabled={disabled}
          />

          <TableInput className='col-span-6 text-right text-red-500' value={totalPaidErr} disabled />
          <TableInput
            className='col-span-2'
            value={tableLabels.totalPaid}
            onChange={value => setTableLabels({...tableLabels, totalPaid: value})}
            disabled={disabled}
          />
          <TableInput
            className='col-span-2 text-center'
            value={totalPaid}
            onChange={setTotalPaid}
            disabled={disabled}
          />
        </div>
      </div>



      <div className='grid grid-cols-12'>
        <LabelInput
          value={tableLabels.calculated}
          onChange={value => setTableLabels({...tableLabels, calculated: value})}
          disabled={disabled}
        />
        <div className='col-start-9 col-span-2 text-center p-1 font-bold underline'>Rp. {splitString(calculated, 3, '.')}</div>
      </div>
    </section>
  );
};
