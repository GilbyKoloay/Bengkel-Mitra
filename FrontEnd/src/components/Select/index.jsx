export default function Select({
  className='',
  label=null,
  value='',
  onChange=null,
  options=null,
  placeholder=null,
  size='sm',
  color='neutral',
  disabled=false,
  errMsg=null
}) {
  return (
    <div className={className}>
      {label && (
        <label className={
          (size === 'sm') ? 'text-base'
          : (size === 'md') ? 'text-lg'
          : (size === 'lg') ? 'text-xl' : ''}
        >
          {label}
        </label>
      )}
      <select
        className={`px-2 h-full w-full border rounded hover:cursor-pointer focus:outline focus:outline-2 focus:-outline-offset-2
          ${(size === 'sm') ? 'py-1 text-sm'
          : (size === 'md') ? 'py-1 text-base'
          : (size === 'lg') ? 'py-2 text-lg' : ''}
          ${disabled ? 'bg-neutral-500 border-neutral-700 hover:cursor-not-allowed'
          : (color === 'neutral') ? 'bg-neutral-300 border-neutral-700 focus:outline-neutral-700'
          : (color === 'red') ? 'bg-red-300 border-red-700 focus:outline-red-700'
          : (color === 'yellow') ? 'bg-yellow-300 border-yellow-700 focus:outline-yellow-700'
          : (color === 'green') ? 'bg-green-300 border-green-700 focus:outline-green-700'
          : (color === 'cyan') ? 'bg-cyan-300 border-cyan-700 focus:outline-cyan-700'
          : (color === 'blue') ? 'bg-blue-300 border-blue-700 focus:outline-blue-700'
          : (color === 'purple') ? 'bg-purple-300 border-purple-700 focus:outline-purple-700' : ''}
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
          <option
            key={index}
            className={`bg-${color}-300
              ${(size === 'sm') ? 'text-sm'
              : (size === 'md') ? 'text-base'
              : (size === 'lg') ? 'text-lg' : ''}
            `}
            value={option[0]}
          >
            {option[1]}
          </option>
        ))}
      </select>
      {errMsg && (
        <label className={`text-red-500
          ${(size === 'sm') ? 'text-sm'
          : (size === 'md') ? 'text-base'
          : (size === 'lg') ? 'text-lg' : ''}
        `}
        >
          {errMsg}
        </label>
      )}
    </div>
  );
};
