<template>
  <!-- eslint-disable-next-line vue/max-attributes-per-line -->
  <li class="entry" :class="color">
    <!-- New Entry -->
    <input
      v-model="newText"
      class="newEntry"
      ref="newEntry"
      v-on:keyup.enter="submitEntry(newText, index)"
      v-if="entry.text.length === 0"
    />
    <!-- Not Active -->
    <div v-else-if="!active" @click="changeActive">
      {{ entry.text }}
    </div>
    <!-- Active -->
    <div class="entry-container" v-else @click="changeActive">
      <p class="text">{{ entry.text }}</p>
      <select @change="(e) => colorEvent(e)" class="color" v-model="color">
        <option
          v-for="(option, index) in colorOptions"
          :value="option"
          :key="index"
        >
          {{ option }}
        </option>
      </select>
      <button class="edit">Edit</button>
      <button class="check">&#10003;</button>
      <button class="delete">x</button>
    </div>
  </li>
    <div></div>

</template>

<style lang="scss">
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
    colorEvent(event) {
      console.log(event);
    },
    changeActive() {
      console.log("Change Active");
      this.active = !this.active;
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
