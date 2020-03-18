// On extension installation
chrome.runtime.onInstalled.addListener(function() {
  chrome.topSites.get(function(arr) {
    chrome.storage.sync.set({ view: "week", topSites: arr }, function() {});
  });

  // Set cookies because cross origin request must be secure and recognized that it is a cors method
  chrome.cookies.set(
    {
      url: "https://api.unsplash.com/",
      sameSite: "no_restriction",
      secure: true
    },
    function(cookie) {
      // console.log("Cookie settings have been set");
      // console.log(cookie);
    }
  );
});

// Get new photo from collection https://unsplash.com/documentation
const getRandomPhoto = () => {
  // This url hits an api endpoint to get a random photo of nature and saves it to user's chrome storage
  let url =
    "https://api.unsplash.com/photos/random/?client_id=fdf184d2efd7efc38157064835198f0ce7d9c4f7bfcec07df0d9e64378a8d630&collections=8974511";

  fetch(url, { mode: "cors", credentials: "omit" })
    .then(response => {
      if (!response.ok) throw response.statusText;
      // console.log(response);
      return response;
    })
    .then(response => response.json())
    .then(function(photo) {
      console.log(photo);
      let url = photo.urls.raw;
      let location = `${photo.location.city}, ${photo.location.country}`;
      let author = `${photo.user.name}`;
      let authorLink = photo.user.links.html;
      chrome.storage.sync.set(
        {
          background: { url, location, author, authorLink }
        },
        function(result) {}
      );
    })
    .catch(err => console.log(`Fetch failed: ${err}`));
};

// Recalculate timestamp for next day
const tick = () => {
  let next = new Date();
  next.setDate(next.getDate() + 1);
  localStorage.savedTimestamp = next;
  getRandomPhoto();
};

const checkTimeStamp = () => {
  if (localStorage.savedTimestamp) {
    let timestamp = new Date(localStorage.savedTimestamp);
    let currentDate = new Date();
    if (currentDate.getTime() > timestamp.getTime()) {
      tick();
    }
  } else {
    // first time running
    tick();
  }
};

const startBackground = () => {
  setInterval(checkTimeStamp, 60000); // check every hour https://stackoverflow.com/questions/60591487/chrome-extensions-how-to-set-function-to-execute-when-day-has-changed/60592084#60592084
};

startBackground();
