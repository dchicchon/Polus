import { useState, useEffect } from 'preact/hooks';
import Day from '../Day/Day';
import Month from '../Month/Month';
import Week from '../Week/Week';
import { userSettings } from '../../utils';

import styles from './Calendar.module.scss';

function Calendar() {
  const [component, setComponent] = useState('');
  useEffect(() => {
    changeView(userSettings.value.view);
  }, []);

  const changeView = (type) => {
    const snapshot = { ...userSettings.value };
    switch (type) {
      case 'day':
        setComponent(<Day />);
        snapshot.view = 'day';
        userSettings.value = snapshot;
        break;
      case 'week':
        setComponent(<Week />);
        snapshot.view = 'week';
        userSettings.value = snapshot;
        break;
      case 'month':
        setComponent(<Month />);
        snapshot.view = 'month';
        userSettings.value = snapshot;
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
