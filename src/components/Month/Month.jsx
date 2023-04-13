import { useState, useEffect } from 'preact/hooks';
import EntryList from '../EntryList/EntryList';
import styles from './Month.module.scss';
function Month() {
  const [date, setDate] = useState(new Date());
  const [monthTitle, setMonthTitle] = useState('');
  const [weekdays, setWeekdays] = useState([]);
  const [dateList, setDateList] = useState([]);

  const changeMonth = (amount) => {
    let changeDate = new Date(date); // current date:
    changeDate.setMonth(changeDate.getMonth() + amount);
    setDate(changeDate);
  };
  const createWeekdays = () => {
    let startDate = new Date(date);
    // This is how we set it to sunday
    const days = [];
    while (startDate.getDay() !== 0) {
      // while startDate.getDay is not equal to 0, continue to set date
      startDate.setDate(startDate.getDate() - 1);
    }
    for (let i = 0; i < 7; i++) {
      let dayDate = new Date(startDate).toLocaleDateString(undefined, {
        weekday: 'long',
      });
      days.push(dayDate);
      startDate.setDate(startDate.getDate() + 1);
    }
    setWeekdays(days);
  };

  const createDateList = () => {
    console.log('creating date list');
    let dates = [];
    let startDate = new Date(date);
    let currentMonth = startDate.getMonth(); // what month is it
    startDate.setDate(1); // set it to day 1 of month

    // This is how we set it to sunday
    while (startDate.getDay() !== 0) {
      // while startDate.getDay is not equal to 0, continue to set date
      startDate.setDate(startDate.getDate() - 1);
    }

    // I think that this is not working because eventually when we change years, we might be in a different month thing not too sure
    // instead check if its equal to the next month. Easy!
    let nextDate = new Date();
    nextDate.setMonth(currentMonth + 1);

    // Make a week while we are still in the same month
    function makeWeek() {
      let week = [];
      for (let i = 0; i < 7; i++) {
        let dayDate = new Date(startDate);
        week.push(dayDate);
        startDate.setDate(startDate.getDate() + 1);
      }
      return week;
    }
    // if the startDate month is equal to the next month, then exit this loop
    while (startDate.getMonth() !== nextDate.getMonth()) {
      let week = makeWeek();
      dates = [...dates, ...week];
    }

    setDateList(dates);
  };

  useEffect(() => {
    let options = { month: 'long', year: 'numeric' };
    setMonthTitle(date.toLocaleDateString(undefined, options));
    createWeekdays();
    createDateList();
  }, [date]);
  return (
    <div id={styles.month}>
      <div className={styles.nav}>
        <button onClick={() => changeMonth(-1)} className="arrow">
          ←
        </button>
        <div
          className="title"
          style="background: rgba(5, 80, 123, 0.992); border-radius: 75px"
        >
          {monthTitle}
        </div>
        <button onClick={() => changeMonth(1)} className="arrow">
          →
        </button>
      </div>
      <div className={styles.weekdayNames}>
        {weekdays.length > 0
          ? weekdays.map((day) => (
              <h2 style="padding: 0px 0px 0.5rem; text-align: center">{day}</h2>
            ))
          : ''}
      </div>
      <div className={styles.monthDays}>
        {dateList.length > 0
          ? dateList.map((dateListItem) => (
              <div className={styles.monthDay}>
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
            :classNames="['monthDay']"
          /> */}
      </div>
    </div>
  );
}
export default Month;
