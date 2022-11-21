<template>
  <div>
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

    <div>
      <p class="extension-link" @click="openOptions">Additional Options page</p>
    </div>

    <!-- In order to save on user space, we will remove this item -->
    <!-- <div>
      Select a photo from your computer ({{ "<" }} 5MB)
      <md-button @click="uploadPhoto" class="blue md-primary md-raised md-dense"
        >Upload</md-button
      >
    </div> -->
    <p class="error">{{ error }}</p>
  </div>
</template>
<script>
import { actions, state } from "../utils";
import Toggle from "./Toggle.vue";
import Button from "./Button.vue";
export default {
  components: {
    Toggle,
    Button,
  },
  data() {
    return {
      userSettings: {},
      optionsUrl: "",
      photoLink: "",
      error: "",
    };
  },
  created() {
    this.userSettings = state.userSettings;
  },
  methods: {
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

    openOptions() {
      actions.getOptionsPage();
    }

    // // Allow user to submit photo from os
    // async handleFile() {
    //   const options = {
    //     types: [
    //       {
    //         description: "Image",
    //         accept: {
    //           "image/*": [".jpg"],
    //         },
    //       },
    //     ],
    //   };
    //   let [fileHandle] = await window.showOpenFilePicker(options);
    //   const file = await fileHandle.getFile(); // once a user picks an image return the path of that image
    //   //  Lets let the user do the reader on the load
    //   let reader = new FileReader();
    //   reader.addEventListener(
    //     "load",
    //     function () {
    //       // USE INDEXED DB INSTEAD
    //       chrome.storage.sync.set({ background: false }, () => {
    //         chrome.storage.sync.set({ image: reader.result }, () => {
    //           chrome.tabs.query(
    //             { active: true, currentWindow: true },
    //             (tabs) => {
    //               chrome.tabs.reload(tabs[0].id);
    //             }
    //           );
    //         });
    //       });
    //     },
    //     false
    //   );
    //   if (file.size < 4500000) {
    //     reader.readAsDataURL(file);
    //     this.error = "";
    //   } else {
    //     this.error = "File Size is too large";
    //   }
    // },

    // uploadPhoto() {
    //   this.handleFile();
    // },
  },
};
</script>

<style lang="scss" scoped>
.notification-time-text {
  margin: 0;
}

#photoURL {
  width: 95%;
  outline: none;
}

.extension-link {
  text-decoration: underline;
  &:hover {
    cursor: pointer;
  }
}

.error {
  color: red;
}
</style>
