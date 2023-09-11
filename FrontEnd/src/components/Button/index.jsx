export default function Button({
  className='',
  label='Button',
  onClick=null,
  type='button',
  size='sm',
  color='neutral',
  disabled=false
}) {
  return (
    <button
      className={`border rounded focus:outline focus:outline-2 focus:-outline-offset-2
        ${className}
        ${(size === 'sm') ? 'py-1 px-2 text-sm'
        : (size === 'md') ? 'py-1 px-4 text-base'
        : (size === 'lg') ? 'py-2 px-8 text-lg' : ''}
        ${disabled ? 'bg-neutral-500 border-neutral-700 hover:cursor-not-allowed'
        : (color === 'neutral') ? 'bg-neutral-300 border-neutral-700 hover:bg-neutral-500 focus:outline-neutral-700'
        : (color === 'red') ? 'bg-red-300 border-red-700 hover:bg-red-500 focus:outline-red-700'
        : (color === 'yellow') ? 'bg-yellow-300 border-yellow-700 hover:bg-yellow-500 focus:outline-yellow-700'
        : (color === 'green') ? 'bg-green-300 border-green-700 hover:bg-green-500 focus:outline-green-700'
        : (color === 'cyan') ? 'bg-cyan-300 border-cyan-700 hover:bg-cyan-500 focus:outline-cyan-700'
        : (color === 'blue') ? 'bg-blue-300 border-blue-700 hover:bg-blue-500 focus:outline-blue-700'
        : (color === 'purple') ? 'bg-purple-300 border-purple-700 hover:bg-purple-500 focus:outline-purple-700' : ''}
      `}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {label}
    </button>
  );
};
