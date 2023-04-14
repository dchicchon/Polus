import { useEffect, useState } from 'preact/hooks';
import { actions, entryMoved, generateId } from '../../utils/index';
import Entry from '../Entry/Entry';

import styles from './EntryList.module.scss';

function EntryList({ date, dateStamp }) {
  const [entries, setEntries] = useState([]);
  const [isOver, setIsOver] = useState(false);
  const initEntry = () => {
    console.info('initEntry');
    const key = generateId();
    let newEntry = {
      key,
      text: '',
      color: 'blue',
      active: false,
      new: true,
    };

    setEntries((prevEntries) => [...prevEntries, newEntry]);
  };
  const createEntry = (entry) => {
    const index = entries.findIndex((e) => e.key === entry.key);
    setEntries((prevEntries) => {
      const updatedEntries = prevEntries.slice();
      if (index >= 0) {
        delete updatedEntries[index].new;
      } else {
        updatedEntries.push(entry);
      }
      return updatedEntries;
    });
    actions
      .create({ date: dateStamp, entry, key: entry.key })
      .then((result) => {})
      .catch((e) => console.error(e));
  };
  const readEntries = () => {
    console.info('readEntries');
    actions
      .read({ date: dateStamp })
      .then((result) => {
        setEntries(result);
      })
      .catch((e) => console.error(e));
  };
  const updateEntry = (key, updatedEntry) => {
    console.info('updateEntry');
    // we should update the entries?
    const index = entries.findIndex((e) => e.key === key);
    setEntries((prevEntries) => {
      const updatedEntries = prevEntries.slice();
      updatedEntries[index] = updatedEntry;
      return updatedEntries;
    });
    actions
      .update({ date: dateStamp, entry: updatedEntry, key })
      .then((result) => {})
      .catch((e) => console.error(e));
  };
  const deleteEntry = (key) => {
    console.info('Delete Entry');
    const index = entries.findIndex((e) => e.key === key);
    if (entries[index].hasOwnProperty('time')) {
      chrome.alarms.clear(key); // clearing alarm if it has time
    }
    setEntries((prevEntries) => {
      const updatedEntries = prevEntries.slice();
      updatedEntries.splice(index, 1);
      return updatedEntries;
    });
    actions
      .delete({ date: dateStamp, key })
      .then((result) => {})
      .catch((e) => console.error(e));
  };
  const entryDragEnd = (event, key) => {
    console.log('entry drag end');
    if (entryMoved.value) {
      entryMoved.value = false;
      deleteEntry(key);
    }
  };
  const entryDragStart = (event, entry, originalDate) => {
    event.dataTransfer.setData('application/json', JSON.stringify(entry));
    event.dataTransfer.setData('date', originalDate);
    event.dataTransfer.setData('key', entry.key);
    event.dataTransfer.effectAllowed = 'move';
  };
  const onDrop = (event) => {
    setIsOver(false);
    const originalDate = event.dataTransfer.getData('date');
    if (originalDate === dateStamp) return;
    entryMoved.value = true;
    const entry = JSON.parse(event.dataTransfer.getData('application/json'));
    createEntry(entry);
  };
  const dragOver = (event) => {
    setIsOver(true);
    event.preventDefault();
    event.stopPropagation();
  };
  const dragLeave = (event) => {
    setIsOver(false);
  };
  useEffect(() => {
    readEntries();
  }, [date]);
  return (
    <div
      className={`${styles.details} ${isOver ? styles.over : ''}`}
      onDragOver={dragOver}
      onDragLeave={dragLeave}
      onDrop={onDrop}
    >
      <div
        // :style="todayDate"
        className={styles.dateTitle}
      >
        {date.getDate()}
      </div>

      <ul className={styles.entryList}>
        {entries.length > 0
          ? entries.map((entry) => (
              <Entry
                entryDragEnd={entryDragEnd}
                entryDragStart={entryDragStart}
                createEntry={createEntry}
                updateEntry={updateEntry}
                deleteEntry={deleteEntry}
                dateStamp={dateStamp}
                entry={entry}
              />
            ))
          : ''}
      </ul>
      <ul className={styles.entryList}></ul>

      <button onClick={initEntry} className={styles.addButton}>
        +
      </button>
    </div>
  );
}

export default EntryList;
