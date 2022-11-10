<template>
  <!-- New Entry -->
  <textarea
    v-model="entry.text"
    class="newEntry entry"
    :class="[entry.color, { checked: entry.active }]"
    v-if="entry.new"
    ref="newEntry"
    v-on:blur="createEntry(entry)"
    v-on:keydown.enter="$event.target.blur()"
  >
  </textarea>
  <!-- End New Entry -->

  <!-- Inactive Entry (fade-in  was added previously but it looked a little funny) -->
  <li
    v-else-if="mode === ''"
    class="entry"
    :class="[entry.color, { checked: entry.active }]"
    @click="changeMode('menu')"
  >
    {{ entry.text }}
  </li>
  <!-- End Inactive Entry -->

  <!-- Its the fact that it's getting rerendered -->
  <!-- Active -->
  <li
    v-else
    class="entry"
    :class="[entry.color]"
    @click="(e) => altChangeActive(e)"
  >
    <div class="entry-container">
      <p class="text" v-if="mode !== 'edit'" :class="{ checked: entry.active }">
        {{ entry.text }}
      </p>

      <!-- Begin Edit Entry TextArea -->
      <textarea
        v-model="newText"
        :class="textClass"
        ref="textarea"
        class="editEntry"
      ></textarea>
      <!-- Begin Edit Entry TextArea -->

      <!-- Button Container -->
      <div class="button-container">
        <!-- Color -->
        <button
          @click="changeMode('color')"
          :disabled="mode === 'color'"
          class="entryBtn"
        >
          <img
            :style="{ filter: 'invert(1)' }"
            alt="color"
            src="/assets/entry_icons/palette.png"
          />
          <select :value="''" @input="selectColor($event.target.value)">
            <option
              v-for="(option, index) in colorOptions"
              :value="option"
              :key="index"
              :class="option"
            >
              {{ option }}
            </option>
          </select>
        </button>

        <!-- Begin Time -->
        <!-- Superimpose time and input on top of each other -->
        <div id="time-section">
          <img
            :style="{ filter: 'invert(1)' }"
            alt="clock"
            src="/assets/entry_icons/clock.png"
          />
          <input
            class="entryBtn"
            v-model="time"
            @mouseup="changeTimeMode"
            @input="selectTime"
            placeholder="none"
            ref="time"
            type="time"
          />
        </div>

        <!-- End Time -->

        <!-- Save Edit -->
        <button v-if="mode === 'edit'" @click="submitEdit" class="entryBtn">
          <img
            :style="{ filter: 'invert(1)' }"
            alt="save"
            src="/assets/entry_icons/save.png"
          />
        </button>
        <!-- Begin Edit -->
        <button v-if="mode !== 'edit'" @click="editEntry" class="entryBtn">
          <img
            :style="{ filter: 'invert(1)' }"
            alt="edit"
            src="/assets/entry_icons/edit.png"
          />
        </button>

        <!-- Check Entry -->
        <button @click="checkEntry" class="entryBtn">
          <img
            :style="{ filter: 'invert(1)' }"
            alt="done"
            src="/assets/entry_icons/done.png"
          />
        </button>
        <!-- Delete Entry -->
        <button @click="() => deleteEntry(entry.key)" class="entryBtn">
          <img
            :style="{ filter: 'invert(1)' }"
            alt="delete"
            src="/assets/entry_icons/delete.png"
          />
        </button>
      </div>
      <!-- End Button Container -->
    </div>
  </li>
  <!-- End Active Entry -->
