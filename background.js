
// Change background photo every day
let url =
  "https://api.unsplash.com/photos/random/?client_id=fdf184d2efd7efc38157064835198f0ce7d9c4f7bfcec07df0d9e64378a8d630";
fetch(url)
  .then(function(result) {
    return result.json();
  })
  .then(function(photo) {
    chrome.storage.sync.set({ background: photo.urls.full }, function(result) {
      console.log("New Background:", photo.urls.full);
    });
  });
