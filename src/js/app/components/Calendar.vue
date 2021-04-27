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
      <Day />
    </div>
    <div v-if="view === 'week'">
      <h2>week</h2>
    </div>
    <div v-if="view === 'month'">
      <h2>month</h2>
    </div>
  </div>
</template>

<style lang="scss"></style>

<script>
import Day from "./Day";
export default {
  components: {
    Day,
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
