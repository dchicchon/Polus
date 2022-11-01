<template>
  <div id="daily">
    <div class="nav">
      <button @click="changeDay(-1)" class="arrow">←</button>
      <h5 class="dayTitle" :style="checkDay">
        {{ dayTitle }}
      </h5>
      <button @click="changeDay(1)" class="arrow">→</button>
    </div>
    <div class="dayDiv">
      <!-- We use v-bind to attach state item to component--->
      <EntryList v-bind:listDate="date" />
    </div>
  </div>
</template>

  
<script>
import EntryList from "./EntryList.vue";
import { state, actions } from "../utils/store";
export default {
  components: {
    EntryList,
  },
  data() {
    return {
      date: new Date()
    };
  },

  methods: {
    changeDay(amount) {
      // console.log("Change date")
      let changeDate = new Date(this.date);
      changeDate.setDate(changeDate.getDate() + amount);
      this.date = changeDate
    },
  },

  computed: {
    checkDay() {
      let date = new Date();
      return date.getDay() === this.date.getDay()
        ? "background: rgba(5, 80, 123, 0.992);"
        : "background:none";
    },

    dayTitle() {
      let options = { weekday: "short" };
      // console.log("computing day");
      return `${this.date.toLocaleString(
        undefined,
        options
      )} ${state.date.toLocaleDateString()}`;
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
#daily {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 50%;
  margin: 0 auto;
  .dayDiv {
    padding: 1rem 2rem;
    border: 0.5px solid rgba(32, 32, 32, 0.555);
    border-radius: 25px;
    background: rgba(0, 0, 0, 0.15);
  }
}
</style>
