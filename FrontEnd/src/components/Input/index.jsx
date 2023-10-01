export default function Input({
  className='',
  label='',
  value='',
  onChange=null,
  type='text',
  placeholder='',
  disabled=false,
  size='sm',
  theme='neutral',
  errMsg=''
}) {
  return (
    <div
      className={`flex flex-col
        ${className}
      `}
    >
      {label && (
        <label
          className={
            (size === 'sm') ? 'text-base' :
            (size === 'md') ? 'text-lg' :
            (size === 'lg') ? 'text-xl' : ''
          }
        >
          {label}
        </label>
      )}
      <input
        className={`w-full border-2 focus:outline focus:outline-1 focus:outline-offset-1 placeholder:text-neutral-500
          ${(size === 'sm') ? 'py-1 px-1 text-sm' :
            (size === 'md') ? 'py-1 px-2 text-base' :
            (size === 'lg') ? 'py-2 px-2 text-lg' : ''
          }
          ${disabled ? 'bg-neutral-500 border-neutral-700 rounded hover:cursor-not-allowed' : (
            (theme === 'neutral') ? 'bg-neutral-300 border-neutral-700 rounded focus:outline-neutral-700' : ''
          )}
        `}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
      />
      {errMsg && <label className='text-red-500'>{errMsg}</label>}
    </div>
  );
};
