import { Input } from '../../../components';



export default function Notes({
  noteLabel,
  setNoteLabel,
  disabled,
  notes,
  setNotes,
  paymentLabels,
  setPaymentLabels
}) {
  function handleNoteOnChange(index, newValue) {
    let newNotes = [...notes];
    newNotes[index] = newValue;
    newNotes = [...newNotes.filter(note => note), ''];

    setNotes(newNotes);
  }



  return (
    <section className='flex'>
      <div className='flex-1 flex flex-col gap-1'>
        <div className='w-64'>
          <Input
            value={noteLabel}
            onChange={setNoteLabel}
            disabled={disabled}
          />
        </div>
        {notes.map((note, index) => (
          <div key={index} className='w-64 ml-2'>
            <Input
              value={note}
              onChange={value => handleNoteOnChange(index, value)}
              disabled={disabled}
            />
          </div>
        ))}
      </div>

      <div>
        <div className='border border-neutral-900 p-2 flex flex-col gap-1'>
          <div>
            <Input
              value={paymentLabels.top}
              onChange={value => setPaymentLabels({...paymentLabels, top: value})}
              disabled={disabled}
            />
          </div>
          <div>
            <Input
              value={paymentLabels.mid}
              onChange={value => setPaymentLabels({...paymentLabels, mid: value})}
              disabled={disabled}
            />
          </div>
          <div>
            <Input
              value={paymentLabels.bot}
              onChange={value => setPaymentLabels({...paymentLabels, bot: value})}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
