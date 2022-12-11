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
        <Button :onClick="submitPhoto">Submit</Button>
      </div>

      <!-- DEV -->
      <div v-if="dev">
        <h2>Developer Info</h2>
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
          <Button :onClick="clearNotificationAlarms"
            >Clear notification alarms</Button
          >
          <Button :onClick="moveToLocal">Move to local</Button>
          <Button :onClick="resetSyncEntries">Reset Sync Entries</Button>
          <Button :onClick="resetLocalEntries">Reset Local Entries</Button>
          <Button :onClick="createTestEntries">Create Test Entries</Button>
          <Button :onClick="testFunc">Run Test Func</Button>
        </div>
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
      mode: "",
    };
  },
  created() {
    this.userSettings = state.userSettings;
    this.dev = import.meta.env.DEV;
    if (this.dev) {
      chrome.alarms.getAll((result) => {
        console.log({ result });
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
    }
  },
  methods: {
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
    clearNotificationAlarms() {
      console.info("Removing alarms");
      actions.removeNotificationAlarms();
    },
    moveToLocal() {
      actions.moveToLocal();
    },
    /**
     * This will allow you to remove all of the entries in your database
     */
    resetSyncEntries: () => {
      actions.resetSyncDatabase();
    },
    resetLocalEntries: () => {
      actions.resetLocalDatabase();
    },
    /**
     * This should construct entries in sync that cover the following
     * 1. A normal format of entry for Polus (A1)
     * 2. Entries that follow `/` format rather than `_` (A2)
     * 3. Entries that are of another locale besides US (A3-A4)
     *
     * List of locales
     * https://stackoverflow.com/questions/52549577/javascript-get-the-complete-list-of-locales-supported-by-the-browser
     *
     * Change locales
     * https://www.comparitech.com/blog/vpn-privacy/change-location-chrome-firefox-spoof/#:~:text=Manually%20change%20your%20location%20in%20Chrome&text=Hit%20Esc%2C%20then%20click%20the,latitude%20and%20longitude%20you%20want.
     */
    createTestEntries: () => {
      const generateFormats = (date) => {
        return {
          a1: date.toLocaleDateString("en-US").replaceAll("/", "_"),
          a2: date.toLocaleDateString("en-US"),
          a3: date.toLocaleDateString("es"), // Spanish
          a4: date.toLocaleDateString("cs"), // Czech
          a5: date.toLocaleDateString("da"), // Danish
          a6: date.toLocaleDateString("fr"), // French
          a7: date.toLocaleDateString("af"), // Afrikaans
        };
      };

      // run entries twice
      const entries = [
        {
          key: "a1",
          color: "blue",
          active: false,
          text: "Main Format",
        },
        {
          key: "a2",
          color: "blue",
          active: false,
          text: "Old Format",
        },
        {
          key: "a3",
          color: "blue",
          active: false,
          text: "Old 'Spanish' Format",
        },
        {
          key: "a4",
          color: "blue",
          active: false,
          text: "Old 'Czech' Format",
        },
        {
          key: "a5",
          color: "blue",
          active: false,
          text: "Old 'Danish' Format",
        },
        {
          key: "a6",
          color: "blue",
          active: false,
          text: "Old 'French' Format",
        },
        {
          key: "a7",
          color: "blue",
          active: false,
          text: "Old 'Afrikaans' Format",
        },
      ];

      const today = new Date();
      const todayFormats = generateFormats(today);
      // insert today entries
      entries.forEach((entry) => {
        console.info("Create Today Entry");
        const dateFormat = todayFormats[entry.key];
        chrome.storage.sync.set(
          {
            [dateFormat]: [entry],
          },
          (result) => {
            console.info({ result });
          }
        );
      });

      const twoWeeksAgo = new Date(today.setDate(today.getDate() - 14));
      const twoWeeksAgoFormats = generateFormats(twoWeeksAgo);
      // insert twoweeksago entries
      entries.forEach((entry) => {
        console.info("Create Two Weeks Ago Entry");
        const dateFormat = twoWeeksAgoFormats[entry.key];
        chrome.storage.sync.set(
          {
            [dateFormat]: [entry],
          },
          (result) => {
            console.info({ result });
          }
        );
      });
    },
    testFunc: () => {
      actions.testFunc();
    },
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
