import { useEffect, useState } from 'preact/hooks';
import Entry from '../Entry/Entry';

import styles from './EntryList.module.scss';

function EntryList({ date }) {

  const [entries, setEntries] = useState([])

  const readEntries = () => {
    // eventually we'll read from an actual store. For now lets just
    // make a fake store of entries
    const testEntries = [
      {
        text: "earl",
        active: true,
        color: 'blue',
        time: new Date(),
      }
    ]

    setEntries(testEntries);
  }

  useEffect(() => {
    console.log('create entry list')
    readEntries();
  }, [])
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

        {entries.length > 0 ? entries.map((entry) => (
          <Entry
            date={date}
            entry={entry}
          // v-for="(entry, index) in entries"
          // :key="index"
          // :entry="entry"
          // draggable="true"
          // @dragstart="dragStart($event, entry.key, entry, id)"
          // :createEntry="createEntry"
          // :updateEntry="updateEntry"
          // :deleteEntry="deleteEntry"
          // :listDate="listDate"
          />
        )) : ''}

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
