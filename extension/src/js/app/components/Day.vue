<template>
  <div id="daily">
    <div id="nav">
      <div class="nav">
        <button @click="changeDay(-1)" class="arrow">←</button>

        <h5 class="dayTitle" :style="checkDay">
          {{ dayTitle }}
        </h5>
        <button @click="changeDay(1)" class="arrow">→</button>
      </div>
    </div>
    <div class="dayDiv">
      <!-- We use v-bind to attach state item to component--->
      <EntryList v-bind:listDate="date" />
    </div>
  </div>
</template>

<style lang="scss">
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

<script>
import EntryList from "./EntryList/index.vue";
import { actions } from "../utils/store";
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
    // Change Date here
    changeDay(amount) {
      let changeDate = new Date(this.date); // had to do this because computed couldn't see that it was updating
      changeDate.setDate(this.date.getDate() + amount);
      actions.setDate(changeDate);
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
      return `${this.date.toLocaleString(
        undefined,
        options
      )} ${this.date.toLocaleeDateString()}`;
    },
  },
};
</script>
