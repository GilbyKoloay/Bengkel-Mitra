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
    let newTotalPrice = 0;
    let newTotalPaid = 0;

    services.forEach(service => {
      if (service.type === 'service') {
        if (/^[0-9]+$/.test(service.price.trim())) newTotalPrice += parseInt(service.price.trim());
        if (/^[0-9]+$/.test(service.paid.trim())) newTotalPaid += parseInt(service.paid.trim());
      }
    });

    setTotalPrice(newTotalPrice.toString());
    setTotalPaid(newTotalPaid.toString());
  }, [services]);

  useEffect(() => {
    let sumOfPricePerItem = 0;
    let sumOfPaidPerItem = 0;

    services.forEach(service => {
      if (service.type === 'service') {
        if (/^[0-9]+$/.test(service.price.trim())) sumOfPricePerItem += parseInt(service.price.trim());
        if (/^[0-9]+$/.test(service.paid.trim())) sumOfPaidPerItem += parseInt(service.paid.trim());
      }
    });
    
    if (!/^[0-9]+$/.test(totalPrice.trim())) setTotalPriceErr(`${tableLabels.totalPrice} tidak valid karena mengandung karakter yang bukan angka.`);
    else if (parseInt(totalPrice.trim()) < sumOfPricePerItem) setTotalPriceErr(`${tableLabels.totalPrice} tidak valid karena kurang dari total ${tableLabels.col3} per item (${sumOfPricePerItem}).`);
    else setTotalPriceErr('');

    if (!/^[0-9]+$/.test(totalPaid.trim())) setTotalPaidErr(`${tableLabels.totalPaid} tidak valid karena mengandung karakter yang bukan angka.`);
    else if (parseInt(totalPaid.trim()) < sumOfPaidPerItem) setTotalPaidErr(`${tableLabels.totalPaid} tidak valid karena kurang dari total ${tableLabels.paid} per item (${sumOfPaidPerItem}).`);
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
      ...newServices.filter(service => service.no || service.name || service.price || service.paid || service.note), {
      no: '',
      type: 'service',
      name: '',
      price: '',
      paid: '',
      note: ''
    }];

    setServices(newServices);
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
          <div key={index} className={`grid grid-cols-12 grid-rows-${(paidShow === 'total' ? '1' : '2')} ${index ? 'border-t border-neutral-900 border-dashed' : ''}`}>
            <TableInput
              className='row-span-2 col-span-1 text-center'
              value={service.no}
              onChange={value => handleServiceOnChange(index, {...service, no: value})}
              disabled={disabled}
            />
            <TableSelect
              className='row-span-1 col-span-2'
              options={[['service', 'Pekerjaan'], ['note', 'Nota']]}
              value={service.type}
              onChange={value => handleServiceOnChange(index, {...service, type: value})}
              disabled={disabled}
            />
            <TableInput
              className='row-span-1 col-span-5'
              value={service.name}
              onChange={value => handleServiceOnChange(index, {...service, name: value})}
              disabled={disabled}
            />
            <TableInput
              className='row-span-1 col-span-2 text-center'
              value={service.price}
              onChange={value => handleServiceOnChange(index, {...service, price: value})}
              disabled={disabled || (priceShow === 'total')}
            />
            <TableInput
              className='row-span-1 col-span-2'
              value={service.note}
              onChange={value => handleServiceOnChange(index, {...service, note: value})}
              disabled={disabled}
            />
            {(paidShow !== 'total') && (
              <>
                <TableInput
                  className='col-start-7 row-span-1 col-span-2'
                  value={tableLabels.paid}
                  onChange={value => setTableLabels({...tableLabels, paid: value})}
                  disabled={disabled}
                />
                <TableInput
                  className='row-span-1 col-span-2 text-center'
                  value={service.paid}
                  onChange={value => handleServiceOnChange(index, {...service, paid: value})}
                  disabled={disabled}
                />
              </>
            )}
          </div>
        ))}



        <div className='grid grid-cols-12 border-y border-neutral-900'>
          <TableInput className='col-span-6 text-right' value={totalPriceErr} disabled />
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

          <TableInput className='col-span-6 text-right' value={totalPaidErr} disabled />
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
