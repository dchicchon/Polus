// On extension installation
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({ view: "week" }, function() {});
  checkTimeStamp();

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
      let location = photo.location.city
        ? `${photo.location.city}, ${photo.location.country}`
        : "Unknown";
      let author = photo.user.name ? `${photo.user.name}` : "Unknown";
      let photoLink = photo.links.html;
      chrome.storage.sync.set(
        {
          background: { url, location, author, photoLink }
        },
        function(result) {}
      );
    })
    .catch(err => console.log(`Fetch failed: ${err}`));
};

// Recalculate timestamp for next day
const tick = () => {
  let next = new Date();
  // next.setMinutes(next.getMinutes());
  // next.setMinutes(next.getMinutes);
  next.setDate(next.getDate() + 1);
  next.setHours(5, 0, 0);
  console.log(next);
  localStorage.savedTimestamp = next;
  getRandomPhoto();
};

const checkTimeStamp = () => {
  if (localStorage.savedTimestamp) {
    let timestamp = new Date(localStorage.savedTimestamp);
    let currentDate = new Date();
    console.log("Saved Time");
    console.log(
      timestamp.getHours(),
      timestamp.getMinutes(),
      timestamp.getSeconds()
    );

    console.log("Current Time");
    console.log(
      currentDate.getHours(),
      currentDate.getMinutes(),
      currentDate.getSeconds()
    );
    console.log("Difference");
    console.log(timestamp.getTime() - currentDate.getTime());
    if (currentDate.getTime() > timestamp.getTime()) {
      tick();
    }
  } else {
    // first time running
    tick();
  }
};

const startBackground = () => {
  checkTimeStamp();
  setInterval(checkTimeStamp, 30000); // check every minute https://stackoverflow.com/questions/60591487/chrome-extensions-how-to-set-function-to-execute-when-day-has-changed/60592084#60592084
};

startBackground();
