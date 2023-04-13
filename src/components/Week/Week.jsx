import { useState, useEffect } from 'preact/hooks';
import EntryList from '../EntryList/EntryList';
import styles from './Week.module.scss';

function Week() {
  const [date, setDate] = useState(new Date());
  const [weekdays, setWeekdays] = useState([]);
  const [dateList, setDateList] = useState([]);
  const [weekTitle, setWeekTitle] = useState('');

  const changeDay = (amount) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + amount);
    setDate(newDate);
  };

  const getDates = () => {
    const dates = [];
    const startDate = new Date(date);
    while (startDate.getDay() !== 0) {
      startDate.setDate(startDate.getDate() - 1);
    }
    for (let i = 0; i < 7; i++) {
      const thisDate = new Date(startDate); // create a new date so as not to reference the main one we are copying
      dates.push(thisDate);
      startDate.setDate(startDate.getDate() + 1);
    }
    const newWeekdays = dates.map((newDate) =>
      newDate.toLocaleDateString(undefined, { weekday: 'long' })
    );
    setWeekdays(newWeekdays);
    setDateList(dates);
  };

  const getWeekTitle = () => {
    const startDate = new Date(date);
    while (startDate.getDay() !== 0) startDate.setDate(startDate.getDate() - 1);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    setWeekTitle(`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`);
  };

  useEffect(() => {
    getWeekTitle();
    getDates();
  }, [date]);

  return (
    <div id={styles.week}>
      <div className={styles.nav}>
        <button onClick={() => changeDay(-7)} className="arrow">
          ←
        </button>
        <div
          className="title"
          style="
              width: 22rem;
              background: rgba(5, 80, 123, 0.992);
              border-radius: 75px;
            "
        >
          {weekTitle}
        </div>
        <button onClick={() => changeDay(7)} className="arrow">
          →
        </button>
      </div>
      <div className={styles.weekdayNames}>
        {weekdays.length > 0 ? weekdays.map((weekday) => <h2>{weekday}</h2>) : ''}
      </div>
      <div className={styles.weekdays}>
        {dateList.length > 0
          ? dateList.map((dateListItem) => (
              <div className={styles.weekday}>
                <EntryList
                  date={dateListItem}
                  dateStamp={dateListItem
                    .toLocaleDateString('en-US')
                    .replaceAll('/', '_')}
                />
              </div>
            ))
          : ''}

        {/* <EntryList
            v-for="(date, index) in dateList"
            :ref="`${index}`"
            :key="index"
            :id="index"
            :listDate="date"
            :dateTitle="true"
            :classNames="['weekday']"
          /> */}
      </div>
    </div>
  );
}

export default Week;
