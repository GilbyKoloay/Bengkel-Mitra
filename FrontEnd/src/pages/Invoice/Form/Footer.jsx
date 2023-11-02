import { Input, InputDate } from '../../../components';



export default function Footer({
  city,
  setCity,
  disabled,
  createDate,
  setCreateDate
}) {
  return (
    <section className='flex justify-end'>
      <div className='w-96 flex items-end'>
        <Input
          value={city}
          onChange={setCity}
          disabled={disabled}
        />

        <div className='ml-1 mr-2'>,</div>

        <InputDate
          value={createDate}
          onChange={setCreateDate}
          disabled={disabled}
        />
      </div>
    </section>
  );
};
