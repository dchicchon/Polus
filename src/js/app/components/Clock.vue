<template>
  <div>
    <div ref="date" id="date">{{ date }}</div>
    <div ref="clock" id="clock">{{ clock }}</div>
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
    };
  },

  created() {
    this.updateTime();
    let timer = setInterval(this.updateTime, 1000);
    chrome.storage.sync.addListener;
  },

  methods: {
    // the format will chnage depending on the locale using the extension
    // British English uses day-month-year order
    // Korean uses year-month-day order
    updateTime() {
      let currentDate = new Date();
      let options = {
        weekday: "long",
        year: "numeric",
        month: "numeric",
        day: "numeric",
      };
      this.date = currentDate.toLocaleDateString(undefined, options);
      this.clock = currentDate.toLocaleTimeString();
    },
  },
};
</script>
