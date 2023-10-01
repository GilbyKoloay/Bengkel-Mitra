import { Button } from '../';



export default function ConfirmationDialog({
  title='',
  description='',
  onCancel=null,
  onConfirm=null,
  theme='neutral'
}) {
  return (
    <div className='fixed top-0 left-0 h-screen w-screen flex justify-center items-center backdrop-blur-sm backdrop-brightness-50'>
      <div className='max-h-[80vh] w-5/6 sm:w-4/6 md:w-3/6 bg-neutral-100 rounded p-4'>
        <div className='font-bold text-xl'>{title}</div>
        <div className='border border-neutral-300 my-4' />
        {description && (
          <>
            <div className='max-h-80 overflow-y-auto'>
              <div>{description}</div>
            </div>
            <div className='border border-neutral-300 my-4' />
          </>
        )}
        <div className='flex gap-4 sm:justify-end'>
          <Button
            className='flex-1 sm:flex-[0]'
            label='Batal'
            onClick={onCancel}
            size='md'
          />
          <Button
            className='flex-1 sm:flex-[0]'
            label='Konfirmasi'
            onClick={onConfirm}
            size='md'
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
};
