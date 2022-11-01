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
import Day from "./Day.vue";
import Week from "./Week.vue";
import Month from "./Month.vue";
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
    // console.log("created")
    chrome.storage.sync.get("userSettings", (result) => {
      let { userSettings } = result;
      this.userSettings = userSettings;
    });
  },

  methods: {
    changeView: function (type) {
      this.userSettings.view = type;
      let userSettings = this.userSettings;
      chrome.storage.sync.set({ userSettings });
    },
  },
};
</script>

<style lang="scss" scoped>
#view {
  display: flex;
  justify-content: center;
  width: 15%;
  margin: 0.5rem auto;
  font-weight: 100;
  .view-btn {
    background: rgba(90, 90, 90, 0.329);
    transition: background 0.5s;
  }
  .view-btn:hover {
    background: rgba(43, 42, 42, 0.329);
  }
}
</style>
