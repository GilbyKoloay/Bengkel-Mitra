export default function Select({
  className='',
  label='',
  value='',
  options=null,
  onChange=null,
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
      <select
        className={`w-full border-2 focus:outline focus:outline-1 focus:outline-offset-1
          ${(size === 'sm') ? 'py-1 px-1 text-sm' :
            (size === 'md') ? 'py-1 px-2 text-base' :
            (size === 'lg') ? 'py-2 px-2 text-lg' : ''}
          ${disabled ? 'bg-neutral-500 border-neutral-700 rounded hover:cursor-not-allowed' : `
            hover:cursor-pointer
            ${(theme === 'neutral') ? 'bg-neutral-300 border-neutral-700 rounded hover:bg-neutral-500 focus:bg-neutral-300 focus:outline-neutral-700' :
              (theme === 'red') ? 'bg-red-300 border-red-700 rounded hover:bg-red-500 focus:bg-red-300 focus:outline-red-700' :
              (theme === 'green') ? 'bg-green-300 border-green-700 rounded hover:bg-green-500 focus:bg-green-300 focus:outline-green-700' :
              (theme === 'blue') ? 'bg-blue-300 border-blue-700 rounded hover:bg-blue-500 focus:bg-blue-300 focus:outline-blue-700' : ''}
          `}
        `}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      >
        {placeholder && (
          <option
            className='hidden'
            value=''
            disabled
          >
            {placeholder}
          </option>
        )}
        {options?.map((option, index) => (
          <option key={index} value={option[0]}>{option[1]}</option>
        ))}
      </select>
      {errMsg && <label className='text-red-500'>{errMsg}</label>}
    </div>
  );
};
