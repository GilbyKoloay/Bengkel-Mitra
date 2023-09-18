function insertValueToDateTime(currentValue, type, newValue) {
  let dateTime = currentValue;
  if (!dateTime.replaceAll(' ', '')) dateTime = '--T::00.000Z';
  dateTime = [dateTime.split('T')[0].split(['-'])[0], dateTime.split('T')[0].split(['-'])[1], dateTime.split('T')[0].split(['-'])[2], dateTime.split('T')[1].split([':'])[0], dateTime.split('T')[1].split([':'])[1], dateTime.split('T')[1].split([':'])[2]];

  ['month', 'day', 'hour', 'minute'].forEach((thisType, index) => {
    if (type === thisType) {
      if (newValue.length > 2) dateTime[index+1] = newValue.slice(0, 2);
      else dateTime[index+1] = newValue;
    }
  });
  if (type === 'year') {
    if (newValue.length > 4) dateTime[0] = newValue.slice(0, 4);
    else dateTime[0] = newValue;
  }

  return `${[dateTime[0], dateTime[1], dateTime[2]].join('-')}T${[dateTime[3], dateTime[4], dateTime[5]].join(':')}`;
}



export default function DateTime({
  className='',
  label=null,
  value='',
  onChange=null,
  date=true,
  time=true,
  placeholder=true,
  size='sm',
  color='neutral',
  disabled=false
}) {
  const cnLabel = (
    (size === 'sm') ? 'text-base' :
    (size === 'md') ? 'text-lg' :
    (size === 'lg') ? 'text-xl' : ''
  );
  const cnInput = 'text-center border-y focus:outline focus:outline-2 focus:-outline-offset-2';
  const cnInputSize = (
    (size === 'sm') ? 'py-1 text-sm' :
    (size === 'md') ? 'py-1 text-base' :
    (size === 'lg') ? 'py-2 text-lg' : ''
  );
  const cnInputColor = (
    (disabled) ? 'bg-neutral-500 border-neutral-700 hover:cursor-not-allowed' :
    (color === 'neutral') ? 'bg-neutral-300 border-neutral-700 focus:outline-neutral-700' :
    (color === 'red') ? 'bg-red-300 border-red-700 focus:outline-red-700' :
    (color === 'yellow') ? 'bg-yellow-300 border-yellow-700 focus:outline-yellow-700' :
    (color === 'green') ? 'bg-green-300 border-green-700 focus:outline-green-700' :
    (color === 'cyan') ? 'bg-cyan-300 border-cyan-700 focus:outline-cyan-700' :
    (color === 'blue') ? 'bg-blue-300 border-blue-700 focus:outline-blue-700' :
    (color === 'purple') ? 'bg-purple-300 border-purple-700 focus:outline-purple-700' : ''
  );



  return (
    <div className={className}>
      {label && (
        <label className={`${cnLabel}`}>{label}</label>
      )}
      <div className='flex'>
        {date && (
          <>
            <input
              className={`${!time ? 'w-1/4' : 'w-1/6'} border-l rounded-l ${cnInput} ${cnInputSize} ${cnInputColor}`}
              value={value?.split('T')[0]?.split('-')[2] ? value.split('T')[0].split('-')[2] : ''}
              onChange={e => onChange(insertValueToDateTime(value, 'day', e.target.value))}
              placeholder={placeholder ? 'Tgl' : ''}
              disabled={disabled}
            />
            <div className={`${cnInput} ${cnInputSize} ${cnInputColor}`}>-</div>
            <input
              className={`${!time ? 'w-1/4' : 'w-1/6'} ${cnInput} ${cnInputSize} ${cnInputColor}`}
              value={value?.split('T')[0]?.split('-')[1] ? value.split('T')[0].split('-')[1] : ''}
              onChange={e => onChange(insertValueToDateTime(value, 'month', e.target.value))}
              placeholder={placeholder ? 'Bln' : ''}
              disabled={disabled}
            />
            <div className={`${cnInput} ${cnInputSize} ${cnInputColor}`}>-</div>
            <input
              className={`${!time ? 'w-2/4' : 'w-2/6'} border-r ${!time ? 'rounded-r' : ''} ${cnInput} ${cnInputSize} ${cnInputColor}`}
              value={value?.split('T')[0]?.split('-')[0] ? value.split('T')[0].split('-')[0] : ''}
              onChange={e => onChange(insertValueToDateTime(value, 'year', e.target.value))}
              placeholder={placeholder ? 'Thn' : ''}
              disabled={disabled}
            />
          </>
        )}
        {time && (
          <>
            <input
              className={`${!date ? 'w-full' : 'w-1/6'} border-l ${!date ? 'rounded-l' : ''} ${cnInput} ${cnInputSize} ${cnInputColor}`}
              value={value?.split('T')[1]?.split(':')[0] ? value.split('T')[1].split(':')[0] : ''}
              onChange={e => onChange(insertValueToDateTime(value, 'hour', e.target.value))}
              placeholder={placeholder ? 'Jam' : ''}
              disabled={disabled}
            />
            <div className={`${cnInput} ${cnInputSize} ${cnInputColor}`}>:</div>
            <input
              className={`${!date ? 'w-full' : 'w-1/6'} border-r rounded-r ${cnInput} ${cnInputSize} ${cnInputColor}`}
              value={value?.split('T')[1]?.split(':')[1] ? value.split('T')[1].split(':')[1] : ''}
              onChange={e => onChange(insertValueToDateTime(value, 'minute', e.target.value))}
              placeholder={placeholder ? 'Men' : ''}
              disabled={disabled}
            />
          </>
        )}
      </div>
    </div>
  );
};
