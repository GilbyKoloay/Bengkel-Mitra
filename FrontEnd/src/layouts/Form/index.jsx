import { useNavigate, useLocation } from 'react-router-dom';

import { Button } from '../../components';



export default function Form({
  header=null,
  title='',
  form=null,
  onSubmit=null,
  isLoading=null,
  actions=null
}) {
  const navigate = useNavigate();
  const location = useLocation();



  return (
    <main className='flex-1 p-4 flex flex-col gap-4 overflow-auto'>
      <div className='flex flex-col sm:flex-row gap-2'>
        <Button
          className='whitespace-nowrap'
          label='Kembali'
          onClick={() => navigate(`/${location.pathname.split('/')[1]}`)}
          size='md'
          designType='tertiary'
        />
        {header}
      </div>

      {isLoading ? (
        <div className='text-2xl'>Sedang memuat data, mohon tunggu ...</div>
      ) : (
        <>
          <div className='text-2xl'>{title}</div>
          
          <form onSubmit={onSubmit} className='flex-1 flex flex-col gap-4 overflow-auto'>
            {form}
            <div className='flex flex-col sm:flex-row gap-2'>
              {actions}
            </div>
          </form>
        </>
      )}
    </main>
  );
};
