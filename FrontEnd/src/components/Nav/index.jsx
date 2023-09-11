import { Button, Select } from '../';



export default function Nav() {
  return (
    <nav className='bg-blue-300 flex-1 border round border-blue-700 px-8 flex justify-between gap-8'>
      <div className='text-xl flex flex-col justify-center items-center hover:cursor-pointer'>
        <div>Bengkel</div>
        <div>Mitra</div>
      </div>

      <div className='flex-1 flex items-center'>
        <div className='md:hidden h-full w-full py-2'>
          <Select
            className='h-full w-full'
            options={[
              ['1', 'Halaman 1'],
              ['2', 'Halaman 2'],
              ['3', 'Halaman 3'],
              ['4', 'Halaman 4'],
              ['5', 'Halaman 5']
            ]}
            size='lg'
            color='blue'
          />
        </div>
        <div className='hidden md:flex h-full w-full py-2 gap-4'>
          <Button label='Halaman 1' color='neutral' />
          <Button label='Halaman 2' color='blue' />
          <Button label='Halaman 3' color='blue' />
          <Button label='Halaman 4' color='blue' />
          <Button label='Halaman 5' color='blue' />
        </div>
      </div>

      <div className='flex items-center'>
        <Button
          label='Keluar'
          size='md'
          color='red'
        />
      </div>
    </nav>
  );
};
