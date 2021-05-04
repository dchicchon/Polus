<template>
  <div id="vuemain">
    <div id="view">
      <button @click="changeView('daily')" type="button" class="view-btn">
        Daily
      </button>
      <button @click="changeView('week')" type="button" class="view-btn">
        Week
      </button>
      <button @click="changeView('month')" type="button" class="view-btn">
        Month
      </button>
    </div>
    <div v-if="view === 'daily'">
      <section>
        <Day />
      </section>
    </div>
    <div v-if="view === 'week'">
      <section>
        <Week />
      </section>
    </div>
    <div v-if="view === 'month'">
      <section>
        <Month />
      </section>
    </div>
  </div>
</template>


<script>
import Day from "./Day";
import Week from "./Week";
import Month from "./Month";

export default {
  components: {
    Day,
    Week,
    Month,
  },
  data() {
    return {
      view: "",
    };
  },

  created() {
    chrome.storage.sync.get(["view"], (result) => {
      this.view = result.view;
    });
  },

  methods: {
    changeView(type) {
      chrome.storage.sync.set({ view: type }, () => {
        this.view = type;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
