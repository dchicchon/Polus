import { useEffect, useState } from 'preact/hooks';
import shortid from 'shortid';
import { actions } from '../../utils/index';
import Entry from '../Entry/Entry';

import styles from './EntryList.module.scss';

function EntryList({ dateStamp }) {

  const [entries, setEntries] = useState([])
  const initEntry = () => {
    console.info("initEntry");
    // Add to entries state and to chrome storage
    const key = shortid.generate();
    let newEntry = {
      key,
      text: "",
      color: "blue",
      active: false,
      new: true,
    };

    setEntries(prevEntries => [...prevEntries, newEntry])
  }

  const createEntry = (entry) => {
    console.info("createEntry");
    console.log({ entry })
    const index = entries.findIndex((e) => e.key === entry.key);
    setEntries(prevEntries => {
      // gotta get the entry, then we delete it's property .new
      const updatedEntries = prevEntries.slice();
      delete updatedEntries[index].new
      return updatedEntries
    })
    console.log('made it here');
    actions
      .create({ date: dateStamp, entry, key: entry.key })
      .then((result) => {
        console.info({ result });
      })
      .catch((e) => console.error(e));
  }
  const readEntries = () => {
    // eventually we'll read from an actual store. For now lets just
    // make a fake store of entries
    console.info("readEntries");
    actions
      .read({ date: dateStamp })
      .then((result) => {
        console.info({ result });
        setEntries(result);
      })
      .catch((e) => console.error(e));
  }
  const updateEntry = (key) => {
    console.info("updateEntry");
    // check if entry is any different than before
    const index = entries.findIndex((e) => e.key === key);
    const entry = entries[index];
    actions
      .update({ date: dateStamp, entry, key })
      .then((result) => {
        console.info({ result });
      })
      .catch((e) => console.error(e));
  }
  const deleteEntry = (key) => {
    console.info("Delete Entry");
    const index = entries.findIndex((e) => e.key === key);
    if (entries[index].hasOwnProperty("time")) {
      chrome.alarms.clear(key); // clearing alarm if it has time
    }
    setEntries((prevEntries) => {
      const updatedEntries = prevEntries.slice().splice(index, 1);
      return updatedEntries
    })
    actions
      .delete({ date: dateStamp, key })
      .then((result) => {
        console.info({ result });
      })
      .catch((e) => console.error(e));
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
            createEntry={createEntry}
            updateEntry={updateEntry}
            deleteEntry={deleteEntry}
            dateStamp={dateStamp}
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
        onClick={initEntry}
        // :value="dateStamp"
        className={styles.addButton}
      >
        +
      </button>
    </div>
  );
}

export default EntryList;
