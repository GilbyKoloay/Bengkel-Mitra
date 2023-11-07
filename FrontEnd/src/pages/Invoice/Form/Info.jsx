import { Button, Input, InputDate } from '../../../components';



const InfoItem = ({
  label,
  type,
  value,
  onChange,
  disabled
}) => {
  return (
    <div className='flex gap-2 items-center'>
      <Button
        className='w-8 py-1 px-2'
        label='-'
        onClick={() => onChange(null)}
        theme='red'
      />

      <Input
        className='flex-1'
        value={label}
        onChange={thisValue => onChange({label: thisValue, value, type})}
        disabled={disabled}
      />

      <div className='flex-1 flex gap-1 items-center'>
        <div>:</div>
        {(type === 'text') ? (
          <Input
            value={value}
            onChange={thisValue => onChange({label, value: thisValue, type})}
            disabled={disabled}
          />
        ) : (type === 'date') && (
          <InputDate
            value={value}
            onChange={thisValue => onChange({label, value: thisValue, type})}
            disabled={disabled}
          />
        )}
      </div>

      <div className='flex gap-1'>
        <Button
          className='py-1 px-2'
          label='Teks'
          onClick={() => onChange({label, value: '', type: 'text'})}
          theme={(type === 'text') ? 'blue' : 'neutral'}
        />
        <Button
          className='py-1 px-2'
          label='Tanggal'
          onClick={() => onChange({label, value: '--T00:00:00.000Z', type: 'date'})}
          theme={(type === 'date') ? 'blue' : 'neutral'}
        />
      </div>
    </div>
  );
};



export default function Info({ info, setInfo, disabled }) {
  function handleInfoOnChange(index, newValue) {
    let newInfo = [...info];
    newInfo[index] = newValue;
    newInfo = [...newInfo.filter(item => item)];
    setInfo(newInfo);
  }



  return (
    <section className='w-full md:w-1/2 flex flex-col gap-1'>
      {info.map((item, index) => (
        <InfoItem
          key={index}
          type={item.type}
          label={item.label}
          value={item.value}
          onChange={value => handleInfoOnChange(index, value)}
          disabled={disabled}
        />
      ))}
      <Button
        className='w-8 py-1 px-2'
        label='+'
        onClick={() => handleInfoOnChange(info.length, {
          label: '',
          value: '',
          type: 'text'
        })}
        theme='blue'
      />
    </section>
  );
};
