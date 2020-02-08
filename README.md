# Planner
Plan your life using this planner! Includes daily, weekly, monthly calendars that syncs with your chrome storage

## Summary
In the past, I have found planning out my life difficult and could never get accustomed to the act of writing in a physical daily planner (from which I never followed through with). That's why I have decided to build my own online daily planner as a google chrome extension! The way I am driven to use my planner daily now is that with each new tab I open, I am forced to look at my calendar and make plans.

## Features
- Three different view buttons that change accordingly: Today, Weekly, and Monthly.
- Persistent data storage so you can view your calendar wherever you go

## Using Chrome Storage
Using the Chrome Storage API, you can store items in Chrome Storage Sync that will persist your storage items in the cloud. This is how I am able to store items for each day in the calendar. Read more about this [here](https://developer.chrome.com/apps/storage)

### Setting Item Keys in Chrome Storage
Below is an example of how I set the key of "view" to the value of "today" with the Chrome Storage API.
```javascript
chrome.storage.sync.set({ view: "today" }, function() {
    chrome.storage.sync.get(["view"], function(result) {
      console.log("View set to:", result.view);
    });
  });
```

### Retrieving Items from Chrome Storage
Below is an example of how I retrieved items from Chrome Storage to use them in my calendars.
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

### Future Builds
 - Add different backgrounds using Unsplash API
 - IOS and Android Stores
 - A notes tab to add to each day which will keep a log of your notes for the day
