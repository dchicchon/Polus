// On extension installation
chrome.runtime.onInstalled.addListener(function() {
  chrome.topSites.get(function(arr) {
    chrome.storage.sync.set({ view: "today", topSites: arr }, function() {});
  });
});

// Get new photo from collection
const getRandomPhoto = () => {
  // This url hits an api endpoint to get a random photo of nature and saves it to user's chrome storage
  let url =
    "https://api.unsplash.com/photos/random/?client_id=fdf184d2efd7efc38157064835198f0ce7d9c4f7bfcec07df0d9e64378a8d630&collections=8974511";

  fetch(url) // In the future I should look at the fetch() method more closely
    .then(function(result) {
      return result.json();
    })
    .then(function(photo) {
      // console.log(photo);
      let photoImage = photo.urls.full;
      chrome.storage.sync.set({ background: photoImage }, function(result) {});
    });
};

// Recalculate timestamp for next day
const tick = () => {
  let next = new Date();
  next.setDate(Date.now() + 1);

  next.setHours(6);
  next.setMinutes(0);
  next.setSeconds(0);
  next.setMilliseconds(0);
  localStorage.savedTimestamp = next.getTime();
  getRandomPhoto();
};

const checkTimeStamp = () => {
  console.log(localStorage.savedTimestamp);
  if (!localStorage.savedTimestamp) {
    let timestamp = parseInt(localStorage.savedTimestamp);
    if (Date.now() >= timestamp) {
      tick();
    }
  } else {
    // first time running
    // console.log("First time running!");
    tick();
  }
};

// Check every minute to see if the day has changed
// https://stackoverflow.com/questions/60591487/chrome-extensions-how-to-set-function-to-execute-when-day-has-changed/60592084#60592084
checkTimeStamp();
