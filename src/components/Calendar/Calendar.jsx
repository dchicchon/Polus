import Day from '../Day/Day';
import Month from '../Month/Month';
import Week from '../Week/Week';
import { userSettings } from '../../utils';

import styles from './Calendar.module.scss';

function Calendar() {
  const changeView = (type) => {
    switch (type) {
      case 'day':
        userSettings.value = { ...userSettings.value, view: type };
        break;
      case 'week':
        userSettings.value = { ...userSettings.value, view: type };
        break;
      case 'month':
        userSettings.value = { ...userSettings.value, view: type };
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
        <section>
          {userSettings.value.view === 'day' && <Day />}
          {userSettings.value.view === 'week' && <Week />}
          {userSettings.value.view === 'month' && <Month />}
        </section>
      </div>
    </div>
  );
}

export default Calendar;
