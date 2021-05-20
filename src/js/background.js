// On extension installation
chrome.runtime.onInstalled.addListener(() => {

  // 1. On installed, we will check to see if they have anything from previous version in storage
  // 2. If so, we will check every valid date for a storage item and change each item that was altered for the new update
  chrome.contextMenus.create({
    title: "Open",
    contexts: ["browser_action"],
    id: "open-sesame",
  });

  let userSettings = {
    view: "week",
    pmode: false,
    changePhoto: true,
    newTab: true,
    indexOpen: false,
  }

  chrome.storage.sync.set({ userSettings })
  getPhoto();
  
});

chrome.runtime.setUninstallURL(
  "https://docs.google.com/forms/d/1-ILvnBaztoC9R5TFyjDA_fWWbwo9WRB-s42Mqu4w9nA/edit",
  () => { }
);

// Check Alarm
chrome.alarms.get("changeBackground", (alarm) => {
  // If no alarm, create one that executes at midnight
  if (!alarm) {
    let date = new Date();
    let midnight = new Date();
    midnight.setHours(23, 59, 59);
    let ms = midnight.getTime() - date.getTime();
    chrome.alarms.create("changeBackground", {
      when: Date.now() + ms,
      periodInMinutes: 60 * 24,
    });
  }
});

// CONTEXT MENUS
// 1. User toggles off new tab
// 2. Clicks on 'Open'
// 3. Opens index.html

chrome.contextMenus.onClicked.addListener(function (result) {
  if (result["menuItemId"] === "open-sesame") {
    chrome.storage.sync.get('userSettings', result => {
      let { userSettings } = result
      userSettings.indexOpen = true;
      chrome.storage.sync.set({ userSettings }, () => {
        chrome.tabs.create({}); // create a new tab
      })
    })
  }
});

// Alarm to execute getPhoto()
chrome.alarms.onAlarm.addListener((alarm) => {
  chrome.storage.sync.get("userSettings", (result) => {
    let { userSettings } = result
    if (userSettings.changePhoto && alarm.name === "changeBackground") {
      getPhoto();
    }
  });
});

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
        downloadLink
      }
      chrome.storage.sync.set({ background });
    })
    .catch((err) => console.log(`Fetch failed: ${err}`));
};
