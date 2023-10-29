import { useEffect } from 'react';

import { Button, Select, Input } from '../../../components';
import { splitString, notificationToast } from '../../../functions';



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
  totalPrice,
  setTotalPrice,
  totalPaid,
  setTotalPaid,
  calculated,
  setCalculated
}) {
  useEffect(() => {
    // calculate total paid
    let newTotalPaid = 0;
    services.forEach(service => service.subServices.forEach(subService => {
      if (/^[0-9]+$/.test(subService.paid.trim())) newTotalPaid += parseInt(subService.paid.trim());
    }));
    setTotalPaid(newTotalPaid.toString());

    // calculate total price
    let newTotalPrice = 0;
    services.forEach(service => service.subServices.forEach(subService => {
      if (/^[0-9]+$/.test(subService.price.trim())) newTotalPrice += parseInt(subService.price.trim());
    }));
    setTotalPrice(newTotalPrice.toString());

    // calculate calculated
    calculateCalculated(newTotalPrice, newTotalPaid);
  }, [services]);



  function handleCopyTextOnClick(value) {
    const textArea = document.createElement('textarea');
    textArea.value = `${value} `;

    document.body.appendChild(textArea);

    textArea.select();
    document.execCommand('copy');

    document.body.removeChild(textArea);
  }

  function handlePriceShowOnChange(value) {
    if (value === 'total') {
      const newServices = services.map(service => ({
        ...service,
        subServices: service.subServices.map(subService => ({
          ...subService,
          price: ''
        }))
      }));

      setServices(newServices);
    }

    setPriceShow(value);
  }

  function handlePaidShowOnChange(value) {
    if (value === 'total') {
      const newServices = services.map(service => ({
        ...service,
        subServices: service.subServices.map(subService => ({
          ...subService,
          paid: ''
        }))
      }));
      
      setServices(newServices);
    }

    setPaidShow(value);
  }

  function handleServiceOnChange(index, newValue) {
    let newServices = [...services];
    newServices[index] = newValue;
    newServices = [...newServices.filter(service => service.no || (service.subServices.length > 1)), {
      no: '',
      subServices: [{
        name: '',
        price: '',
        paid: '',
        note: ''
      }]}
    ];

    setServices(newServices);
  }

  function handleSubServiceOnChange(index, service, subIndex, newValue) {
    let newSubServices = [...services[index].subServices];
    newSubServices[subIndex] = newValue;
    newSubServices = [...newSubServices.filter(subService => subService.name || subService.price || subService.paid || subService.note), {
      name: '',
      price: '',
      paid: '',
      note: ''
    }];
    
    handleServiceOnChange(index, {...service,subServices: newSubServices});
  }

  function handleTotalPriceOnChange(newValue) {
    setTotalPrice(newValue);

    // invalid value
    if (!/^[0-9]+$/.test(newValue.trim())) notificationToast('Peringatan', `${tableLabels.totalPrice} tidak mengandung angka saja.`, 'warning');

    // value is less than sum of all price per item
    let sumOfPricePerItem = 0;
    services.forEach(service => service.subServices.forEach(subService => {
      if (!isNaN(parseInt(subService.price.trim()))) sumOfPricePerItem += parseInt(subService.price.trim());
    }));
    if ((parseInt(newValue.trim()) < sumOfPricePerItem)) notificationToast('Peringatan', `${tableLabels.totalPrice} kurang dari total ${tableLabels.col3} per item.`, 'warning');
    
    calculateCalculated(parseInt(newValue.trim()), totalPaid);
  }

  function handleTotalPaidOnChange(newValue) {
    setTotalPaid(newValue);

    // invalid value
    if (!/^[0-9]+$/.test(newValue.trim())) notificationToast('Peringatan', `${tableLabels.totalPaid} tidak mengandung angka saja.`, 'warning');

    // value is less than sum of all paid per item
    let sumOfPaidPerItem = 0;
    services.forEach(service => service.subServices.forEach(subService => {
      if (!isNaN(parseInt(subService.paid.trim()))) sumOfPaidPerItem += parseInt(subService.paid.trim());
    }));
    if ((parseInt(newValue.trim()) < sumOfPaidPerItem)) notificationToast('Peringatan', `${tableLabels.totalPaid} kurang dari total ${tableLabels.paid} per item.`, 'warning');

    calculateCalculated(totalPrice, parseInt(newValue.trim()));
  }

  function calculateCalculated(thisTotalPrice, thisTotalPaid) {
    if (
      !isNaN(thisTotalPrice) &&
      !isNaN(thisTotalPaid)
    ) setCalculated(thisTotalPrice - thisTotalPaid);
    
    if (isNaN(thisTotalPrice)) setCalculated(0 - thisTotalPaid);
    else if (isNaN(thisTotalPaid)) setCalculated(thisTotalPrice - 0);
  }



  return (
    <section>
      <div className='border-2 border-transparent'>
        <div className='flex flex-row'>
          <div className='w-1/12 p-1 flex justify-center'>
            <div />
          </div>
          <div className='w-11/12 flex flex-row'>
            <div className='w-6/12 flex items-center gap-1'>
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
            <div className='w-3/12 p-1 flex flex-col gap-1'>
              <Select
                options={[
                  ['all', `Gunakan ${tableLabels.col3} per item dan ${tableLabels.totalPrice}`],
                  ['item', `Gunakan ${tableLabels.col3} per item`],
                  ['total', `Gunakan ${tableLabels.totalPrice}`]
                ]}
                value={priceShow}
                onChange={handlePriceShowOnChange}
              />
              <Select
                options={[
                  ['all', `Gunakan ${tableLabels.paid} per item dan ${tableLabels.totalPaid}`],
                  ['item', `Gunakan ${tableLabels.paid} per item`],
                  ['total', `Gunakan ${tableLabels.totalPaid}`]
                ]}
                value={paidShow}
                onChange={handlePaidShowOnChange}
              />
            </div>
            <div className='w-3/12 p-1 flex justify-center'>
              <div />
            </div>
          </div>
        </div>
      </div>

      <div className='border-2 border-neutral-900'>
        <div className='flex flex-row border-b-2 border-neutral-900'>
          <div className='w-1/12 p-1 flex justify-center'>
            <Input
              value={tableLabels.col1}
              onChange={value => setTableLabels({...tableLabels, col1: value})}
              disabled={disabled}
            />
          </div>
          <div className='w-11/12 flex flex-row'>
            <div className='w-6/12 p-1 flex justify-center border-l border-neutral-900'>
              <Input
                value={tableLabels.col2}
                onChange={value => setTableLabels({...tableLabels, col2: value})}
                disabled={disabled}
              />
            </div>
            <div className='w-3/12 p-1 flex justify-center border-x border-neutral-900'>
              <Input
                value={tableLabels.col3}
                onChange={value => setTableLabels({...tableLabels, col3: value})}
                disabled={disabled}
              />
            </div>
            <div className='w-3/12 p-1 flex justify-center'>
              <Input
                value={tableLabels.col4}
                onChange={value => setTableLabels({...tableLabels, col4: value})}
                disabled={disabled}
              />
            </div>
          </div>
        </div>

        {services.map((service, index) => (
          <div key={index} className={`flex flex-row ${index ? 'border-t border-neutral-900 border-dashed' : ''}`}>
            <div className='w-1/12 p-1'>
              <Input
                value={service.no}
                onChange={value => handleServiceOnChange(index, {...service, no: value})}
                disabled={disabled}
              />
            </div>
            <div className='w-11/12 flex flex-col'>
              {service.subServices.map((subService, subIndex) => (
                <div key={subIndex} className='flex'>
                  <div className='w-6/12 p-1 flex flex-col border-l border-neutral-900'>
                    <div className='h-10 flex items-center'>
                      <Input
                        value={subService.name}
                        onChange={value => handleSubServiceOnChange(index, service, subIndex, {...subService, name: value})}
                        disabled={disabled}
                      />
                    </div>
                    {(paidShow !== 'total') && (
                      <div className='h-10 flex justify-end items-center'>
                        <Input
                          value={tableLabels.paid}
                          onChange={value => setTableLabels({...tableLabels, paid: value})}
                          disabled={disabled}
                        />
                      </div>
                    )}
                  </div>
                  <div className='w-3/12 p-1 flex flex-col border-x border-neutral-900'>
                    <div className='h-10 flex items-center'>
                      {(priceShow !== 'total') && (
                        <Input
                          value={subService.price}
                          onChange={value => handleSubServiceOnChange(index, service, subIndex, {...subService, price: value})}
                          disabled={disabled}
                        />
                      )}
                    </div>
                    {(paidShow !== 'total') && (
                      <div className='h-10 flex items-center'>
                        <Input
                          value={subService.paid}
                          onChange={value => handleSubServiceOnChange(index, service, subIndex, {...subService, paid: value})}
                          disabled={disabled}
                        />
                      </div>
                    )}
                  </div>
                  <div className='w-3/12 p-1'>
                    <Input
                      value={subService.note}
                      onChange={value => handleSubServiceOnChange(index, service, subIndex, {...subService, note: value})}
                      disabled={disabled}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className='flex flex-row border-t-2 border-neutral-900'>
          <div className='w-1/12 p-1 flex justify-center'>
            <div />
          </div>
          <div className='w-11/12 flex flex-row'>
            <div className='w-6/12 p-1 flex justify-center items-center border-l border-neutral-900'>
              <Input
                value={tableLabels.totalPrice}
                onChange={value => setTableLabels({...tableLabels, totalPrice: value})}
                disabled={disabled}
              />
            </div>
            <div className='w-3/12 p-1 flex justify-center border-x border-neutral-900'>
              <Input
                value={totalPrice}
                onChange={handleTotalPriceOnChange}
                disabled={disabled || (priceShow === 'item')}
              />
            </div>
            <div className='w-3/12 p-1 flex justify-center'>
              <div />
            </div>
          </div>
        </div>

        <div className='flex flex-row'>
          <div className='w-1/12 p-1 flex justify-center'>
            <div />
          </div>
          <div className='w-11/12 flex flex-row'>
            <div className='w-6/12 p-1 flex justify-center items-center border-l border-neutral-900'>
              <Input
                value={tableLabels.totalPaid}
                onChange={value => setTableLabels({...tableLabels, totalPaid: value})}
                disabled={disabled}
              />
            </div>
            <div className='w-3/12 p-1 flex justify-center border-x border-neutral-900'>
              <Input
                value={totalPaid}
                onChange={handleTotalPaidOnChange}
                disabled={disabled || (paidShow === 'item')}
              />
            </div>
            <div className='w-3/12 p-1 flex justify-center'>
              <div />
            </div>
          </div>
        </div>
      </div>

      <div className='border-2 border-transparent'>
        <div className='flex flex-row'>
          <div className='w-1/12 p-1 flex justify-center'>
            <div />
          </div>
          <div className='w-11/12 flex flex-row items-center'>
            <div className='w-6/12 flex justify-end'>
              <div className='w-1/2 p-1 flex justify-center'>
                <Input
                  className='font-bold'
                  value={tableLabels.calculated}
                  onChange={value => setTableLabels({...tableLabels, calculated: value})}
                  disabled={disabled}
                />
              </div>
            </div>
            <div className='w-3/12 p-1 flex justify-center'>
              <div className='font-bold underline'>Rp. {splitString(calculated, 3, '.')}</div>
            </div>
            <div className='w-3/12 p-1 flex justify-center'>
              <div />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
