export default function Select({
  className,
  options,
  value,
  onChange,
  placeholder,
  disabled
}) {
  return (
    <select
      className={`
        ${className}
        w-full p-1 border border-neutral-700 rounded placeholder:text-neutral-500 focus:outline focus:outline-1
        ${!disabled ?
          'bg-neutral-100 hover:bg-neutral-300 hover:cursor-pointer focus:outline-neutral-700' :
          'bg-neutral-500 hover:cursor-not-allowed'
        }
      `}
      value={value}
      onChange={e => onChange(e.target.value)}
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
      {options?.map((option, index) => <option key={index} value={option[0]}>{option[1]}</option>)}
    </select>
  );
};
