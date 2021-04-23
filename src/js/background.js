// On extension installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: "Open",
    contexts: ["browser_action"],
    id: "open-sesame",
  });
  chrome.storage.sync.set({
    view: "week",
    pmode: false,
    clock: true,
    date: true,
    changePhoto: true,
    newTab: true,
    indexOpen: false,
  });
  getPhoto();
});

chrome.runtime.setUninstallURL(
  "https://docs.google.com/forms/d/1-ILvnBaztoC9R5TFyjDA_fWWbwo9WRB-s42Mqu4w9nA/edit",
  () => {}
);

// Check Alarm
chrome.alarms.get("changeBackground", (alarm) => {
  if (alarm) {
    // console.log(alarm);
  } else {
    // If no alarm, create one that executes at midnight
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
    let newURL = chrome.extension.getURL("/index.html");
    chrome.storage.sync.set({ indexOpen: true });
    chrome.tabs.create({ url: newURL });
  }
});

// Alarm to execute getPhoto()
chrome.alarms.onAlarm.addListener((alarm) => {
  chrome.storage.sync.get(["changePhoto"], (result) => {
    if (result["changePhoto"] && alarm.name === "changeBackground") {
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
    .then(function (photo) {
      // console.log(photo);
      let url = photo.urls.raw;
      let location = photo.location.name ? `${photo.location.name}` : "Unknown";
      let author = photo.user.name ? `${photo.user.name}` : "Unknown";
      let photoLink = photo.links.html;
      let downloadLink = `https://unsplash.com/photos/${photo.id}/download?client_id=fdf184d2efd7efc38157064835198f0ce7d9c4f7bfcec07df0d9e64378a8d630&force=true`;
      chrome.storage.sync.set({
        background: { url, location, author, photoLink, downloadLink },
      });
    })
    .catch((err) => console.log(`Fetch failed: ${err}`));
};