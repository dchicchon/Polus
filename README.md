# Polus

Plan your day using this planner! Includes daily, weekly, monthly calendars that syncs with your chrome storage

## Photos

![App Gif](https://i.imgur.com/nd4hWLg.gif)

## Summary

In the past, I have found planning out my life difficult and could never get accustomed to the act of writing in a physical daily planner (from which I never followed through with). That's why I have decided to build my own online daily planner as a google chrome extension! The way I am driven to use my planner daily now is that with each new tab I open, I am forced to look at my calendar and make plans.

## Features

- Three different view buttons that change accordingly: Today, Weekly, and Monthly.
- Persistent data storage so you can view your calendar wherever you go

## Table of Contents

1. [Using Firebase](#firebase)
2. [Chrome APIs](#chrome-api)
3. [Stretch Goals](#stretch-goals)

<hr>

## Desktop App Development

### Running the app

1. Install all the dev dependencies by running `npm i`
2. Execute `npm run watch` to build the dist folder
3. Load the dist folder in the `chrome://extensions` load unpacked and you should see the build!

### Using Firebase <a name='firebase'></a>

To allow users to persist their data across their chrome browser and mobile device,
users can signup using `Firebase Authentication` to use the `Firestore Database` which will migrate their current data to the database.

Users will then be able to see changes realtime on their phone and on their desktop

Firebase Applications

- [Firebase Authentication](https://firebase.google.com/products/auth?gclid=CjwKCAjwqcKFBhAhEiwAfEr7zT2iCvpNTnta_ynLgNd8NVAW-r8Bty9p508InchOsSWtovd2jJR06RoC3YcQAvD_BwE&gclsrc=aw.ds) (to allow users to sign up)
- [Firebase Firestore](https://firebase.google.com/products/firestore?gclid=CjwKCAjwqcKFBhAhEiwAfEr7zW11fVJCzKf8sdneH8uJpXGTgLA_A0m6NKA9_CdwvfpzHZh7Dv_9WRoCvSYQAvD_BwE&gclsrc=aw.ds) (to store user data)

With this case, we will be switching entirely to the `Firestore Database` so users wont be able to use the `chrome.storage.sync` data anymore. But this is
okay! If users would like to, they can always migrate back to the `chrome.storage.sync` at no cost. Of course they can only store a certain amount of items (100kb or 500 items) in the `chrome.storage.sync` so would have to let them know if they have too much data available there. So we will allow them to delete some data first.

When a user starts the app, it will check if they are using Firebase or not. (Of course, I will be open to switching to any other methods in the future that may be more efficient or convenient for the user). Once we have done the check, we will then grab the data from whatever they are using, `Firestore` or `chrome.storage.sync`

So

1. App Starts -> Check if user is loggedin
2. If userloggedin -> get firestore items
3. not logged in -> get chrome.storage.sync items

Caviat -> If users want to migrate their data back to `chrome.storage.sync` they must login and click `migrate` button.

### Database Hierarchy

Every new user uses the default database hierarchy

- How Each Entry Looks

```json
{
  "text": "Hello World",
  "key": "12390jvc",
  "color": "green",
  "active": true,
};
```

How the database is structured in chrome.storage.sync

- 4/14/21: [{entryObj}, {entryObj}, {entryObj}]
- 4/15/21: [{entryObj}, {entryObj}, {entryObj}]
- 4/16/21: [{entryObj}, {entryObj}, {entryObj}]
- {userData}

Now, when a user decides to signup, we must migrate all their current data to the Firestore Database
For reference, I am using the [documentation](https://firebase.google.com/docs/firestore/data-model) for how to store my data
I think that I will store users entries as a subcollection within userData like:

- user1
  - {user1Data}
  - 4/14/21: [{entryObj}, {entryObj}, {entryObj}]
  - 4/15/21: [{entryObj}, {entryObj}, {entryObj}]
  - 4/16/21: [{entryObj}, {entryObj}, {entryObj}]
- user2
  - {user2Data}
  - 5/14/21: [{entryObj}, {entryObj}, {entryObj}]
  - 5/15/21: [{entryObj}, {entryObj}, {entryObj}]
  - 5/16/21: [{entryObj}, {entryObj}, {entryObj}]
- user3
  - {user3Data}
  - 6/14/21: [{entryObj}, {entryObj}, {entryObj}]
  - 6/15/21: [{entryObj}, {entryObj}, {entryObj}]
  - 6/16/21: [{entryObj}, {entryObj}, {entryObj}]

```js
// This will return all items from storage
chrome.storage.sync.get(null, (result) => {
  console.log(result);
  // 1. Filter out the entries vs userdata
  // 2. Store userData into a document
  // 3. For each date, store it as a subcollection inside of the userData document
  // 4. Make each date the name of the subcollection I think
});
```

<hr>

### Using Chrome APIs <a name='chrome-api'></a>

There are several APIs that you can use when developing Chrome Extensions. One that I mainly use for this extension is the Chrome Storage API.

Using the Chrome Storage API, you can store items in Chrome Storage Sync that will persist your storage items in the cloud. This is how I am able to store items for each day in the calendar. Read more about this [here](https://developer.chrome.com/apps/storage)

#### `Chrome Alarms`

I use Chrome Alarms to change the background photo everyday at midnight and to execute `chrome notifications` at the users specified time

```js
// create an alarm
chrome.alarms.create("changeBackground", {
      when: Date.now() + ms,
      periodInMinutes: 60 * 24,
    });

// on alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "changeBackground") {
    chrome.storage.sync.get("userSettings", (result) => {
      let { userSettings } = result;
      if (userSettings.changePhoto) {
        getPhoto();
      }
    });
  }
```

#### `Chrome ContextMenu`

I used this API to allow there to be items to be clicked on if the `Polus` icon was clicked in the extensions bookmark bar.

```js
// You must include these keys in order to do this! (as far as I know)
chrome.contextMenus.create({
  title: 'Open',
  contexts: ['browser_action'],
  id: 'open-sesame',
});
```

#### `Chrome Notifications`

This API will allow you to make an notification on a users PC. I have added this in as an optional permission so the user can toggle it on or off. In order for them to execute at a desired time, I combined its use with `Chrome Alarms`

```js
// Each of the keys in notificationObj must be included to work
let notificationObj = {
  message: 'Hello World',
  type: 'basic',
  title: 'Polus',
  iconUrl: '/assets/polus_icon.png',
};
chrome.notifications.create('id', notificationObj);
```

#### `Chrome Runtime`

I use this to set initial values for the Chrome Storage API for when a user first installs the extension. In this example, I set the view to "today" for when the user first installs.

```javascript
// runs on installed
chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ view: 'today' }, function () {
    chrome.storage.sync.get(['view'], function (result) {
      console.log('View set to:', result.view);
    });
  });
});

// Sends them here if they uninstall the app
chrome.runtime.setUninstallURL(
  'https://docs.google.com/forms/d/1-ILvnBaztoC9R5TFyjDA_fWWbwo9WRB-s42Mqu4w9nA/edit',
  () => {}
);
```

[Link to Documentation](https://developer.chrome.com/extensions/runtime)

#### `Chrome Identity`

I use `chrome.identity` to allow the browser to give oAuth2 access for signup and signin. I need an oAuth2 token to pass to the firebase authentication

In addition to requesting it in the `permissions` in the manifest, I had to add `oauth2` in the manifest with scopes.

```json
{
  "oauth2": {
    "client_id": "274422794820-42usjoqhn5sm4cfvngusc2089erhr8mh.apps.googleusercontent.com",
    "scopes": ["https://www.googleapis.com/auth/userinfo.email"]
  }
}
```

```js
chrome.identity.getAuthToken({ interactive: true }, (token) => {
  let credential = firebase.auth.GoogleAuthProvider.credential(null, token);
  firebase.auth().signInWithCredential(credential);
});
```

#### `Chrome Storage`

I used Chrome Storage Sync for the extension so I would be able to sync entries with the google account so it could be used across multiple devices with the same chrome account.

It is important to note, that there is a storage limit of 100kb and 8kb limit for each item. In future builds, I will implement localStorage to help alleviate some storage weight from storage.sync.

To set chrome storage items, you must use the method

```javascript
chrome.storage.sync.set({ key: value }, function () {
  console.log('Set Value:', value);
});
```

Here is an example of how I used this method to add entries to a specific date in my calendar.

```javascript
chrome.storage.sync.set({ [date]: dateEntries }, function () {
  console.log('Set Entries');
});
```

To get chrome storage items, you must use this method

```javascript
chrome.storage.sync.get([key], function (result) {
  console.log(result.key);
  // or
  let { key } = result;
});
```

Below is an example of how I retrieved items from Chrome Storage to use them in my calendars. I used so that whenever a user closes the planner, they can always go back to what view they were on before they closed it.

```javascript
chrome.storage.sync.get(['view'], function (result) {
  for (let k = 0; k < viewsArr.length; k++) {
    if (views[k].id === result['view']) {
      views[k].setAttribute('style', 'display:flex');
    } else {
      views[k].setAttribute('style', 'display:none');
    }
  }
});
```

[Link to Documentation](https://developer.chrome.com/extensions/storage)

#### `Chrome TopSites`

This returns back an array of sites. Each site is an object that includes the url and title

```javascript
chrome.topSites.get(function (arr) {
  console.log(arr); // list of top sites
});
```

[Link to Documentation](https://developer.chrome.com/extensions/topSites)

#### `Chrome Cookies`

It's important to set cookies for chrome extensions when using CORS (Cross Origin Resource Sharing). In this case, I used the API to set the requests pre-flight to `secure: true` and `sameSite: 'no-restriction'`.

```javascript
chrome.cookies.set(
  {
    url: 'https://api.unsplash.com/',
    sameSite: 'no_restriction',
    secure: true,
  },
  function (cookie) {
    console.log('Cookie settings have been set');
  }
);
```

[Link to Documentation](https://developer.chrome.com/extensions/cookies)

#### Preact Signals

I'm using [Preact Signals](https://preactjs.com/guide/v10/signals) to manage a global state for userSettings and drag and drop

### Dragging Entries

[This code sandbox](https://codesandbox.io/s/64829x0m93?file=/src/index.js) is a reference for how I was able to drag entries in and between lists.

<hr>
