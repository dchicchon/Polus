<template>
  <div class="main">
    <h1>Polus Options</h1>

    <h2>Developer Info</h2>
    <div>
      <h3>Alarms</h3>
      <ul>
        <li v-for="(alarm, index) in alarms" :key="`${index}`">
          Name: {{ alarm.name }} Scheduled Time: {{ alarm.scheduledTime }}
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
    <!-- Here we can display dev info maybe? -->
  </div>
</template>
<script>
// Popup Entry Point. Should create a check to see if user is logged in with firebase
export default {
  // components in the popup
  created() {
    console.log("lets get alar s");
    chrome.alarms.getAll((result) => {
      this.alarms = result;
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

  methods: {},

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
  justify-content: center;
}
.main {
  width: 100%;
  height: 100%;
}
</style>
