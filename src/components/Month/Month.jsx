import EntryList from '../EntryList/EntryList';
import styles from './Month.module.scss';
function Month() {
  return (
    <div id={styles.month}>
      <div className={styles.nav}>
        <button
          //   @click="changeMonth(-1)"
          className="arrow"
        >
          ←
        </button>
        <div
          className="title"
          style="background: rgba(5, 80, 123, 0.992); border-radius: 75px"
        >
          {/* {{ monthTitle }} */}
        </div>
        <button
          //    @click="changeMonth(1)"
          className="arrow"
        >
          →
        </button>
      </div>
      <div className={styles.weekdayNames}>
        <h2
          // v-for="day in weekdays"
          // :key="day"
          style="padding: 0px 0px 0.5rem; text-align: center"
        >
          {/* {{ day }} */}
        </h2>
      </div>
      <div className={styles.monthDays}>
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
