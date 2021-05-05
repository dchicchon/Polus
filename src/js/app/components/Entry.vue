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
    @dragstart="dragStart($event, entry)"
    @dragend="dragEnd($event, entry.key)"
  >
    {{ entry.text }}
  </li>
  <!-- Active -->
  <li
    v-else
    class="entry"
    :class="entry.color"
    @click="(e) => altChangeActive(e)"
    draggable
    @dragstart="dragStart($event, entry)"
  >
    <!-- @dragend="dragEnd($event, entry.key)" -->
    <div class="entry-container">
      <textarea
        v-model="newText"
        :class="textClass"
        ref="textarea"
        class="editEntry"
      ></textarea>

      <p v-if="!editing" class="text" :class="{ checked: entry.active }">
        {{ entry.text }}
      </p>
      <!-- There is space here -->
      <div class="entryBtnContainer">
        <button
          v-if="editing"
          @click="submitEdit(newText, entry.key)"
          class="edit"
        >
          Submit
        </button>
        <button v-if="!editing" @click="editEntry" class="edit">Edit</button>

        <select
          @change="colorEntry(index)"
          class="select"
          v-model="entry.color"
        >
          <option
            v-for="(option, index) in colorOptions"
            :value="option"
            :key="index"
            :class="entry.color"
          >
            {{ option }}
          </option>
        </select>

        <button @click="() => checkEntry(entry.key)" class="check">
          &#10003;
        </button>
        <button @click="() => deleteEntry(entry.key)" class="delete">x</button>
      </div>
    </div>
  </li>
</template>
<script>
export default {
  props: {
    entry: {
      required: true,
      type: Object,
    },
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
    submitEntry: {
      required: true,
      type: Function,
    },
    dragStart: {
      required: false,
      type: Function,
    },
    dragEnd: {
      required: false,
      type: Function,
    },
    listDate: {
      required: true,
      type: Date,
    },
  },
  data() {
    return {
      active: false,
      newText: "",
      editing: false,
      moving: false,
    };
  },
  // One of the first functions to execute on the render method
  // created() {},
  // This will execute when the component is built on the DOM
  mounted() {
    if (this.$refs.newEntry) this.$refs.newEntry.focus();
  },
  methods: {
    altChangeActive(e) {
      if (
        e.target.classList.contains("text") ||
        e.target.classList.contains("entry") ||
        e.target.classList.contains("entry-container")
      ) {
        console.log("Deactive");
        this.active = false;
      }
    },
    changeActive() {
      console.log("Make Active");
      this.active = true;
    },
    editEntry() {
      this.editing = true;
      this.$refs.textarea.focus();
      this.newText = this.entry.text;
    },
    submitEdit() {
      this.editing = false;
      this.submitEntry(this.newText, this.entry.key);
    },
  },
  computed: {
    textClass: {
      get() {
        return this.editing ? "show" : "no-show";
      },
    },
    colorOptions: {
      get() {
        return ["blue", "green", "gold", "purple", "orange", "red", "cyan"];
      },
    },
  },
};
</script>

<style scoped lang="scss">
$brightness: 100%;

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

.select {
  background: none;
  border: none;
  outline: none;
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
  // transition: background 0.5s;
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
      resize: none;
      border: none;
      width: 85%;
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
        margin: 0 auto;
        padding-block-start: 1em;
        padding-block-end: 1em;
      }
      &.no-show {
        margin: 0 auto;
        opacity: 0;
        height: 0;
      }
    }
    .entryBtn {
      background: none;
      transition: background 0.5s;
      &:hover {
        background: #2a2a2a73;
        filter: brightness($brightness);
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

.edit {
  @extend .entryBtn;
  border-radius: 10%;
}

@keyframes grow {
  from {
    width: 10%;
  }
  to {
    width: 90%;
  }
}

.color {
  background: none;
  border: none;
  color: white;
}

.color-option {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 99;
}

.color:after {
  position: absolute;
  content: "";
  top: 14px;
  right: 10px;
  width: 0;
  height: 0;
  border: 6px solid transparent;
  border-color: #fff transparent transparent transparent;
}

.delete {
  @extend .entryBtn;
  text-align: center;
  width: 25px;
  height: 25px;
  font-size: 0.9rem;
  border-radius: 100%;
  margin-left: 5px;
  padding: 0 0.5rem;
}

.check {
  @extend .entryBtn;
  text-align: center;
  width: 27px;
  height: 25px;
  font-size: 0.9rem;
  border-radius: 100%;
  margin-left: 5px;
  padding: 0 0.5rem;
}

select {
  color: white;
  outline: none;
  border: none;
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
