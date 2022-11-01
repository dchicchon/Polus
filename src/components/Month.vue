<template>
  <div id="month">
    <div class="nav">
      <button @click="changeMonth(-1)" class="arrow">←</button>
      <div
        class="title"
        style="background: rgba(5, 80, 123, 0.992); border-radius: 75px"
      >
        {{ monthTitle }}
      </div>
      <button @click="changeMonth(1)" class="arrow">→</button>
    </div>
    <div class="weekdayNames">
      <h2 style="padding: 0px 0px 0.5rem; text-align: center">Sunday</h2>
      <h2 style="padding: 0px 0px 0.5rem; text-align: center">Monday</h2>
      <h2 style="padding: 0px 0px 0.5rem; text-align: center">Tuesday</h2>
      <h2 style="padding: 0px 0px 0.5rem; text-align: center">Wednesday</h2>
      <h2 style="padding: 0px 0px 0.5rem; text-align: center">Thursday</h2>
      <h2 style="padding: 0px 0px 0.5rem; text-align: center">Friday</h2>
      <h2 style="padding: 0px 0px 0.5rem; text-align: center">Saturday</h2>
    </div>
    <div class="monthDays">
      <EntryList
        v-for="(date, index) in dateList"
        :key="index"
        :listDate="date"
        :dateTitle="true"
        :classNames="['monthDay']"
      />
    </div>
  </div>
</template>

<script>

import EntryList from "./EntryList.vue";
export default {
  components: {
    EntryList,
  },

  data() {
    return {
      date: new Date(),
    };
  },

  created() {},

  methods: {
    changeMonth(amount) {
      let changeDate = new Date(this.date); // current date:
      changeDate.setMonth(this.date.getMonth() + amount);
      this.date = changeDate;
    },
  },
  computed: {
    monthTitle() {
      let options = { month: "long", year: "numeric" };
      let date = new Date(this.date);
      return date.toLocaleDateString(undefined, options);
    },

    // what is date list? -> Used for making Entry Lists
    dateList() {
      let dates = [];
      let startDate = new Date(this.date);
      let currentMonth = startDate.getMonth(); // what month is it
      startDate.setDate(1); // set it to day 1 of month

      // This is how we set it to sunday
      while (startDate.getDay() !== 0) {
        // while startDate.getDay is not equal to 0, continue to set date
        startDate.setDate(startDate.getDate() - 1);
      }

      // I think that this is not working because eventually when we change years, we might be in a different month thing not too sure
      // instead check if its equal to the next month. Easy!
      let nextDate = new Date();
      nextDate.setMonth(currentMonth + 1);
      // if the startDate month is equal to the next month, then exit this loop
      while (startDate.getMonth() !== nextDate.getMonth()) {
        let week = makeWeek();
        dates = [...dates, ...week];
      }

      // Make a week while we are still in the same month
      function makeWeek() {
        let week = [];
        for (let i = 0; i < 7; i++) {
          let dayDate = new Date(startDate);
          week.push(dayDate);
          startDate.setDate(startDate.getDate() + 1);
        }
        return week;
      }
      return dates;
    },
  },
};
</script>


<style lang="scss" scoped>
.nav {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 25px rgba(0, 0, 0, 0.9);
}
#month {

  flex-direction: column;
  justify-content: center;
  .weekdayNames {
    display: grid;
    grid-template-columns: repeat(7, minmax(50px, 1fr));
    width: 98%;
    margin: 0 auto;
  }
  .monthDays {
    display: grid;
    grid-template-columns: repeat(7, minmax(50px, 1fr));
    width: 98%;
    margin: 0 auto;

    .monthDay {
      text-shadow: 0 0 25px rgba(0, 0, 0, 0.9);
      height: 13rem;
      padding: 0.75rem;
      // border: 0.5px solid $border-color;
      border: 0.5px solid rgba(32, 32, 32, 0.555);
      float: left;
      // background: $day-background;
      background: rgba(0, 0, 0, 0.15);
      transition: background 0.5s;
    }
  }
}
</style>