</template>
<script>
import { actions } from "../utils";
export default {
  props: {
    deleteEntry: {
      required: true,
      type: Function,
    },
    dragStart: {
      required: false,
      type: Function,
    },
    entry: {
      required: true,
      type: Object,
    },
    listDate: {
      type: Date,
      // required: true,
    },
    createEntry: {
      type: Function,
      required: true,
    },
    updateEntry: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      time: "",
      newText: "",
      mode: "",
    };
  },
  created() {
    console.log("Created");
    this.time = this.entry.time || "";
  },
  mounted() {
    if (this.$refs.newEntry) this.$refs.newEntry.focus(); // add focus on new entry textarea
  },
  methods: {
    altChangeActive(e) {
      if (
        e.target.classList.contains("text") ||
        e.target.classList.contains("entry") ||
        e.target.classList.contains("entry-container") ||
        e.target.classList.contains("entryBtnContainer")
      ) {
        this.changeMode("");
      }
    },
    changeTimeMode() {
      if (this.mode !== "time") {
        this.changeMode("time");
      } else {
        this.$refs.time.style.display = "none";
        this.changeMode("menu");
        setTimeout(() => (this.$refs.time.style.display = "block"), 1);
      }
    },
    changeMode(type) {
      this.mode = type;
    },
    selectColor(color) {
      if (color !== this.entry.color) {
        this.entry.color = color;
        this.changeMode("menu");
        this.updateEntry(this.entry.key);
      }
    },
    selectTime() {
      console.log("select time");
      console.log(this.time);
      if (!this.entry.time) {
        console.log("There is no time entry here");
        let eventDate = new Date(this.listDate);
        let hours = parseInt(this.time[0] + this.time[1]);
        let minutes = parseInt(this.time[3] + this.time[4]);
        eventDate.setSeconds(0);
        eventDate.setHours(hours);
        eventDate.setMinutes(minutes);
        const ms = eventDate.getTime() - Date.now();
        if (ms > 0) {
          console.log("Create the alarm");
          actions.createAlarm({
            name: this.entry.key,
            time: eventDate.getTime(),
          });
        }
      }
      // if (this.time !== this.entry.time) {
      //   this.entry.time = this.time;
      //   let eventDate = new Date(this.listDate);
      //   let hours = parseInt(this.time[0] + this.time[1]);
      //   let minutes = parseInt(this.time[3] + this.time[4]);
      //   eventDate.setSeconds(0);
      //   eventDate.setHours(hours);
      //   eventDate.setMinutes(minutes);
      //   const ms = eventDate.getTime() - Date.now();
      //   if (ms > 0) {
      //     actions.createAlarm({
      //       name: this.entry.key,
      //       time: eventDate.getTime(),
      //     });
      //   }
      //   // we should remove the previous alarm set
      //   // We can use this to check if notifications have been enabled so that we can show the user
      // }
    },
    submitTime() {
      this.changeMode("menu");
    },
    // saveTime() {
    //   this.newTime = this.entry.time ? this.entry.time : "12:00";
    //   if (this.newTime !== this.time) {
    //     this.entry.time = this.time;
    //     let eventDate = new Date(this.listDate);
    //     let hours = parseInt(this.time[0] + this.time[1]);
    //     let minutes = parseInt(this.time[3] + this.time[4]);
    //     eventDate.setSeconds(0);
    //     eventDate.setHours(hours);
    //     eventDate.setMinutes(minutes);
    //     const ms = eventDate.getTime() - Date.now();
    //     // if alarm is in the future
    //     if (ms > 0) {
    //       // Check if notifications are allowed
    //       chrome.permissions.contains(
    //         {
    //           permissions: ["notifications"],
    //         },
    //         (result) => {
    //           // If allowed, create an alarm for this entry
    //           if (result) {
    //             chrome.alarms.create(this.entry.key, {
    //               when: eventDate.getTime(),
    //             });
    //           }
    //         }
    //       );
    //     }
    //     // We can use this to check if notifications have been enabled so that we can show the user
    //     this.updateEntry(this.entry.key);
    //   }

    // Add this.timeEntry() later
    // },
    checkEntry() {
      this.entry.active = !this.entry.active;
      this.updateEntry(this.entry.key);
    },
    editEntry() {
      this.mode = "edit";
      this.$refs.textarea.focus();
      this.newText = this.entry.text;
    },
    submitEdit() {
      this.mode = "";
      if (this.newText !== this.entry.text) {
        this.entry.text = this.newText;
        this.newText = "";
        this.updateEntry(this.entry.key);
      }
    },
  },

  computed: {
    textClass: {
      get() {
        return this.mode === "edit" ? "show" : "no-show";
      },
    },

    colorOptions: {
      get() {
        return ["blue", "green", "gold", "purple", "orange", "red"];
      },
    },
  },
};
</script>

<style scoped lang="scss">
$brightness: 100%;

// Modify semantic tags here
textarea {
  font-family: "Segoe UI", Tahoma, sans-serif;
  resize: none;
  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-thumb {
    width: 10px;
    border: 4px solid rgba(0, 0, 0, 0);
    background-clip: padding-box;
    background-color: #fff;
    transition: background 0.5s;
    box-shadow: inset -1px -1px 0px rgb(0 0 0 / 5%),
      inset 1px 1px 0px rgb(0 0 0 / 5%);
    border-radius: 25px;
  }
  &::-webkit-scrollbar-button {
    width: 0;
    height: 0;
    display: none;
  }
}

