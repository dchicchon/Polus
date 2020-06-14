// On extension installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ view: "week" });
  chrome.storage.local.set({ changeNum: 1 });

  getPhoto();

  // Set cookies because cross origin request must be secure and recognized that it is a cors method
  // chrome.cookies.set({
  //   url: "https://api.unsplash.com",
  //   sameSite: "no_restriction",
  //   secure: true,
  // });
});

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

// Alarm to execute getPhoto()
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "changeBackground") {
    getPhoto();
    chrome.storage.local.get(["changeNum"], (result) => {
      if (result) {
        result += 1;
        chrome.storage.local.set({ changeNum: result });
      } else {
        chrome.storage.local.set({ changeNum: 1 });
      }
    });
  }
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
      console.log(photo);
      let url = photo.urls.raw;
      let location = photo.location.city
        ? `${photo.location.city}, ${photo.location.country}`
        : "Unknown";
      let author = photo.user.name ? `${photo.user.name}` : "Unknown";
      let photoLink = photo.links.html;
      chrome.storage.sync.set({
        background: { url, location, author, photoLink },
      });
    })
    .catch((err) => console.log(`Fetch failed: ${err}`));
};
