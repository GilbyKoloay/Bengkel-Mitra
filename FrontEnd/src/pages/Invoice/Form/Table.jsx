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
  services, setServices,
  priceType, setPriceType,
  paidType, setPaidType,
  noteType, setNoteType,
  tableLabels, setTableLabels,
  disabled,
  isTotalPriceShown, setIsTotalPriceShown,
  totalPriceErr, setTotalPriceErr,
  totalPrice, setTotalPrice,
  isTotalNoteShown, setIsTotalNoteShown,
  totalNoteErr, setTotalNoteErr,
  totalNote, setTotalNote,
  isTotalPaidShown, setIsTotalPaidShown,
  totalPaidErr, setTotalPaidErr,
  totalPaid, setTotalPaid,
  calculated, setCalculated
}) {
  useEffect(() => {
    const newValue = getServicesValue();
    console.log(services, newValue);

    setTotalPrice(newValue.price.toString());
    setTotalNote(newValue.note.toString());
    setTotalPaid(newValue.paid.toString());
    setCalculated((newValue.price + newValue.note) - newValue.paid);
  }, [services]);

  useEffect(() => {
    const value = getServicesValue();

    if (!/^[0-9]+$/.test(totalPrice.trim())) setTotalPriceErr(`${tableLabels.totalPrice} tidak valid karena mengandung karakter yang bukan angka.`);
    else if (parseInt(totalPrice.trim()) < value.price) setTotalPriceErr(`${tableLabels.totalPrice} tidak valid karena kurang dari total ${tableLabels.col3} pekerjaan per item (${value.price}).`);
    else setTotalPriceErr('');
    
    if (!/^[0-9]+$/.test(totalNote.trim())) setTotalNoteErr(`${tableLabels.totalNote} tidak valid karena mengandung karakter yang bukan angka.`);
    else if (parseInt(totalNote.trim()) < value.note) setTotalNoteErr(`${tableLabels.totalNote} tidak valid karena kurang dari total ${tableLabels.col3} nota per item (${value.note}).`);
    else setTotalNoteErr('');
    
    if (!/^[0-9]+$/.test(totalPaid.trim())) setTotalPaidErr(`${tableLabels.totalPaid} tidak valid karena mengandung karakter yang bukan angka.`);
    else if (parseInt(totalPaid.trim()) < value.paid) setTotalPaidErr(`${tableLabels.totalPaid} tidak valid karena kurang dari total ${tableLabels.paid} pekerjaan per item (${value.paid}).`);
    else setTotalPaidErr('');

    let newTotalPrice = 0;
    let newTotalNote = 0;
    let newTotalPaid = 0;

    if (/^[0-9]+$/.test(totalPrice.trim())) newTotalPrice = parseInt(totalPrice.trim());
    if (/^[0-9]+$/.test(totalNote.trim())) newTotalNote = parseInt(totalNote.trim());
    if (/^[0-9]+$/.test(totalPaid.trim())) newTotalPaid = parseInt(totalPaid.trim());

    setCalculated((newTotalPrice + newTotalNote) - newTotalPaid);
  }, [totalPrice, totalNote, totalPaid, tableLabels]);



  function handleCopyTextOnClick(value) {
    const textArea = document.createElement('textarea');
    textArea.value = `${value} `;

    document.body.appendChild(textArea);

    textArea.select();
    document.execCommand('copy');

    document.body.removeChild(textArea);
  }

  function handlePriceTypeOnChange(value) {
    const newServices = services.map(service => ({
      ...service,
      price: '',
      subServices: service.subServices.map(subService => ({
        ...subService,
        price: ''
      }))
    }));

    if (value === 'NUMBER') setPaidType('NUMBER');
    
    setServices(newServices);
    setPriceType(value);
  }

  function handlePaidTypeOnChange(value) {
    const newServices = services.map(service => ({
      ...service,
      paid: '',
      subServices: service.subServices.map(subService => ({
        ...subService,
        paid: ''
      }))
    }));

    setServices(newServices);
    setPaidType(value);
  }

  function handleNoteTypeOnChange(value) {
    const newServices = services.map(service => ({
      ...service,
      note: '',
      subServices: service.subServices.map(subService => ({
        ...subService,
        note: ''
      }))
    }));

    setServices(newServices);
    setNoteType(value);
  }

  function handleServiceOnChange(index, newValue) {
    let newServices = [...services];

    newServices[index] = newValue;

    setServices(newServices);
  }

  function handleSubServiceOnChange(index, subIndex, newValue) {
    let newSubServices = [...services[index].subServices];

    newSubServices[subIndex] = newValue;

    const newService = {
      ...services[index],
      subServices: newSubServices
    };

    handleServiceOnChange(index, newService);
  }

  function getServicesValue() {
    let price = 0;
    let note = 0;
    let paid = 0;

    services.forEach(service => {
      if ((priceType === 'NUMBER') && /^[0-9]+$/.test(service.price.trim())) price += parseInt(service.price.trim());
      if ((paidType === 'NUMBER') && /^[0-9]+$/.test(service.paid.trim())) paid += parseInt(service.paid.trim());

      service.subServices.forEach(subService => {
        if ((priceType === 'ITEM') && (subService.type === 'SERVICE') && (/^[0-9]+$/.test(subService.price.trim()))) price += parseInt(subService.price.trim());
        if ((priceType === 'ITEM') && (subService.type === 'NOTE') && (/^[0-9]+$/.test(subService.price.trim()))) note += parseInt(subService.price.trim());
        if ((paidType === 'ITEM') && (/^[0-9]+$/.test(subService.paid.trim()))) paid += parseInt(subService.paid.trim());
      });
    });

    return {price, note, paid};
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

        <div className='col-start-7 col-span-3 row-span-2 flex flex-col gap-1 justify-center'>
          <Select
            options={[
              ['ITEM', `Gunakan ${tableLabels.col3} per item`],
              // ['NUMBER', `Gunakan ${tableLabels.col3} per nomor`],
              ['NULL', `Jangan gunakan ${tableLabels.col3}`]
            ]}
            value={priceType}
            onChange={handlePriceTypeOnChange}
          />
          <Select
            options={[
              ...(priceType !== 'NUMBER') ? [['ITEM', `Gunakan ${tableLabels.paid} per item`]] : [],
              ['NUMBER', `Gunakan ${tableLabels.paid} per nomor`],
              ['NULL', `Jangan gunakan ${tableLabels.paid}`]
            ]}
            value={paidType}
            onChange={handlePaidTypeOnChange}
          />
          <Select
            options={[
              ['ITEM', `Gunakan ${tableLabels.col4} per item`],
              ['NUMBER', `Gunakan ${tableLabels.col4} per nomor`],
              ['NULL', `Jangan gunakan ${tableLabels.col4}`]
            ]}
            value={noteType}
            onChange={handleNoteTypeOnChange}
          />
        </div>

        <div className='col-start-10 col-span-3 row-span-2 flex flex-col gap-1 justify-center'>
          <Select
            options={[
              [true, `Gunakan ${tableLabels.totalPrice}`],
              [false, `Jangan gunakan ${tableLabels.totalPrice}`]
            ]}
            value={isTotalPriceShown}
            onChange={value => setIsTotalPriceShown(JSON.parse(value))}
          />
          <Select
            options={[
              [true, `Gunakan ${tableLabels.totalNote}`],
              [false, `Jangan gunakan ${tableLabels.totalNote}`]
            ]}
            value={isTotalNoteShown}
            onChange={value => setIsTotalNoteShown(JSON.parse(value))}
          />
          <Select
            options={[
              [true, `Gunakan ${tableLabels.totalPaid}`],
              [false, `Jangan gunakan ${tableLabels.totalPaid}`]
            ]}
            value={isTotalPaidShown}
            onChange={value => setIsTotalPaidShown(JSON.parse(value))}
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
            <div className='col-span-1 grid grid-cols-3'>
              <Button
                className='col-span-1'
                label='-'
                onClick={() => setServices(services.filter((_, thisIndex) => thisIndex !== index))}
                theme='red'
              />
              <TableInput
                className='col-span-2 text-center'
                value={service.no}
                onChange={value => handleServiceOnChange(index, {...service, no: value})}
                disabled={disabled}
              />
            </div>

            <div className='col-span-7'>
              {service.subServices.map((subService, subIndex) => (
                <div key={subIndex} className={`grid grid-cols-7 grid-rows-${(paidType === 'ITEM') ? '2' : '1'}`}>
                  <div className='col-span-2 row-span-full grid grid-cols-5'>
                    <Button
                      className='col-span-1'
                      label='-'
                      onClick={() => setServices(services.map((thisService, thisIndex) => (thisIndex !== index) ? thisService : ({...thisService, subServices: thisService.subServices.filter((_, thisSubIndex) => thisSubIndex !== subIndex)})))}
                      theme='red'
                    />
                    <TableSelect
                      className='col-span-4'
                      options={[['SERVICE', 'Pekerjaan'], ['NOTE', 'Nota']]}
                      value={subService.type}
                      onChange={value => handleSubServiceOnChange(index, subIndex, {...subService, type: value})}
                      disabled={disabled}
                    />
                  </div>
                  <TableInput
                    className='col-span-5'
                    value={subService.name}
                    onChange={value => handleSubServiceOnChange(index, subIndex, {...subService, name: value})}
                    disabled={disabled}
                  />
                  {(paidType === 'ITEM') && (
                    <TableInput
                      className='col-start-6 col-span-2'
                      value={tableLabels.paid}
                      onChange={value => setTableLabels({...tableLabels, paid: value})}
                      disabled={disabled}
                    />
                  )}
                </div>
              ))}
              <div className='grid grid-cols-7'>
                <div className='col-span-2 grid grid-cols-5'>
                  <Button
                    className='col-span-1'
                    label='+'
                    onClick={() => setServices(services.map((thisService, thisIndex) => (thisIndex !== index) ? thisService : ({...thisService, subServices: [...thisService.subServices, {
                      type: 'SERVICE',
                      name: '',
                      price: '',
                      paid: '',
                      note: ''
                    }]})))}
                    theme='blue'
                  />
                </div>
              </div>
              {(paidType === 'NUMBER') && (
                <div className='grid grid-cols-7'>
                  <TableInput
                    className='col-start-6 col-span-2'
                    value={tableLabels.paid}
                    onChange={value => setTableLabels({...tableLabels, paid: value})}
                    disabled={disabled}
                  />
                </div>
              )}
            </div>

            <div className='col-span-2 flex flex-col'>
              <div className='flex-1'>
                {(priceType === 'NUMBER') ? (
                  <TableInput
                    className='text-center'
                    value={service.price}
                    onChange={value => handleServiceOnChange(index, {...service, price: value})}
                    disabled={disabled}
                  />
                ) : service.subServices.map((subService, subIndex) => (
                    <div key={subIndex}>
                      <TableInput
                        className='text-center'
                        value={subService.price}
                        onChange={value => handleSubServiceOnChange(index, subIndex, {...subService, price: value})}
                        disabled={disabled || (priceType !== 'ITEM')}
                      />
                      {(paidType === 'ITEM') && (
                        <TableInput
                        className='text-center'
                        value={subService.paid}
                        onChange={value => handleSubServiceOnChange(index, subIndex, {...subService, paid: value})}
                        disabled={disabled}
                      />
                    )}
                  </div>
                ))}
              </div>

              {(paidType === 'NUMBER') && (
                <div>
                  <TableInput
                    className='text-center'
                    value={service.paid}
                    onChange={value => handleServiceOnChange(index, {...service, paid: value})}
                    disabled={disabled}
                  />
                </div>
              )}
            </div>

            <div className='col-span-2'>
              {(noteType === 'ITEM') && service.subServices.map((subService, subIndex) => (
                <div key={subIndex} className='grid grid-cols-12 grid-rows-2'>
                  <TableInput
                    className={`row-span-full border-r-transparent ${(paidType === 'ITEM') ? 'col-span-11' : 'col-span-12'}`}
                    value={subService.note}
                    onChange={value => handleSubServiceOnChange(index, subIndex, {...subService, note: value})}
                    disabled={disabled}
                  />
                  {(paidType === 'ITEM') && (
                    <>
                      <TableInput className='col-start-12 row-start-1 border-l-transparent border-b-transparent' onChange={() => {}} disabled />
                      <TableInput className='col-start-12 row-start-2 border-l-transparent border-t-transparent' onChange={() => {}} disabled />
                    </>
                  )}
                </div>
              ))}
              {(noteType === 'NUMBER') && (
                <TableInput
                  value={service.note}
                  onChange={value => handleServiceOnChange(index, {...service, note: value})}
                  disabled={disabled}
                />
              )}
            </div>
          </div>
        ))}
        <div className='grid grid-cols-12 border-t border-dashed border-neutral-900'>
          <Button
            className='col-span-1'
            label='+'
            onClick={() => setServices([...services, {
              no: '',
              price: '',
              paid: '',
              note: '',
              subServices: [{
                type: 'SERVICE',
                name: '',
                price: '',
                paid: '',
                note: ''
              }]
            }])}
            theme='blue'
          />
        </div>



        <div className='grid grid-cols-12 border-y border-neutral-900'>
          {isTotalPriceShown && (
            <>
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
            </>
          )}

          {isTotalNoteShown && (
            <>
              <TableInput className='col-span-6 text-right text-red-500' value={totalNoteErr} disabled />
              <TableInput
                className='col-start-7 col-span-2'
                value={tableLabels.totalNote}
                onChange={value => setTableLabels({...tableLabels, totalNote: value})}
                disabled={disabled}
              />
              <TableInput
                className='col-span-2 text-center'
                value={totalNote}
                onChange={setTotalNote}
                disabled={disabled}
              />
            </>
          )}

          {isTotalPaidShown && (
            <>
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
            </>
          )}
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
