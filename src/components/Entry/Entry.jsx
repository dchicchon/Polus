import { useEffect, useRef, useState } from 'preact/hooks';
import styles from './Entry.module.scss';

const entryModes = {
  NEW: "NEW",
  INACTIVE: "INACTIVE",
  ACTIVE: "ACTIVE",
  EDIT: "EDIT",
  COLOR: "COLOR",
}
const colorOptions = ["blue", "green", "gold", "purple", "orange", "red"];
function Entry({ date, entry }) {

  const [mode, setMode] = useState(entryModes.INACTIVE);
  const editRef = useRef(null);

  const changeMode = (event, newMode) => {
    event.stopPropagation();
    console.log({ newMode })
    // lets prevent the mode from going to inactive?
    setMode(newMode);
  }

  const selectColor = () => {
    console.log('submit color')
  }

  const submitEdit = () => {
    console.log('submit edit')
  }

  useEffect(() => {
    if (entry.new && mode !== entryModes.NEW) {
      setMode(entryModes.NEW)
    }
  }, [])

  if (mode === entryModes.NEW) {
    return (
      <textarea
        //   v-model="entry.text"
        className={`${styles.newEntry} ${styles.entry}`}
      //   :class="[entry.color, { checked: entry.active }]"
      //   v-if="entry.new"
      //   ref="newEntry"
      //   v-on:blur="createEntry(entry)"
      //   v-on:keydown.enter="$event.target.blur()"
      ></textarea>
    )

  }

  if (mode === entryModes.INACTIVE) {
    return (
      <li
        className={`${styles.entry} ${styles[entry.color]} ${styles[entry.active]}`}
        onClick={() => setMode(entryModes.ACTIVE)}
      //   :class="[entry.color, { checked: entry.active }]"
      //   @click="changeMode('menu')"
      >
        {entry.text}
      </li>
    )

  }

  return (
    <li
      className={`${styles.entry} ${styles[entry.color]}`}
      onClick={(e) => changeMode(e, entryModes.INACTIVE)}
    >
      <div className={styles.entry_container}>
        {mode !== entryModes.EDIT &&
          <p
            className="text"
          // :class="{ checked: entry.active }"
          >
            {entry.text}
          </p>
        }

        <textarea
          ref={editRef}
          className={`${styles.editEntry} ${entryModes.EDIT ? styles.show : styles.no_show}`}
          value={entry.text}
        ></textarea>

        <div class={styles.button_container}>
          <button
            onClick={(e) => changeMode(e, entryModes.COLOR)}
            disabled={mode === entryModes.COLOR}
            className={styles.entryBtn}
          >
            <img
              style={{ filter: 'invert(1)' }}
              alt="color"
              src="/assets/entry_icons/palette.png"
            />
            <select
              value=''
              onInput={(e) => selectColor(e.target.value)}
            >
              {colorOptions.map(color => (
                <option
                  value={color}
                  className={styles[entry.color]}
                >
                  {color}
                </option>
              ))}

            </select>
          </button>

          {/* <!-- Superimpose time and input on top of each other --> */}
          <div id="time-section">
            <img
              style={{ filter: 'invert(1)' }}
              alt="clock"
              src="/assets/entry_icons/clock.png"
            />
            <input
              className={styles.entryBtn}
              //   v-model="time"
              //   @mouseup="changeTimeMode"
              //   @input="selectTime"
              placeholder="none"
              //   ref="time"
              type="time"
            />
          </div>

          {mode === entryModes.EDIT ?
            <button
              onClick={(e) => {
                changeMode(e, entryModes.ACTIVE)
                submitEdit();
              }}
              className={styles.entryBtn}
            >
              <img
                style={{ filter: 'invert(1)' }}
                alt="save"
                src="/assets/entry_icons/save.png"
              />
            </button> :
            <button
              onClick={(e) => {
                changeMode(e, entryModes.EDIT)
                editRef.current.focus();
              }}
              className={styles.entryBtn}
            >
              <img
                style={{ filter: 'invert(1)' }}
                alt="edit"
                src="/assets/entry_icons/edit.png"
              />
            </button>
          }



          {/* <!-- Check Entry --> */}
          <button
            //    @click="checkEntry"
            className={styles.entryBtn}
          >
            <img
              style={{ filter: 'invert(1)' }}

              alt="done"
              src="/assets/entry_icons/done.png"
            />
          </button>
          {/* <!-- Delete Entry --> */}
          <button
            //   @click="() => deleteEntry(entry.key)"
            className={styles.entryBtn}
          >
            <img
              style={{ filter: 'invert(1)' }}
              alt="delete"
              src="/assets/entry_icons/delete.png"
            />
          </button>
        </div>
      </div>
    </li>
  );




}

export default Entry;
