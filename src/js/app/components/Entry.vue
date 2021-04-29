<template>
  <!-- New Entry -->
  <input
    v-model="newText"
    class="newEntry entry"
    :class="[entry.color, { checked: entry.active }]"
    ref="newEntry"
    v-on:blur="submitEntry(newText, index)"
    v-on:keypress.enter="submitEntry(newText, index)"
    v-if="entry.text.length === 0"
  />
  <!-- Not Active -->
  <li
    class="entry"
    :class="[entry.color, { checked: entry.active }]"
    v-else-if="!active"
    @click="changeActive"
  >
    {{ entry.text }}
  </li>
  <!-- Active -->
  <li
    class="entry"
    :class="entry.color"
    v-else
    @click="(e) => altChangeActive(e)"
  >
    <div class="entry-container">
      <p class="text" :class="{ checked: entry.active }">{{ entry.text }}</p>
      <select
        @change="colorEntry(index)"
        :class="entry.color"
        v-model="entry.color"
      >
        <option
          v-for="(option, index) in colorOptions"
          :value="option"
          :key="index"
        >
          {{ option }}
        </option>
      </select>
      <button
        :style="hoverStyle"
        @click="editEntry"
        class="edit"
        :class="entry.color"
      >
        Edit
      </button>
      <button
        :style="hoverStyle"
        @click="() => checkEntry(index)"
        class="check"
        :class="entry.color"
      >
        &#10003;
      </button>
      <button
        :style="hoverStyle"
        @click="() => deleteEntry(index)"
        class="delete"
        :class="entry.color"
      >
        x
      </button>
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
    index: {
      required: true,
      type: Number,
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

    mouseOver() {},

    editEntry() {
      console.log("Edit");
    },
  },
  computed: {
    hoverStyle() {
      return {
        "$hover-color": this.entry.color,
      };
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
$blue: rgba(21, 115, 170, 0.75);
$green: rgba(7, 128, 7, 0.75);
$color: #{var(--hover-color)};

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

.entryBtn {
  background: none;
  transition: background 0.5s;
  &:hover {
    opacity: 0.8;
    filter: brightness($brightness);
  }
}

.edit {
  border-radius: 10%;
  @extend .entryBtn;
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