input[type="time"] {
  display: block;
  position: absolute;
  padding-inline-start: 0px;
  border: none;
  background: none;
  color: white;
  width: 25px;
  height: 25px;
  transform: translateY(-28px);

  // clock
  &::-webkit-calendar-picker-indicator {
    display: flex;
    cursor: pointer;
    width: 25px;
    height: 25px;
    background: none;
    padding: 0px;
    margin: 0px;
  }

  /* Wrapper around the hour, minute, second, and am/pm fields as well as 
the up and down buttons and the 'X' button */
  &::-webkit-datetime-edit-fields-wrapper {
    // display: flex;
    display: none;
  }
  /* The space between the fields - between hour and minute, the minute and 
second, second and am/pm */
  &::-webkit-datetime-edit-text {
    display: none;
    // padding: 19px 4px;
  }

  /* The naming convention for the hour, minute, second, and am/pm field is
`-webkit-datetime-edit-{field}-field` */

  /* Hour */
  &::-webkit-datetime-edit-hour-field {
    background: rgb(56 147 200 / 75%);
    border-radius: 15%;
    color: #fff;
  }

  /* Minute */
  &::-webkit-datetime-edit-minute-field {
    background: rgb(56 147 200 / 75%);
    border-radius: 15%;
    color: #fff;
  }

  /* AM/PM */
  &::-webkit-datetime-edit-ampm-field {
    background: rgb(56 147 200 / 75%);
    border-radius: 15%;
    display: none;
    color: #fff;
  }

  /* 'X' button for resetting/clearing time */
  &::-webkit-clear-button {
    display: none;
  }

  /* Up/Down arrows for incrementing/decrementing the value */
  &::-webkit-inner-spin-button {
    display: none;
  }
}

select {
  color: transparent;
  -webkit-appearance: none;
  -moz-appearance: none;
  text-indent: 1px;
  text-overflow: "";
  height: 25px;
  position: absolute;
  background: none;
  border: none;
  outline: none;
  // width:100%;
  width: 25px;
  transform: translateX(-23px);
}

select option {
  margin: 40px;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.4);
}

.checked {
  text-decoration: line-through;
}

.entry {
  width: 90%;
  text-align: center;
  white-space: normal;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  border: none;
  touch-action: none;
  user-select: none;
  // transition: background 0.5s, height 0.25s;
  transition: background 0.5s;
  color: white;
  margin: 0.25rem auto;
  padding: 0.5rem;
  border-radius: 25px;
  font-size: 0.9rem;
  cursor: pointer;

  .entry-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    .editEntry {
      font-family: "Segoe UI", Tahoma, sans-serif !important;
      border: none;
      padding: 0;
      margin-block-start: 1em;
      margin-block-end: 1em;
      float: left;
      background: none;
      color: white;
      text-overflow: ellipsis;
      height: 60px;
      &.show {
        opacity: 1;
      }
      &.no-show {
        margin: 0 auto;
        opacity: 0;
        height: 0;
      }
    }
  }
}

.newEntry {
  transition: none;
  margin: 0.25rem auto;
  float: left;

  animation-name: "grow";
  animation-fill-mode: forwards;
  animation-duration: 0.25s;

  &:focus {
    border: none;
    outline: none;
  }
}

.entryBtn {
  background: none;
  transition: background 0.5s;
  padding: 0;
  width: 25px;
  height: 25px;
  font-size: 0.9rem;
  border-radius: 100%;
  &:hover {
    // background: #00000073;
    background: #2a2a2a73;
    filter: brightness($brightness);
  }
}

.activeBtn {
  color: rgb(0 0 0 / 0.69);
}

.button-container {
  display: flex;
  justify-content: space-evenly;
}

@keyframes grow {
  from {
    width: 10%;
  }
  to {
    width: 90%;
  }
}

.fade-in {
  animation-name: "fadeIn";
  animation-fill-mode: forwards;
  animation-duration: 0.25s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.75;
  }
}

// COLORS
.blue {
  background: rgba(21, 115, 170, 0.75);
}

.green {
  background: rgba(7, 128, 7, 0.75);
}

.gold {
  background: rgba(185, 174, 8, 0.75);
}

.purple {
  background: rgba(122, 39, 138, 0.75);
}

.orange {
  background: rgba(251, 119, 5, 0.75);
}

.red {
  background: rgba(220, 5, 5, 0.75);
}

.cyan {
  background: rgba(0, 220, 255, 0.75);
}
</style>
