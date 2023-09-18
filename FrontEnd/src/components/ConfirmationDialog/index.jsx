import { Button } from '../';



export default function ConfirmationDialog({
  title='',
  description=null,
  onCancel=null,
  onConfirm=null,
  color='green'
}) {
  return (
    <div className='backdrop-blur-sm backdrop-brightness-50 fixed top-0 left-0 h-screen w-screen flex justify-center items-center'>
      <div className='w-5/6 sm:w-4/6 md:w-3/6 border-2 rounded p-4 bg-neutral-100'>
        <div className='h-full'>
          <div className='flex justify-between'>
            <div className='text-xl font-bold'>{title}</div>
            <Button
              label='X'
              onClick={onCancel}
              size='md'
              color='red'
            />
          </div>
          {description && (
            <div className='overflow-y-auto'>
              <hr className='my-4 border-1 border-neutral-300' />
              <div>{description}</div>
            </div>
          )}
        </div>
        <hr className='my-4 border-1 border-neutral-300' />
        <div className='flex gap-2 sm:gap-4 md:gap-8 lg:gap-16'>
          <Button
            className='flex-1'
            label='Batal'
            onClick={onCancel}
            size='lg'
          />
          <Button
            className='flex-1'
            label='Konfirmasi'
            onClick={onConfirm}
            color={color}
            size='lg'
          />
        </div>
      </div>
    </div>
  );
};
