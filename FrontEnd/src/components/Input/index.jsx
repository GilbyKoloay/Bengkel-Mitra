export default function Input({
  className,
  value,
  onChange,
  placeholder,
  type='text',
  disabled=false
}) {
  return (
    <input
      className={`
        ${className}
        w-full p-1 border border-neutral-700 rounded placeholder:text-neutral-500 focus:outline focus:outline-1
        ${!disabled ?
          'bg-neutral-100 focus:outline-neutral-700' :
          'bg-neutral-500 hover:cursor-not-allowed'
        }
      `}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
      disabled={disabled}
    />
  );
};
