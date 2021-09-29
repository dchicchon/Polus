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
import { getAuth } from "firebase/auth";
import { actions } from "../utils/store";
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
    chrome.storage.onChanged.addListener(this.checkChanges);
    chrome.storage.sync.get("userSettings", (result) => {
      let { userSettings } = result;
      this.userSettings = userSettings;
    });
  },

  methods: {
    checkChanges: async (changes, namespace) => {
      console.log("Changes!");
      if (namespace === "sync" && changes.hasOwnProperty("reload")) {
        if (changes.reload.newValue) {
          console.log("Reload all child elements"); // should we do this? probably
          // Also consider users that are currently not logged in
          // 1. Delete All the data in storage sync
          // actions.resetSyncDatabase();
          // 2. Trigger readEntries Functions in all children that have
          const entryListArr = this.$children[0].$children;
          for (const list of entryListArr) {
            console.log(list); // here we can access the list component functions
            list.readEntries();
          }
          chrome.storage.sync.set({ reload: false });
        }
      }
    },
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
