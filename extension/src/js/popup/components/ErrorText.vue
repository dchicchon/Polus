<template>
  <div>
    <span class="error">{{ error }}</span>
    <br />
  </div>
</template>

<script>
export default {
  props: {
    error: {
      required: true,
      type: String,
    },
  },
};
</script>
<style lang="scss" >
.error {
  color: purple;
}
</style>