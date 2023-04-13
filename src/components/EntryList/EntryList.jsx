import Entry from '../Entry/Entry';
import styles from './EntryList.module.scss';

function EntryList(props) {
  return (
    <div
      className={styles.details}
      // :class="addClasses"
      // @drop="onDrop($event)"
      // @dragover.prevent
      // ref="details"
    >
      <div
        // v-if="dateTitle"
        // :style="todayDate"
        className={styles.dateTitle}
      >
        {/* { dayNumber } */}
      </div>

      <ul
        // v-if="entries.length"
        // ref="entryList"
        className={styles.entryList}
      >
        <Entry
        // v-for="(entry, index) in entries"
        // :key="index"
        // :entry="entry"
        // draggable="true"
        // @dragstart="dragSt/art($event, entry.key, entry, id)"
        // :createEntry="createEntry"
        // :updateEntry="updateEntry"
        // :deleteEntry="deleteEntry"
        // :listDate="listDate"
        />
      </ul>
      <ul
        // v-else
        //  ref="entryList"
        className={styles.entryList}
      ></ul>

      <button
        // @click="initEntry"
        // :value="dateStamp"
        className={styles.addButton}
      >
        +
      </button>
    </div>
  );
}

export default EntryList;
