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

      <!-- <Toggle
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
      /> -->
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
          v-model="photoLink"
        />
      </div>
      <button @click="submitPhoto" id="submitPhoto">Submit</button>
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
      photoLink: "",
    };
  },
  created() {
    this.getSettings();
    //   On created, get all the items from storage relating to the thing
  },
  methods: {
    toggleItem(event, name) {
      console.log("Toggle!");
      this.userSettings[name] = !this.userSettings[name];
      console.log(this.userSettings);
      this.updateStorage();
      // chrome.storage.sync.set({ [name]: event.target.checked });
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

    submitPhoto() {
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
          chrome.storage.sync.set({
            background: { url, location, author, photoLink, downloadLink },
          });
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              chrome.tabs.reload(tabs[0].id);
            }
          );
        })
        .catch((err) => {
          console.error(err);
        });
    },

    // Do this if user doesnt have the updated storage
    updateStorageVersion() {
      this.userSettings = {
        view: "week",
        pmode: false,
        date: true,
        changePhoto: true,
        newTab: true,
        indexOpen: false,
      };
      this.updateStorage();
    },

    updateStorage() {
      chrome.storage.sync.set({ userSettings: this.userSettings });
    },
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
</style>