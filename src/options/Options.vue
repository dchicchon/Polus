<template>
  <div class="main">
    <h1>Polus Options</h1>

    <h2>Developer Tools</h2>
    <div>
      <h3>Alarms</h3>
      <ul>
        <li v-for="(alarm, index) in alarms" :key="`${index}`">
          <p v-for="(alarm, key) in alarm" :key="`${key}`">
            {{ key }}: {{ alarm }}
          </p>
          <!-- Name: {{ alarm.name }} Scheduled Time: {{ alarm.scheduledTime }} -->
        </li>
      </ul>
    </div>
    <div>
      <h3>Permissions</h3>
      <ul>
        <li v-for="(permission, index) in permissions" :key="`${index}`">
          Permission: {{ permission }}
        </li>
      </ul>
    </div>
    <div>
      <h3>Storage</h3>

      <!-- Need to be able to reset polus -->

      <!-- Need to be able to delete entries -->
      <ul>
        <!-- <li v-for="(item, index) in storage" :key="`${index}`">
          {{ item }}
        </li> -->
      </ul>
    </div>
    <div>
      <h3>Reset Polus</h3>
      <button @click="resetExtension">Reset Polus</button>
    </div>
    <!-- Here we can display dev info maybe? -->
  </div>
</template>
<script>
import { actions } from "../utils";
// Popup Entry Point. Should create a check to see if user is logged in with firebase
export default {
  // components in the popup
  created() {
    chrome.alarms.getAll((result) => {
      //name
      //scheduledTime
      const alarms = result.map((alarm) => {
        const timeMS = alarm.scheduledTime;
        const date = new Date(timeMS);
        alarm.scheduledTime = date.toLocaleString();
        return alarm;
      });
      this.alarms = alarms;
    });
    chrome.permissions.getAll((result) => {
      this.permissions = result.permissions;
    });
  },
  components: {},

  data() {
    return {
      alarms: [],
      permissions: [],
    };
  },

  methods: {
    /**
     * This will allow you to remove all of the entries in your database
     */
    resetExtension: () => {
      // const baseUserSettings = {
      //   changePhoto: true,
      //   indexOpen: false,
      //   newTab: true,
      //   notifications: false,
      //   pmode: false,
      //   view: "week",
      // };
      actions.resetSyncDatabase();
    },
  },

  // computed in app, costs less than using methods
  computed: {
    formatAlarms: () => {
      let item = document.createElement("div");
      item.textContent = "hello";
      return item;
    },
  },
};
</script>
<style lang="scss">
html {
  margin: 0;
  color: white;
  background: rgb(1, 25, 36);
}

body {
  margin: 0;
  padding: 10px;
  display: flex;
  // justify-content: center;
}
.main {
  width: 100%;
  height: 100%;
}
</style>
