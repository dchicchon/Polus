<template>
  <div>
    <div id="date">{{ date }}</div>
    <div id="clock">{{ clock }}</div>
  </div>
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
#date {
  width: 100%;
  display: flex;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: 100;
  text-shadow: 0 0 25px rgba(0, 0, 0, 0.6);
}
</style>

<script>
export default {
  data() {
    return {
      clock: "",
      date: "",
      options: {
        weekday: "long",
        year: "numeric",
        month: "numeric",
        day: "numeric",
      },
    };
  },

  created() {
    this.updateTime();
    let timer = setInterval(this.updateTime, 1000);
  },

  methods: {
    // the format will chnage depending on the locale using the extension
    // British English uses day-month-year order
    // Korean uses year-month-day order
    updateTime() {
      let currentDate = new Date();
      this.date = currentDate.toLocaleDateString(undefined, this.options);
      this.clock = currentDate.toLocaleTimeString();
    },
  },
};
</script>
