export default function Button({
  className='',
  label='Button',
  onClick=null,
  size='sm',
  color='neutral',
  disabled=false
}) {
  return (
    <button
      className={`border rounded
        bg-${color}-300 border-${color}-700 hover:bg-${color}-500
        ${className}
        ${(size === 'sm') ? 'py-1 px-2'
        : (size === 'md') ? 'py-2 px-4'
        : (size === 'lg') ? 'py-4 px-8' : ''}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};
