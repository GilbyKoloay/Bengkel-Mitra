export default function InputDateTime({
  className='',
  useDate=true,
  useTime=true,
  label='',
  value='',
  onChange=null,
  disabled=false,
  size='sm',
  theme='neutral',
  errMsg=''
}) {
  const inputClassName = `text-center focus:outline-none placeholder:text-neutral-500
    ${(size === 'sm') ? 'py-1 px-1' :
      (size === 'md') ? 'py-1 px-2' :
      (size === 'lg') ? 'py-2 px-2' : ''
    }
    ${disabled ? 'bg-neutral-500 hover:cursor-not-allowed' : `
      bg-transparent border border-transparent rounded
      ${(theme === 'neutral') ? 'focus:border-neutral-700' : ''}
      ${(theme === 'primary') ? 'focus:border-tertiary' : ''}
    `}
  `;



  function toProperReturnValue(dateTime, newValue) {
    const year = value.split('T')[0].split('-')[0];
    const month = value.split('T')[0].split('-')[1];
    const day = value.split('T')[0].split('-')[2];
    const hour = value.split('T')[1].split(':')[0];
    const minute = value.split('T')[1].split(':')[1];

    if (dateTime === 'year') return `${newValue.slice(0, 4)}-${month}-${day}T${hour}:${minute}:00.000Z`;
    if (dateTime === 'month') return `${year}-${newValue.slice(0, 2)}-${day}T${hour}:${minute}:00.000Z`;
    if (dateTime === 'day') return `${year}-${month}-${newValue.slice(0, 2)}T${hour}:${minute}:00.000Z`;
    if (dateTime === 'hour') return `${year}-${month}-${day}T${newValue.slice(0, 2)}:${minute}:00.000Z`;
    if (dateTime === 'minute') return `${year}-${month}-${day}T${hour}:${newValue.slice(0, 2)}:00.000Z`;
  }



  return (
    <div
      className={`flex flex-col
        ${className}
      `}
    >
      {label && (
        <label
          className={
            (size === 'sm') ? 'text-base' :
            (size === 'md') ? 'text-lg' :
            (size === 'lg') ? 'text-xl' : ''
          }
        >
          {label}
        </label>
      )}
      <div className={`flex w-full border-2
        ${(size === 'sm') ? 'text-sm' :
          (size === 'md') ? 'text-base' :
          (size === 'lg') ? 'text-lg' : ''
        }
        ${disabled ? 'border-neutral-700 rounded' : (
          (theme === 'neutral') ? 'bg-neutral-300 border-neutral-700 rounded' : ''
        )}
      `}>
        {useDate && (
          <div className='grid grid-cols-12'>
            <input
              className={`${inputClassName} col-span-3`}
              value={value.split('T')[0].split('-')[2]}
              onChange={e => onChange(toProperReturnValue('day', e.target.value))}
              placeholder='Tgl'
              disabled={disabled}
            />
            <input className={`${inputClassName} col-span-1`} value='-' disabled />
            <input
              className={`${inputClassName} col-span-3`}
              value={value.split('T')[0].split('-')[1]}
              onChange={e => onChange(toProperReturnValue('month', e.target.value))}
              placeholder='Bln'
              disabled={disabled}
            />
            <input className={`${inputClassName} col-span-1`} value='-' disabled />
            <input
              className={`${inputClassName} col-span-4`}
              value={value.split('T')[0].split('-')[0]}
              onChange={e => onChange(toProperReturnValue('year', e.target.value))}
              placeholder='Thn'
              disabled={disabled}
            />
          </div>
        )}
        {(useDate && useTime) && (
          <div className={`border-x
            ${(theme === 'neutral') ? 'border-neutral-700' :
              (theme === 'primary') ? 'border-tertiary' : ''}
          `} />
        )}
        {useTime && (
          <div className='grid grid-cols-7'>
            <input
              className={`${inputClassName} col-span-3`}
              value={value.split('T')[1].split(':')[0]}
              onChange={e => onChange(toProperReturnValue('hour', e.target.value))}
              placeholder='Jam'
              disabled={disabled}
            />
            <input className={`${inputClassName} col-span-1`} value=':' disabled />
            <input
              className={`${inputClassName} col-span-3`}
              value={value.split('T')[1].split(':')[1]}
              onChange={e => onChange(toProperReturnValue('minute', e.target.value))}
              placeholder='Mnt'
              disabled={disabled}
            />
          </div>
        )}
      </div>
      {errMsg && <label className='text-red-500'>{errMsg}</label>}
    </div>
  );
};
