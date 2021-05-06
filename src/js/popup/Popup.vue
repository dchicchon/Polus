<template>
  <div>
    <div class="container">
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
        :description="'Clock'"
        :toggleItem="toggleItem"
        :name="'clock'"
        :currentValue="userSettings['clock']"
      />
      <Toggle
        :key="3"
        :toggleItem="toggleItem"
        :name="'date'"
        :currentValue="userSettings['date']"
        :description="'Date'"
      />
      <Toggle
        :key="4"
        :toggleItem="toggleItem"
        :name="'newTab'"
        :currentValue="userSettings['newTab']"
        :description="'Default New Tab'"
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
        />
      </div>
      <button id="submitPhoto">Submit</button>
    </div>

    <ul id="popup-links">
      <li class="active-popup">
        <a href="">Options</a>
      </li>
      <li>
        <a href="">Updates</a>
      </li>
      <li>
        <a href="">Account</a>
      </li>
    </ul>
  </div>
</template>

<script>
import Toggle from "./components/Toggle";
export default {
  components: { Toggle },
  data() {
    return {
      userSettings: {},
    };
  },
  created() {
    this.getSettings();
    //   On created, get all the items from storage relating to the thing
  },
  methods: {
    toggleItem(event, name) {
      console.log("Toggle!");
      console.log(name);
      console.log(event.target.checked); // getting value of input
      chrome.storage.sync.set({ [name]: event.target.checked });
    },

    getSettings() {
      chrome.storage.sync.get("userSettings", (result) => {
        //   Do this if a user does not have the right storage version of polus
        if (Object.keys(result).length === 0) {
          this.updateStorageVersion();
        } else {
          this.userSettings = result["userSettings"];
        }
      });
    },
    // Do this if user doesnt have the updated storage
    updateStorageVersion() {
      let userSettingsData = {
        view: "week",
        pmode: false,
        clock: true,
        date: true,
        changePhoto: true,
        newTab: true,
        indexOpen: false,
      };

      chrome.storage.sync.set({ userSettings: userSettingsData }, () => {
        this.userSettings = userSettingsData;
      });
    },
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
</style>