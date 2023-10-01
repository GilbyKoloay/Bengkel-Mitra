import { toProperString } from '../../functions';



export default function InputOption({
  className='',
  label='',
  value='',
  options=null,
  onChange=null,
  placeholder='',
  disabled=false,
  size='sm',
  theme='neutral'
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
        onChange={e => {
          const optionExist = options.filter(option => option[1] === toProperString(e.target.value))[0];
          if (optionExist) onChange([optionExist[0], e.target.value]);
          else onChange([null, e.target.value]);
        }}
        placeholder={placeholder}
        disabled={disabled}
      />
      {value && (
        <div className={`w-full border rounded max-h-48 overflow-y-auto
          ${(theme === 'neutral') ? 'border-neutral-700' : ''}
        `}>
          {options.filter(option => option[1].includes(toProperString(value))).map((option, index) => (option[1] !== toProperString(value)) && (
            <div
              key={index}
              className={`hover:cursor-pointer py-1 px-2
                ${(size === 'sm') ? 'text-sm' :
                  (size === 'md') ? 'text-base' :
                  (size === 'lg') ? 'text-lg' : ''
                }
                ${(theme === 'neutral') ? 'hover:bg-neutral-300' : ''}
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
