<template>
  <div>
    {{ description }}
    <label for="switch" class="switch">
      <input @click="toggleItem($event, name)" type="checkbox" class="toggle" />
      <span class="slider round"></span>
    </label>
  </div>
</template>

<script>
export default {
  props: {
    description: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    currentValue: {
      type: Boolean,
      required: false,
    },
    toggleItem: {
      type: Function,
      required: true,
    },
  },

  created() {
    console.log(this.description);
    console.log(this.currentValue);
  },

  watch: {
    currentValue(val) {
      console.log("Value");
      console.log(val);
    },
  },

  computed: {
    getClass() {
      if (this.currentValue) {
        return ["toggle"];
      }
    },
  },
};
</script>