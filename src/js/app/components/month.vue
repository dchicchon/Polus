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

<style lang="scss" scoped>
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
      // .monthDayTitle {
      //   font-weight: 0;
      //   border-radius: 12px;
      //   margin-bottom: 0.25rem;
      //   width: 20px;
      //   height: 20px;
      //   min-width: 16px;
      //   // padding: 4px 3px 0 3px;
      //   text-align: center;
      // }
      // .monthDetails {
      //   overflow: auto;
      //   height: 12rem;
      //   ul {
      //     list-style-type: none;
      //     padding: 0;
      //     li {
      //       width: 85%;
      //       // V 1.0.0.9
      //       text-align: center;
      //       white-space: nowrap;
      //       overflow: hidden;
      //       display: block;
      //       text-overflow: ellipsis;
      //       border: none;
      //       // background: rgba(21, 115, 170, 0.63);
      //       transition: background 0.5s;
      //       color: white;
      //       margin-bottom: 0.25rem;
      //       padding: 0.5rem;
      //       border-radius: 25px;
      //       font-size: 0.9rem;
      //       // height: 1rem;
      //     }
      //     li:hover {
      //       // background: rgba(24, 127, 187, 0.993);
      //       cursor: pointer;
      //     }
      //   }
      // }
    }
  }
}
</style>
<script>
import EntryList from "./EntryList";
export default {
  components: {
    EntryList,
  },

  data() {
    return {
      date: new Date(),
    };
  },

  created() {
    // this.dateList();
  },

  methods: {
    changeMonth(amount) {
      let changeDate = new Date(this.date);
      changeDate.setMonth(this.date.getMonth() + amount);
      this.date = changeDate;
      console.log(this.date);
    },
  },
  computed: {
    monthTitle() {
      let options = { month: "long", year: "numeric" };
      let date = new Date(this.date);
      return date.toLocaleDateString(undefined, options);
    },
    dateList() {
      let dates = [];
      let startDate = new Date(this.date);
      let currentMonth = startDate.getMonth();
      startDate.setDate(1);

      // This is how we set it to sunday
      while (startDate.getDay() !== 0) {
        startDate.setDate(startDate.getDate() - 1);
      }

      // Make a week if we are still in the same month
      while (startDate.getMonth() <= currentMonth) {
        let week = makeWeek();
        dates = [...dates, ...week];
      }

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
