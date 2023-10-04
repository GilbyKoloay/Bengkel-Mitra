import styles from './styles.module.css';



export default function Table({
  titles=null,
  filters=null,
  info=null,
  data=null
}) {
  return (
    <table className='border-2 border-blue-700 w-full'>
      <thead className={styles.head}>
        {titles.map((title, index) => (
          <tr key={index} className={styles.title}>
            {title}
          </tr>
        ))}

        <tr className={styles.filter}>
          {filters}
        </tr>

        <tr className={styles.info}>
          {info}
        </tr>
      </thead>

      <tbody className={styles.data}>
        {data}
      </tbody>
    </table>
  );
};
