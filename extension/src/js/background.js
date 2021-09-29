// On extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason == "install") {
    const createBackgroundAlarm = () => {
      let midnight = new Date();
      midnight.setHours(23, 59, 59);
      // Create alarm that executes every 25 hours
      chrome.alarms.create("changeBackground", {
        when: midnight.getTime(),
        periodInMinutes: 60 * 24,
      });
    };
    createBackgroundAlarm();
    chrome.runtime.setUninstallURL(
      "https://docs.google.com/forms/d/1-ILvnBaztoC9R5TFyjDA_fWWbwo9WRB-s42Mqu4w9nA/edit"
    );
    const userSettings = {
      changePhoto: true,
      indexOpen: false,
      newTab: true,
      notifications: false,
      notificationTime: "0",
      pmode: false,
      view: "week",
    };
    chrome.contextMenus.create({
      title: "Open",
      contexts: ["action"],
      id: "open-sesame",
    });
    chrome.storage.sync.set({ userSettings });
  } else if (details.reason == "update") {
    // Change each key in storage to dashes instead of slashes,
    // also were turning each item into an object vs an array

    chrome.storage.sync.get(null, (result) => {
      for (const key in result) {
        if (key.includes("/")) {
          const dateArray = result[key];
          // conver to object
          const dateObject = {};
          for (const entry of dateArray) {
            const entryKey = entry.key;
            delete entry.key;
            dateObject[entryKey] = entry;
          }

          const newDate = key.replaceAll("/", "-");
          chrome.storage.sync.set({ [newDate]: dateObject }, () => {
            chrome.storage.sync.remove([key]);
          });
          // now save the object to our chrome storage
        }
      }
    });
  }
  // 1. On installed, we will check to see if they have anything from previous version in storage
  // 2. If so, we will check every valid date for a storage item and change each item that was altered for the new update

  // maybe try changing all of the store to use - instead of /

  getPhoto();

  // Check Alarm

  // Maybe make an alarm here that will execute after awhile?
});

chrome.contextMenus.onClicked.addListener(function (result) {
  if (result["menuItemId"] === "open-sesame") {
    chrome.storage.sync.get("userSettings", (result) => {
      let { userSettings } = result;
      userSettings.indexOpen = true;
      chrome.storage.sync.set({ userSettings }, () => {
        chrome.tabs.create({}); // create a new tab
      });
    });
  }
});

// Alarm to execute getPhoto()
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "changeBackground") {
    chrome.storage.sync.get("userSettings", (result) => {
      let { userSettings } = result;
      if (userSettings.changePhoto) {
        getPhoto();
      }
    });
  } else if (alarm.name === 'reloadFirestore') {
    chrome.storage.sync.set({ reload: true })
    // Delete all items in storage sync and then grab them from Firestore

  }

  // If we want custom alarms later on, add them here

  // Alarm from Notifications
  else {
    // have the alarm occur, look at the alarm name for the key of the entry
    let dateStamp = new Date().toLocaleDateString();
    chrome.storage.sync.get([dateStamp], (result) => {
      let entries = result[dateStamp];
      let entry = entries.find((entry) => entry.key === alarm.name);
      let notificationObj = {
        message: entry.text,
        type: "basic",
        title: "Polus",
        iconUrl: "/assets/polus_icon.png",
      };
      // Clear all other notification before this
      chrome.notifications.create(entry.key, notificationObj);
      chrome.notifications.onClicked.addListener((notificationId) => {
        clearNotifications();
      });
    });
  }
});

// Maybe here I can execute firebase code where i can update my storage later on
// chrome.storage.onChanged.addListener(function (changes, namespace) {
//   console.log(changes)
//   console.log(namespace)
// })

const clearNotifications = () => {
  chrome.notifications.getAll((result) => {
    let notifications = Object.keys(result);
    for (let notification of notifications) {
      chrome.notifications.clear(notification);
    }
  });
};

// Get new photo from collection https://unsplash.com/documentation
const getPhoto = () => {
  // This url hits an api endpoint to get a random photo and saves it to user's chrome storage
  let url =
    "https://api.unsplash.com/photos/random/?client_id=fdf184d2efd7efc38157064835198f0ce7d9c4f7bfcec07df0d9e64378a8d630&collections=8974511";

  fetch(url, { mode: "cors", credentials: "omit" })
    .then((response) => {
      if (!response.ok) throw response.statusText;
      return response;
    })
    .then((response) => response.json())
    .then((photo) => {
      // console.log(photo);
      let url = photo.urls.raw;
      let location = photo.location.name ? `${photo.location.name}` : "Unknown";
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
      chrome.storage.sync.set({ background });
    })
    .catch((err) => console.log(`Fetch failed: ${err}`));
};
