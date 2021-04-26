<template>
  <div id="clock">{{ clock }}</div>
</template>

<style lang="scss">
#clock {
  display: flex;
  justify-content: center;
  color: white;
  font-size: 4rem;
  font-weight: 100;
  text-shadow: 0 0 25px rgba(0, 0, 0, 0.6);
}
</style>

<script>
export default {
  data() {
    return {
      clock: "",
    };
  },

  created() {
    this.updateTime();
    let timer = setInterval(this.updateTime, 1000);
  },

  methods: {
    updateTime() {
      let currentDate = new Date();
      this.clock = currentDate.toLocaleTimeString();
    },
  },
};
</script>
