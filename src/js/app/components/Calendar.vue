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
    <div v-if="userSettings.view === 'daily'">
      <section>
        <Day />
      </section>
    </div>
    <div v-if="userSettings.view === 'week'">
      <section>
        <Week />
      </section>
    </div>
    <div v-if="userSettings.view === 'month'">
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
      userSettings: {},
     };
  },

  created() {
    chrome.storage.sync.get("userSettings", (result) => {
      let { userSettings } = result;
      this.userSettings = userSettings;
    });
  },

  methods: {
    changeView(type) {
      this.userSettings.view = type;
      let userSettings = this.userSettings;
      chrome.storage.sync.set({ userSettings });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
