// Change background photo every day

// This url hits an api endpoint to get a random photo of nature and saves it to user's chrome storage
let url =
  "https://api.unsplash.com/photos/random/?client_id=fdf184d2efd7efc38157064835198f0ce7d9c4f7bfcec07df0d9e64378a8d630&query=nature";

// In the future, I would like to learn more about fetch and how it works. All I know so far is that it can hit an api endpoint and return back json data

fetch(url)
  .then(function(result) {
    return result.json();
  })
  .then(function(photo) {
    console.log(photo);
    chrome.storage.sync.set({ background: photo.urls.full }, function(result) {
      console.log("New Background:", photo.urls.full);
    });
  });

// Not working at the moment. Err cannot find get of undefined

chrome.topSites.get(function(arr) {
  chrome.storage.sync.set({ topSites: arr }, function() {
    console.log("Set top site");
  });
});

// chrome.events
// https://developer.chrome.com/extensions/events
// I want to make an event where when the next day occurs, there is a new background image. Similar to the Momentum extension
