<template>
  <button class="main-button" @click="onClick">
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    onClick: {
      type: Function,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.main-button {
  margin: 5px;
  padding: 10px;
  color: white;
  outline: none;
  border: 1px solid rgb(14, 108, 151);
  border-radius: 10px;
  background-color: rgb(14, 108, 151);
  transition: background-color 0.5s, border 0.5s;
  &:hover {
    background-color: rgb(19, 128, 179);
    cursor: pointer;
    border: 1px solid white;
  }
}
</style>