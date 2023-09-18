export default function InputOption({
  className='',
  label=null,
  value='',
  onChange=null,
  options=null,
  placeholder='',
  size='sm',
  color='neutral',
  disabled=false
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
      <input
        className={`px-2 h-full w-full border rounded focus:outline focus:outline-2 focus:-outline-offset-2
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
        onChange={e => {
          let newValue = [null, e.target.value];
          options?.forEach(option => {if (e.target.value.toUpperCase() === option[1]) newValue = [option[0], option[1]]});
          onChange(newValue);
        }}
        placeholder={placeholder}
        disabled={disabled}
      />
      {value && (
        <div className={`max-h-64 overflow-y-auto border rounded hover:cursor-pointer`}>
          {options?.map(option => (option[1].includes(value) && (value !== option[1])) && (
            <div
              key={option[0]}
              className={`
                ${(size === 'sm') ? 'p-1 text-sm'
                : (size === 'md') ? 'p-1 text-base'
                : (size === 'lg') ? 'p-2 text-lg' : ''}
                ${disabled ? 'bg-neutral-500 border-neutral-700 hover:cursor-not-allowed'
                : (color === 'neutral') ? 'bg-neutral-300 border-neutral-700 hover:bg-neutral-500 focus:outline-neutral-700'
                : (color === 'red') ? 'bg-red-300 border-red-700 hover:bg-red-500 focus:outline-red-700'
                : (color === 'yellow') ? 'bg-yellow-300 border-yellow-700 hover:bg-yellow-500 focus:outline-yellow-700'
                : (color === 'green') ? 'bg-green-300 border-green-700 hover:bg-green-500 focus:outline-green-700'
                : (color === 'cyan') ? 'bg-cyan-300 border-cyan-700 hover:bg-cyan-500 focus:outline-cyan-700'
                : (color === 'blue') ? 'bg-blue-300 border-blue-700 hover:bg-blue-500 focus:outline-blue-700'
                : (color === 'purple') ? 'bg-purple-300 border-purple-700 hover:bg-purple-500 focus:outline-purple-700' : ''}
              `}
              onClick={() => onChange([option[0], option[1]])}
            >
              {option[1]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
