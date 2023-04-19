import { useEffect, useState } from 'preact/hooks';
import { actions, entryMoved, generateId } from '../../utils/index';
import Entry from '../Entry/Entry';

import styles from './EntryList.module.scss';

function EntryList({ date, dateStamp }) {
  const [entries, setEntries] = useState([]);
  const [isOver, setIsOver] = useState(false);
  const initEntry = () => {
    console.debug('initEntry');
    const key = generateId();
    const newEntry = {
      key,
      text: '',
      color: 'blue',
      active: false,
      new: true,
    };
    setEntries((prevEntries) => [...prevEntries, newEntry]);
  };
  const createEntry = (entry) => {
    console.debug('createEntry');
    const index = entries.findIndex((e) => e.key === entry.key);
    setEntries((prevEntries) => {
      const updatedEntries = prevEntries.slice();
      if (index >= 0) {
        delete updatedEntries[index].new;
        updatedEntries[index].text = entry.text;
        // we have to update the entry here
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
  const updateEntry = (key, updates) => {
    console.debug('updateEntry');
    // we should update the entries?
    const index = entries.findIndex((e) => e.key === key);
    setEntries((prevEntries) => {
      const updatedEntries = prevEntries.slice();
      updatedEntries[index] = {
        ...updatedEntries[index],
        ...updates,
      };
      const updatedEntry = updatedEntries[index];
      actions
        .update({ date: dateStamp, entry: updatedEntry, key })
        .then((result) => {})
        .catch((e) => console.error(e));
      return updatedEntries;
    });
  };
  const deleteEntry = (key, wasDragged) => {
    console.debug('deleteEntry');
    const index = entries.findIndex((e) => e.key === key);
    if (entries[index].hasOwnProperty('time') && !wasDragged) {
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
    console.debug('entryDragEnd');
    if (entryMoved.value) {
      entryMoved.value = false;
      deleteEntry(key, true);
    }
  };
  const entryDragStart = (event, entry, originalDate) => {
    console.debug('entryDragStart');
    event.dataTransfer.setData('application/json', JSON.stringify(entry));
    event.dataTransfer.setData('date', originalDate);
    event.dataTransfer.setData('key', entry.key);
    event.dataTransfer.effectAllowed = 'move';
  };
  const onDrop = async (event) => {
    console.debug('onDrop');
    setIsOver(false);
    const originalDate = event.dataTransfer.getData('date');
    if (originalDate === dateStamp) return;
    entryMoved.value = true;
    const entry = JSON.parse(event.dataTransfer.getData('application/json'));
    createEntry(entry);
    const hasNotifications = await actions.hasNotifications();
    if (entry.time && hasNotifications) {
      const entryDate = new Date(dateStamp.replace(/_/g, '/'));
      const hours = parseInt(entry.time[0] + entry.time[1]);
      const minutes = parseInt(entry.time[3] + entry.time[4]);
      entryDate.setSeconds(0);
      entryDate.setHours(hours);
      entryDate.setMinutes(minutes);
      const ms = entryDate.getTime() - Date.now();
      if (ms > 0) {
        actions.createNotification({
          name: entry.key,
          time: entryDate.getTime(),
        });
      }
      // lets create the notification for the new date
    }
  };
  const dragOver = (event) => {
    console.debug('dragOver');
    setIsOver(true);
    event.preventDefault();
    event.stopPropagation();
  };
  const dragLeave = (event) => {
    console.debug('dragLeave');
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
