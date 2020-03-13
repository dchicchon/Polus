// On extension installation
chrome.runtime.onInstalled.addListener(function() {
  chrome.topSites.get(function(arr) {
    chrome.storage.sync.set({ view: "today", topSites: arr }, function() {});
  });
  chrome.cookies.set(
    { url: "https://api.unsplash.com/", sameSite: "no_restriction", secure: true },
    function(cookie) {
      console.log("Cookie settings have been set");
      console.log(cookie);
    }
  );
});

// Get new photo from collection
const getRandomPhoto = () => {
  // This url hits an api endpoint to get a random photo of nature and saves it to user's chrome storage
  let url =
    "https://api.unsplash.com/photos/random/?client_id=fdf184d2efd7efc38157064835198f0ce7d9c4f7bfcec07df0d9e64378a8d630&collections=8974511";

  fetch(url, { mode: "cors", credentials: "omit" })
    .then(response => {
      if (!response.ok) throw response.statusText;
      console.log(response);
      return response;
    })
    .then(response => response.json())
    .then(function(photo) {
      // console.log(photo);
      let photoImage = photo.urls.full;
      chrome.storage.sync.set({ background: photoImage }, function(result) {});
    })
    .catch(err => console.log(`Fetch failed: ${err}`));
};

// Recalculate timestamp for next day

const tick = () => {
  console.log("RANDOM DATE");
  let randomDate = new Date();
  console.log(randomDate);
  console.log("NEXT DATE");
  let next = new Date();
  console.log(next);
  randomDate.setDate(Date.now() + 1);
  randomDate.setHours(6);
  randomDate.setMinutes(0);
  randomDate.setSeconds(0);
  randomDate.setMilliseconds(0);
  localStorage.savedTimestamp = randomDate.getTime();
  getRandomPhoto();
};

const checkTimeStamp = () => {
  console.log(localStorage.savedTimestamp);
  if (localStorage.savedTimestamp) {
    let timestamp = parseInt(localStorage.savedTimestamp);
    console.log(timestamp);
    if (Date.now() >= timestamp) {
      tick();
    }
  } else {
    // first time running
    console.log("FIRST TICK!");
    tick();
  }
};

// Check every minute to see if the day has changed
// https://stackoverflow.com/questions/60591487/chrome-extensions-how-to-set-function-to-execute-when-day-has-changed/60592084#60592084
checkTimeStamp();
