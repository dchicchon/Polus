import { useState, useEffect } from 'preact/hooks';
import Day from '../Day/Day';
import Month from '../Month/Month';
import Week from '../Week/Week';

import styles from './Calendar.module.scss';

function Calendar() {
  const [component, setComponent] = useState(null);
  useEffect(() => {
    setComponent(<Day />);
  }, []);

  const changeView = (type) => {
    switch (type) {
      case 'day':
        setComponent(<Day />);
        break;
      case 'week':
        setComponent(<Week />);
        break;
      case 'month':
        setComponent(<Month />);
        break;
    }
  };
  return (
    <div id="vuemain">
      <div id={styles.view}>
        <button
          onClick={() => changeView('day')}
          type="button"
          className={styles.view_btn}
        >
          Daily
        </button>
        <button
          onClick={() => changeView('week')}
          type="button"
          className={styles.view_btn}
        >
          Week
        </button>
        <button
          onClick={() => changeView('month')}
          type="button"
          className={styles.view_btn}
        >
          Month
        </button>
      </div>
      <div>
        <section>{component}</section>
      </div>
    </div>
  );
}

export default Calendar;
