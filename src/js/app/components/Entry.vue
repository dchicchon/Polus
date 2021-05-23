<template>
  <!-- New Entry -->
  <!-- <transition name="fade" v-if="entry.text.length === 0"> -->
  <textarea
    v-model="newText"
    class="newEntry entry"
    :class="[entry.color, { checked: entry.active }]"
    v-if="entry.text.length === 0"
    ref="newEntry"
    v-on:blur="submitEntry(newText, entry.key)"
    v-on:keypress.enter="submitEntry(newText, entry.key)"
  >
  </textarea>
  <!-- </transition> -->
  <!-- Not Active -->
  <li
    v-else-if="!active"
    class="entry"
    :class="[entry.color, { checked: entry.active }]"
    @click="changeActive"
    draggable
    @dragstart="dragStart($event, entry, $parent._uid)"
  >
    <!-- @dragend="dragEnd($event, entry.key)" -->
    {{ entry.text }}
  </li>
  <!-- Active -->
  <li
    v-else
    class="entry"
    :class="entry.color"
    @click="(e) => altChangeActive(e)"
    draggable
    @dragstart="dragStart($event, entry, $parent._uid)"
  >
    <div class="entry-container">
      <p class="text" v-if="mode !== 'edit'" :class="{ checked: entry.active }">
        {{ entry.text }}
      </p>
      <textarea
        v-model="newText"
        :class="textClass"
        ref="textarea"
        class="editEntry"
      ></textarea>
      <!-- There is space here -->
      <div class="entryBtnContainer">
        <!-- Color -->
        <button
          @click="changeMode('color')"
          :class="[mode === 'color' ? 'activeBtn' : '', 'entryBtn']"
        >
          <span class="material-icons md-21"> palette </span>
          <select
            style="cursor: pointer"
            :value="''"
            @input="selectColor($event.target.value)"
          >
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
        <!-- Time -->
        <button
          @mousedown="changeMode('time')"
          @mouseup="hideTime()"
          :class="[mode === 'time' ? 'activeBtn' : '', 'entryBtn']"
        >
          <!-- only activates clock on mouseup -->
          <span class="material-icons md-21"> schedule </span>
          <input
            v-model="time"
            @blur="blur()"
            @input="selectTime()"
            placeholder="none"
            ref="time"
            type="time"
          />
        </button>
        <!-- Edit -->
        <button
          v-if="mode === 'edit'"
          @click="submitEdit(newText, entry.key)"
          class="entryBtn"
        >
          <span class="material-icons md-21"> save </span>
        </button>

        <button v-if="mode !== 'edit'" @click="editEntry" class="entryBtn">
          <span class="material-icons md-21">mode_edit</span>
        </button>

        <button @click="() => checkEntry(entry.key)" class="entryBtn">
          <span class="material-icons md-21"> done </span>
        </button>
        <button @click="() => deleteEntry(entry.key)" class="entryBtn">
          <span class="material-icons md-21"> delete </span>
        </button>
      </div>
    </div>
  </li>
</template>
<script>
export default {
  props: {
    checkEntry: {
      required: true,
      type: Function,
    },
    colorEntry: {
      required: true,
      type: Function,
    },
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
      required: true,
    },
    submitEntry: {
      required: true,
      type: Function,
    },
    timeEntry: {
      required: true,
      type: Function,
    },
  },
  data() {
    return {
      active: false,
      newText: "",
      mode: "",
      time: "",
    };
  },

  // One of the first functions to execute on the render method
  created() {
    this.time = this.entry.time ? this.entry.time : "12:00";
  },
  // This will execute when the component is built on the DOM
  mounted() {
    if (this.$refs.newEntry) this.$refs.newEntry.focus();
  },
  methods: {
    makeNotification() {
      chrome.notifications.clear("test");
      chrome.notifications.create("test", {
        message: "hello",
        type: "basic",
        title: "Polus",
        iconUrl: "/assets/polus_icon.png",
      });
      // chrome.notifications.onClosed.addListener();
    },

    altChangeActive(e) {
      if (
        e.target.classList.contains("text") ||
        e.target.classList.contains("entry") ||
        e.target.classList.contains("entry-container") ||
        e.target.classList.contains("entryBtnContainer")
      ) {
        this.active = false;
        this.mode = "";
      }
    },

    blur() {
      this.mode = "";
    },

    changeMode(type) {
      if (type === "time" && this.mode === "time") {
        this.$refs.time.style.display = "none";
        this.mode = "";
      } else if (this.mode === type) this.mode = "";
      else this.mode = type;
    },
    changeActive() {
      this.active = true;
    },
    editEntry() {
      this.mode = "edit";
      this.$refs.textarea.focus();
      this.newText = this.entry.text;
    },

    hideTime() {
      if (this.mode === "") {
        this.$refs.time.style.display = "inline-block";
      }
    },

    selectColor(color) {
      if (color !== this.entry.color) {
        this.entry.color = color;
        this.colorEntry();
      }
    },

    selectTime() {
      if (this.time !== this.entry.time) {
        this.entry.time = this.time;
        let eventDate = new Date(this.listDate);
        let hours = parseInt(this.time[0] + this.time[1]);
        let minutes = parseInt(this.time[3] + this.time[4]);
        eventDate.setSeconds(0);
        eventDate.setHours(hours);
        eventDate.setMinutes(minutes);
        const ms = eventDate.getTime() - Date.now();
        // if alarm is in the future
        if (ms > 0) {
          // Check if notifications are allowed
          chrome.permissions.contains(
            {
              permissions: ["notifications"],
            },
            (result) => {
              // If allowed, create an alarm for this entry
              if (result) {
                chrome.alarms.create(this.entry.key, {
                  when: eventDate.getTime(),
                });
              }
            }
          );
        }
        // We can use this to check if notifications have been enabled so that we can show the user

        this.timeEntry();
      }

      // Add this.timeEntry() later
    },

    submitEdit() {
      this.mode = "";
      this.submitEntry(this.newText, this.entry.key);
    },
  },

  computed: {
    textClass: {
      get() {
        return this.mode === "edit" ? "show" : "no-show";
      },
    },

    btnClass() {},
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
  border: none;
  background: none;
  color: white;
  width: 25px;
  height: 25px;
  transform: translateY(-25px);

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
      // width: 100%;
      padding: 0;
      margin-block-start: 1em;
      margin-block-end: 1em;
      // margin-block-start: 1em;
      // margin-block-end: 1em;
      float: left;
      background: none;
      color: white;
      text-overflow: ellipsis;
      text-align: center;
      &.show {
        opacity: 1;
        // height: fit-content;
        // margin: 0 auto;
        // padding-block-start: 1em;
        // padding-block-end: 1em;
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
  // width: 10% !important;
  transition: none;
  margin: 0.25rem auto;
  // margin-block-start: 1em;
  // margin-block-end: 1em;
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
  display: inline-block;
  position: relative;
}

@keyframes grow {
  from {
    width: 10%;
  }
  to {
    width: 90%;
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
