export default function Main({
  header=null,
  title='',
  table=null
}) {
  return (
    <main className='flex-1 p-4 flex flex-col gap-4 overflow-auto'>
      <div className='flex flex-col sm:flex-row gap-2'>
        {header}
      </div>

      <div className='text-2xl'>{title}</div>

      <div className='flex-1 overflow-auto'>
        {table}
      </div>
    </main>
  );
};
