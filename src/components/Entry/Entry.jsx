import { useState } from 'preact/hooks';
import styles from './Entry.module.scss';

function Entry({ entry }) {
  if (entry.new) {
    <textarea
      //   v-model="entry.text"
      className={`${styles.newEntry} ${styles.entry}`}
      //   :class="[entry.color, { checked: entry.active }]"
      //   v-if="entry.new"
      //   ref="newEntry"
      //   v-on:blur="createEntry(entry)"
      //   v-on:keydown.enter="$event.target.blur()"
    ></textarea>;
  }
  return (
    <>
      {/* <!-- New Entry --> */}

      {/* <!-- End New Entry --> */}

      {/* <!-- Inactive Entry (fade-in  was added previously but it looked a little funny) --> */}
      <li
        //   v-else-if="mode === ''"
        className="entry"
        //   :class="[entry.color, { checked: entry.active }]"
        //   @click="changeMode('menu')"
      >
        {/* { entry.text } */}
      </li>
      {/* <!-- End Inactive Entry --> */}

      {/* <!-- Its the fact that it's getting rerendered --> */}
      {/* <!-- Active --> */}
      <li
        //   v-else
        className="entry"
        //   :class="[entry.color]"
        //   @click="(e) => altChangeActive(e)"
      >
        <div className="entry-container">
          <p
            className="text"
            // v-if="mode !== 'edit'"
            // :class="{ checked: entry.active }"
          >
            {/* // {entry.text} */}
          </p>

          {/* // <!-- Begin Edit Entry TextArea --> */}
          <textarea
            //   v-model="newText"
            //   :class="textClass"
            //   ref="textarea"
            class="editEntry"
          ></textarea>
          {/* <!-- Begin Edit Entry TextArea --> */}

          {/* <!-- Button Container --> */}
          <div class="button-container">
            {/* <!-- Color --> */}
            <button
              // @click="changeMode('color')"
              // :disabled="mode === 'color'"
              class="entryBtn"
            >
              <img
                //   :style="{ filter: 'invert(1)' }"
                alt="color"
                src="/assets/entry_icons/palette.png"
              />
              <select
              // :value="''"
              // @input="selectColor($event.target.value)"
              >
                <option
                // v-for="(option, index) in colorOptions"
                // :value="option"
                // :key="index"
                // :class="option"
                >
                  {/* { option } */}
                </option>
              </select>
            </button>

            {/* <!-- Begin Time --> */}
            {/* <!-- Superimpose time and input on top of each other --> */}
            <div id="time-section">
              <img
                //   :style="{ filter: 'invert(1)' }"
                alt="clock"
                src="/assets/entry_icons/clock.png"
              />
              <input
                className="entryBtn"
                //   v-model="time"
                //   @mouseup="changeTimeMode"
                //   @input="selectTime"
                placeholder="none"
                //   ref="time"
                type="time"
              />
            </div>

            {/* <!-- End Time --> */}

            {/* <!-- Save Edit --> */}
            <button
              //   v-if="mode === 'edit'"
              //   @click="submitEdit"
              className="entryBtn"
            >
              <img
                //   :style="{ filter: 'invert(1)' }"
                alt="save"
                src="/assets/entry_icons/save.png"
              />
            </button>
            {/* <!-- Begin Edit --> */}
            <button
              //    v-if="mode !== 'edit'"
              // @click="editEntry"
              className="entryBtn"
            >
              <img
                //   :style="{ filter: 'invert(1)' }"
                alt="edit"
                src="/assets/entry_icons/edit.png"
              />
            </button>

            {/* <!-- Check Entry --> */}
            <button
              //    @click="checkEntry"
              className="entryBtn"
            >
              <img
                //   :style="{ filter: 'invert(1)' }"
                alt="done"
                src="/assets/entry_icons/done.png"
              />
            </button>
            {/* <!-- Delete Entry --> */}
            <button
              //   @click="() => deleteEntry(entry.key)"
              className="entryBtn"
            >
              <img
                //   :style="{ filter: 'invert(1)' }"
                alt="delete"
                src="/assets/entry_icons/delete.png"
              />
            </button>
          </div>
        </div>
      </li>
    </>
  );
}

export default Entry;
