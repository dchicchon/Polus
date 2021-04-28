<template>
  <!-- New Entry -->
  <input
    v-model="newText"
    class="newEntry entry"
    :class="color"
    ref="newEntry"
    v-on:keypress.enter="submitEntry(newText, index)"
    v-if="entry.text.length === 0"
  />
  <!-- Not Active -->
  <li
    class="entry"
    :class="[color, { checked: entry.active }]"
    v-else-if="!active"
    @click="changeActive"
  >
    {{ entry.text }}
  </li>
  <!-- Active -->
  <li class="entry" :class="color" v-else @click="(e) => altChangeActive(e)">
    <div class="entry-container">
      <p class="text" :class="{ checked: entry.active }">{{ entry.text }}</p>
      <select @change="(e) => colorEntry(e)" class="color" v-model="color">
        <option
          v-for="(option, index) in colorOptions"
          :value="option"
          :key="index"
        >
          {{ option }}
        </option>
      </select>
      <button @click="editEntry" class="edit">Edit</button>
      <button @click="() => checkEntry(index)" class="check">&#10003;</button>
      <button @click="() => deleteEntry(index)" class="delete">x</button>
    </div>
  </li>
</template>

<style lang="scss">
$tool-hover: rgba(38, 96, 134, 0.76);

.checked {
  text-decoration: line-through;
}
.entry {
  width: 90%;
  text-align: center;
  white-space: nowrap;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  border: none;
  touch-action: none;
  user-select: none;
  transition: background 0.5s, height 0.25s;
  color: white;
  margin: 0.25rem auto;
  padding: 0.5rem;
  border-radius: 25px;
  font-size: 0.9rem;
  cursor: pointer;

  .newEntry {
    border: none;
    width: 85%;
    margin-block-start: 1em;
    margin-block-end: 1em;
    float: left;
    background: none;
    color: white;
    text-overflow: ellipsis;
    text-align: center;
    &:focus {
      border: none;
      outline: none;
    }
  }
}
.edit {
  background: none;
  transition: background 0.5s;
}
.edit:hover {
  background: $tool-hover;
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
  background: none;
  text-align: center;
  width: 25px;
  height: 25px;
  font-size: 0.9rem;
  border-radius: 100%;
  margin-left: 5px;
  padding: 0 0.5rem;
  transition: background 0.5s;
}

.delete:hover {
  background: $tool-hover;
}

.check {
  text-align: center;
  width: 27px;
  height: 25px;
  font-size: 0.9rem;
  border-radius: 100%;
  margin-left: 5px;
  padding: 0 0.5rem;
  background: none;
  transition: background 0.5s;
}

.check:hover {
  background: $tool-hover;
}
</style>

<script>
export default {
  props: {
    entry: {
      required: true,
      type: Object,
    },
    index: {
      required: true,
      type: Number,
    },
    checkEntry: {
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
    listDate: {
      required: true,
      type: Date,
    },
  },
  data() {
    return {
      active: false,
      newText: "",
    };
  },
  // One of the first functions to execute on the render method
  created() {
    // this.color = this.entry.color;
  },
  // This will execute when the component is built on the DOM
  mounted() {
    if (this.$refs.newEntry) this.$refs.newEntry.focus();
  },
  methods: {
    altChangeActive(e) {
      // console.log(e.target.className);
      if (
        e.target.classList.contains("text") ||
        e.target.classList.contains("entry") ||
        e.target.classList.contains("entry-container")
      )
        this.active = false;
    },
    changeActive() {
      this.active = true;
    },

    colorEntry() {
      console.log();
    },
    editEntry() {
      console.log("Edit");
    },
  },
  computed: {
    color: {
      get() {
        return this.entry.color;
      },
      set(newValue) {
        // console.log(newValue);
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
