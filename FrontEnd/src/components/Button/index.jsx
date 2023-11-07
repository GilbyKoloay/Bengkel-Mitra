export default function Button({
  className='',
  label='',
  onClick=null,
  type='button',
  disabled=false,
  size='sm',
  theme='neutral'
}) {
  return (
    <button
      className={`border-2 focus:outline focus:outline-1 focus:outline-offset-1
        ${className}
        ${(size === 'sm') ? 'text-base' :
          (size === 'md') ? 'py-1 px-4 text-lg' :
          (size === 'lg') ? 'py-2 px-4 text-xl' : ''
        }
        ${disabled ? 'bg-neutral-500 border-neutral-700 rounded hover:cursor-not-allowed' : (
          (theme === 'neutral') ? 'bg-neutral-300 border-neutral-700 rounded hover:bg-neutral-500 focus:outline-neutral-700' :
          (theme === 'red') ? 'bg-red-300 border-red-700 rounded hover:bg-red-500 focus:outline-red-700' :
          (theme === 'yellow') ? 'bg-yellow-300 border-yellow-700 rounded hover:bg-yellow-500 focus:outline-yellow-700' :
          (theme === 'blue') ? 'bg-blue-300 border-blue-700 rounded hover:bg-blue-500 focus:outline-blue-700' : ''
        )}
      `}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {label}
    </button>
  );
};
