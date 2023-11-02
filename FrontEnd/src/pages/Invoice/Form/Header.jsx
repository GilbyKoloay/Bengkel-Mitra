const Input = ({
  className,
  value,
  onChange,
  disabled
}) => {
  return (
    <input
      className={`col-start-7 col-span-2 h-full w-full bg-transparent p-1 focus:outline focus:outline-1  focus:rounded focus:outline-neutral-900 ${className}`}
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
    />
  );
};



export default function Header({ headerLabels, setHeaderLabels }) {
  return (
    <section className='flex flex-col gap-1'>
      <Input
        className='text-2xl'
        value={headerLabels.top}
        onChange={value => setHeaderLabels({...headerLabels, top: value})}
      />
      <Input
        value={headerLabels.mid}
        onChange={value => setHeaderLabels({...headerLabels, mid: value})}
      />
      <Input
        className='text-xs'
        value={headerLabels.bot}
        onChange={value => setHeaderLabels({...headerLabels, bot: value})}
      />
    </section>
  );
};
