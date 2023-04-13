import { useEffect, useState } from 'preact/hooks';
import EntryList from '../EntryList/EntryList';
import styles from './Day.module.scss';

function Day() {
  const [date, setDate] = useState(new Date());
  const [dayTitle, setDayTitle] = useState('');
  useEffect(() => {
    const day = date.toLocaleString(undefined, { weekday: 'short' });
    const num = date.toLocaleDateString();
    setDayTitle(`${day} ${num}`);
  }, [date]);

  const changeDay = (amount) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + amount);
    setDate(newDate);
  };

  const todayDate = (checkDate) => {
    const newDate = new Date();
    return newDate.getDay() === checkDate.getDay();
  };

  return (
    <div id={styles.daily}>
      <div className={styles.nav}>
        <button onClick={() => changeDay(-1)} className="arrow">
          ←
        </button>
        <h5
          class="dayTitle"
          style={{
            background: todayDate(date) ? 'rgba(5, 80, 123, 0.992)' : 'none',
          }}
        >
          {dayTitle}
        </h5>
        <button onClick={() => changeDay(1)} className="arrow">
          →
        </button>
      </div>
      <div className={styles.dayDiv}>
        <EntryList dateStamp={date.toLocaleDateString("en-US").replaceAll('/', '_')} />
      </div>
    </div>
  );
}
export default Day;
