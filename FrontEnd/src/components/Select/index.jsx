export default function Select({
  className='',
  label=null,
  value=null,
  onChange=null,
  options=null,
  size='sm',
  color='neutral',
  disabled=false
}) {
  return (
    <select
      className={`px-2 hover:cursor-pointer
        border rounded border-${color}-700 bg-${color}-300 hover:bg-${color}-500
        ${className}
        ${(size === 'sm') ? 'py-1 text-sm'
        : (size === 'md') ? 'py-2 text-base'
        : (size === 'lg') ? 'py-4 text-lg' : ''}
      `}
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
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
  );
};
