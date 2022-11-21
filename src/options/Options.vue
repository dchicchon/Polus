<template>
  <div class="page">
    <div class="pane"></div>
    <div class="main">
      <h1 class="title-box">
        <span> <img src="/assets/polus_icon48.png" /> </span>
        <span class="title">Polus Options</span>
      </h1>
      <!-- USER -->
      <h2 class="page-title">Options</h2>
      <Toggle
        :key="1"
        :toggleItem="toggleItem"
        :description="'Change Photo Daily'"
        :name="'changePhoto'"
        :currentValue="userSettings['changePhoto']"
      />
      <Toggle
        :key="2"
        :toggleItem="toggleItem"
        :name="'newTab'"
        :currentValue="userSettings['newTab']"
        :description="'Default New Tab'"
      />
      <Toggle
        :key="3"
        :toggleItem="modifyNotificationPermission"
        :name="'notifications'"
        :currentValue="userSettings['notifications']"
        :description="'Get Notifications'"
      />

      <div>
        Select Photo from
        <span>
          <a
            href="https://unsplash.com/"
            target="_blank"
            rel="noopener noreferrer"
            >Unsplash</a
          ></span
        >
        <input
          id="photoURL"
          type="text"
          placeholder="https://unsplash.com/photos/NuBvAE6VfSM"
          v-model="photoLink"
        />
        <Button :onClick="submitPhoto" title="Submit"></Button>
      </div>

      <!-- DEV -->
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
        <Button
          :onClick="removeNotificationAlarms"
          title="Clear notification alarms"
        ></Button>
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
        <Button :onClick="moveToLocal" title="Move to local"></Button>
      </div>
    </div>
    <div class="pane"></div>
  </div>
</template>
<script>
import { state, actions } from "../utils";
import Button from "../components/Button.vue";
import Toggle from "../components/Toggle.vue";
// Popup Entry Point. Should create a check to see if user is logged in with firebase
export default {
  // components in the popup

  components: {
    Button,
    Toggle,
  },

  data() {
    return {
      photoLink: "",
      alarms: [],
      permissions: [],
      userSettings: {},
    };
  },
  created() {
    this.userSettings = state.userSettings;
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
  methods: {
    removeNotificationAlarms() {
      console.info("Removing alarms");
      actions.removeNotificationAlarms();
    },
    toggleItem(event, name) {
      state.userSettings[name] = !state.userSettings[name];
      actions.setUserSettings();
    },
    submitPhoto() {
      if (this.photoLink.length === 0) return;
      let arr = this.photoLink.split("/");
      let id = arr[arr.length - 1];
      let requestPhotoURL = `https://api.unsplash.com/photos/${id}/?client_id=fdf184d2efd7efc38157064835198f0ce7d9c4f7bfcec07df0d9e64378a8d630&`;
      fetch(requestPhotoURL, { mode: "cors", credentials: "omit" })
        .then((response) => {
          if (!response.ok) throw response.statusText;
          return response;
        })
        .then((response) => response.json())
        .then((photo) => {
          let url = photo.urls.raw;
          let location = photo.location.name
            ? `${photo.location.name}`
            : "Unknown";
          let author = photo.user.name ? `${photo.user.name}` : "Unknown";
          let photoLink = photo.links.html;
          let downloadLink = `https://unsplash.com/photos/${photo.id}/download?client_id=fdf184d2efd7efc38157064835198f0ce7d9c4f7bfcec07df0d9e64378a8d630&force=true`;
          let background = {
            url,
            location,
            author,
            photoLink,
            downloadLink,
          };
          state.background = background;
          actions.setBackground();
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.reload(tabs[0].id);
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },
    modifyNotificationPermission(event, name) {
      console.debug("modifyNotificationPermission");
      // get the current setting for notifications from user settings
      if (state.userSettings.notifications) {
        // ask if user wants to disable notifications
        chrome.permissions.remove(
          {
            permissions: ["notifications"],
          },
          (removed) => {
            if (removed) {
              // The permissions have been removed.
              state.userSettings.notifications = false;
              actions.setUserSettings();
            }
          }
        );
      } else {
        // ask if user wants to enable notifications
        chrome.permissions.request(
          {
            permissions: ["notifications"],
          },
          (granted) => {
            if (granted) {
              state.userSettings.notifications = true;
              actions.setUserSettings();
            }
          }
        );
      }
    },
    moveToLocal() {
      actions.moveToLocal();
    },
    /**
     * This will allow you to remove all of the entries in your database
     */
    // resetEntries: () => {
    // const baseUserSettings = {
    //   changePhoto: true,
    //   indexOpen: false,
    //   newTab: true,
    //   notifications: false,
    //   pmode: false,
    //   view: "week",
    // };
    // actions.resetSyncDatabase();
    // },
  },

  // computed in app, costs less than using methods
  computed: {},
};
</script>
<style lang="scss">
html {
  margin: 0;
  color: white;
  background: rgb(19, 24, 27);
}

body {
  margin: 0;
  font-size: 100%;
}

.page {
  display: flex;
  flex-direction: row;
  height: 100vh;
}

a {
  color: white;
}

input {
  margin: 5px;
}

.pane {
  background: rgb(78, 103, 114);
  width: 25vw;
  height: 100%;
  // border-right: 2px solid black;
  // border-left: 2px solid black;
}
.main {
  width: 100%;
  height: 100%;
  padding: 0px 50px;
  overflow: auto;
}

.title-box {
  display: flex;
  gap: 5px;
}
.title {
  line-height: 50px;
}
</style>
