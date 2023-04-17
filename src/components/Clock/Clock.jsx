import { useEffect, useState } from 'preact/hooks';
import styles from './Clock.module.scss';

function Clock() {
  const [date, setDate] = useState(null);
  const [clock, setClock] = useState(null);

  const updateTime = () => {
    let currentDate = new Date();
    let options = {
      weekday: 'long',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    };
    const newDate = currentDate.toLocaleDateString(undefined, options);
    const newClock = currentDate.toLocaleTimeString();
    setDate(newDate);
    setClock(newClock);
  };

  useEffect(() => {
    updateTime();
    let timer = setInterval(updateTime, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div>
      <div id={styles.date}>{date}</div>
      <div id={styles.clock}>{clock}</div>
    </div>
  );
}

export default Clock;
