<template>
  <div id="daily">
    <div id="nav">
      <div class="nav">
        <button @click="changeDay(-1)" class="arrow">←</button>
        <h5 class="dayTitle" style="background-color: initial">
          {{ dayTitle }}
        </h5>
        <button @click="changeDay(1)" class="arrow">→</button>
      </div>
    </div>
    <div class="dayDiv">
      <div class="details">
        <ul>
          
        </ul>
        <button class="add" value="4/26/2021" style="opacity: 0">+</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: "",
    };
  },
  created() {
    this.date = new Date();
  },
  methods: {
    changeDay(amount) {
      let changeDate = new Date(this.date); // had to do this because computed couldn't see that it was updating
      changeDate.setDate(this.date.getDate() + amount);
      this.date = changeDate;
    },
  },

  computed: {
    dayTitle() {
      let options = { weekday: "short" };
      return `${this.date.toLocaleString(
        undefined,
        options
      )} ${this.date.toLocaleDateString()}`;
    },
  },
};
</script>
