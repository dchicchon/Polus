<template>
  <div>
    {{ description }}
    <label @click="toggleItem($event, name)" for="switch" class="switch">
      <input type="checkbox" class="toggle" v-model="currentValue" />
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
    toggleItem: {
      type: Function,
      required: true,
    },
    currentValue: {
      type: Boolean,
      required: false,
    },
  },

  watch: {
    currentValue(val) {},
  },
};
</script>