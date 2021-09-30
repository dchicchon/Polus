<template>
  <div id="week">
    <div class="nav">
      <button @click="changeDate(-7)" class="arrow">←</button>
      <div
        class="title"
        style="
          width: 22rem;
          background: rgba(5, 80, 123, 0.992);
          border-radius: 75px;
        "
      >
        {{ weekRange }}
      </div>
      <button @click="changeDate(7)" class="arrow">→</button>
    </div>
    <div class="weekdayNames">
      <h2>Sunday</h2>
      <h2>Monday</h2>
      <h2>Tuesday</h2>
      <h2>Wednesday</h2>
      <h2>Thursday</h2>
      <h2>Friday</h2>
      <h2>Saturday</h2>
    </div>
    <div class="weekdays">
      <EntryList
        v-for="(date, index) in dateList"
        :key="index"
        :listDate="date"
        :dateTitle="true"
        :classNames="['weekday']"
      />
    </div>
  </div>
</template>

<script>
import EntryList from "./EntryList/index.vue";
export default {
  components: {
    EntryList,
  },
  data() {
    return {
      date: new Date(),
    };
  },
  // created() {},
  methods: {
    changeDate(amount) {
      let changeDate = new Date(this.date); // had to do this because computed couldn't see that it was updating
      changeDate.setDate(this.date.getDate() + amount);
      this.date = changeDate;
    },
  },
  computed: {
    weekRange() {
      let startDate = new Date(this.date);
      while (startDate.getDay() !== 0)
        startDate.setDate(startDate.getDate() - 1);
      let endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    },
    dateList() {
      let dates = [];
      let startDate = new Date(this.date);
      while (startDate.getDay() !== 0) {
        startDate.setDate(startDate.getDate() - 1);
      }
      for (let i = 0; i < 7; i++) {
        let thisDate = new Date(startDate); // create a new date so as not to reference the main one we are copying
        dates.push(thisDate);
        startDate.setDate(startDate.getDate() + 1);
      }
      return dates;
    },
  },
};
</script>

<style lang="scss" scoped>
.weekdayNames {
  h2 {
    padding: 0px 0px 0.5rem;
    text-align: center;
  }
}
</style>
