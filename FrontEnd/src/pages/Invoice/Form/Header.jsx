import { Input } from '../../../components';



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
