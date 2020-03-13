# Planner

Plan your life using this planner! Includes daily, weekly, monthly calendars that syncs with your chrome storage

## Summary

In the past, I have found planning out my life difficult and could never get accustomed to the act of writing in a physical daily planner (from which I never followed through with). That's why I have decided to build my own online daily planner as a google chrome extension! The way I am driven to use my planner daily now is that with each new tab I open, I am forced to look at my calendar and make plans.

## Features

- Three different view buttons that change accordingly: Today, Weekly, and Monthly.
- Persistent data storage so you can view your calendar wherever you go

## Using Chrome APIs

There are several APIs that you can use when developing Chrome Extensions. One that I mainly use for this extension is the Chrome Storage API.

Using the Chrome Storage API, you can store items in Chrome Storage Sync that will persist your storage items in the cloud. This is how I am able to store items for each day in the calendar. Read more about this [here](https://developer.chrome.com/apps/storage)

### Chrome Runtime

I use this to set initial values for the Chrome Storage API for when a user first installs the extension. In this example, I set the view to "today" for when the user first installs.

```javascript
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({ view: "today" }, function() {
    chrome.storage.sync.get(["view"], function(result) {
      console.log("View set to:", result.view);
    });
  });
});
```

[Link to Documentation](https://developer.chrome.com/extensions/runtime)

### Chrome Storage

To set chrome storage items, you must use the method

```javascript
chrome.storage.sync.set({ key: value }, function() {
  console.log("Set Value:", value);
});
```

Here is an example of how I used this method to add entries to a specific date in my calendar.

```javascript
chrome.storage.sync.set({ [date]: dateEntries }, function() {
  console.log("Set Entries");
});
```

To get chrome storage items, you must use this method

```javascript
chrome.storage.sync.get([key], function(result) {
  console.log(result.key);
});
```

Below is an example of how I retrieved items from Chrome Storage to use them in my calendars. I used so that whenever a user closes the planner, they can always go back to what view they were on before they closed it.

```javascript
chrome.storage.sync.get(["view"], function(result) {
  for (let k = 0; k < viewsArr.length; k++) {
    if (views[k].id === result["view"]) {
      views[k].setAttribute("style", "display:flex");
    } else {
      views[k].setAttribute("style", "display:none");
    }
  }
});
```

[Link to Documentation](https://developer.chrome.com/extensions/storage)

### Chrome TopSites

This returns back an array of sites. Each site is an object that includes the url and title

```javascript
chrome.topSites.get(function(arr) {
  console.log(arr); // list of top sites
});
```

[Link to Documentation](https://developer.chrome.com/extensions/topSites)

### Chrome Cookies

It's important to set cookies for chrome extensions when using CORS (Cross Origin Resource Sharing). In this case, I used the API to set the requests pre-flight to `secure: true` and `sameSite: 'no-restriction'`.  

```javascript
chrome.cookies.set(
  {
    url: "https://api.unsplash.com/",
    sameSite: "no_restriction",
    secure: true
  },
  function(cookie) {
    console.log("Cookie settings have been set");
  }
);
```

[Link to Documentation](https://developer.chrome.com/extensions/cookies)

### Future Builds

- Add different backgrounds using Unsplash API
- IOS and Android Stores
- A notes tab to add to each day which will keep a log of your notes for the day
