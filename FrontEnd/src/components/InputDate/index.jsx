import { Input } from '../';



export default function InputDate({
  className,
  childrenClassName,
  value,
  onChange,
  disabled=false
}) {
  function thisOnChange(type, newValue) {
    const year = value.split('T')[0].split('-')[0];
    const month = value.split('T')[0].split('-')[1];
    const day = value.split('T')[0].split('-')[2];

    if (type === 'year') onChange(`${newValue.slice(0, 4)}-${month}-${day}T00:00:00.000Z`);
    if (type === 'month') onChange(`${year}-${newValue.slice(0, 2)}-${day}T00:00:00.000Z`);
    if (type === 'day') onChange(`${year}-${month}-${newValue.slice(0, 2)}T00:00:00.000Z`);
  }



  return (
    <div className={`${className} w-full flex gap-1`}>
      <Input
        className={childrenClassName}
        value={value.split('T')[0].split('-')[2]}
        onChange={value => thisOnChange('day', value)}
        placeholder='Tgl'
        disabled={disabled}
      />
      <Input
        className={childrenClassName}
        value={value.split('T')[0].split('-')[1]}
        onChange={value => thisOnChange('month', value)}
        placeholder='Bln'
        disabled={disabled}
      />
      <Input
        className={childrenClassName}
        value={value.split('T')[0].split('-')[0]}
        onChange={value => thisOnChange('year', value)}
        placeholder='Thn'
        disabled={disabled}
      />
    </div>
  );
};
