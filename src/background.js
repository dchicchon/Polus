console.info('Starting Background Page')
// Runtime OnInstalled Listeners
console.info('Setting onInstalled listeners')
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason == "install") {
    console.info('Installing Application')
    createBackgroundAlarm(); // change background photo
    createSyncToLocalAlarm(); // bring sync to local
    chrome.runtime.setUninstallURL(
      "https://docs.google.com/forms/d/1-ILvnBaztoC9R5TFyjDA_fWWbwo9WRB-s42Mqu4w9nA/edit"
    );
    const userSettings = {
      changePhoto: true,
      indexOpen: false,
      newTab: true,
      notifications: false,
      pmode: false,
      view: "week",
    };
    chrome.contextMenus.create({
      title: "Open",
      contexts: ["action"],
      id: "open-sesame",
    });
    chrome.storage.sync.set({ userSettings });
    getPhoto(); // get background photo
  } else if (details.reason == "update") {
    console.info('Updating extension')
    // ammendEntries();
  }
});

// Context Menu Click Listeners
console.info('Setting context menu listeners')
chrome.contextMenus.onClicked.addListener(function (result) {
  console.info('contextMenu onClicked')
  if (result["menuItemId"] === "open-sesame") {
    chrome.storage.sync.get("userSettings", (result) => {
      let { userSettings } = result;
      userSettings.indexOpen = true;
      chrome.storage.sync.set({ userSettings }, () => {
        chrome.tabs.create({}); // create a new tab
      });
    });
  }
});

// Alarm Listeners
console.info('Setting onAlarm listeners')
chrome.alarms.onAlarm.addListener((alarm) => {
  console.info('alarms onAlarm')
  console.info({ alarm })
  if (alarm.name === "changeBackground") {
    chrome.storage.sync.get("userSettings", (result) => {
      let { userSettings } = result;
      if (userSettings.changePhoto) {
        getPhoto();
      }
    });
  } else if (alarm.name === "moveToLocal") {
    moveToLocal();
  }
  // Notification Alarms
  else {
    // have the alarm occur, look at the alarm name for the key of the entry
    let dateStamp = new Date().toLocaleDateString("en-US").replaceAll('_', '/');
    // transform it into what we use
    // replace with the -
    chrome.storage.sync.get([dateStamp], (result) => {
      console.info({ result })
      let entries = result[dateStamp];
      let entry = entries.find((entry) => entry.key === alarm.name);
      let notificationObj = {
        message: entry.text,
        type: "basic",
        title: "Polus",
        iconUrl: "/assets/polus_icon.png",
      };
      console.info({ notificationObj })
      // Clear all other notification before this
      chrome.notifications.create(entry.key, notificationObj);
      chrome.notifications.onClicked.addListener((notificationId) => {
        clearNotifications();
      });
    });
  }
});

/**
//  * Create a recurring alarm for function @function moveToLocal
//  * Chnage every 2 weeks
//  */
const moveToLocalAlarm = () => {
  console.info('moveToLocalAlarm')
  let nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 14);
  chrome.alarms.create("moveToLocal", {
    when: nextWeek.getTime(),
    periodInMinutes: 60 * 24 * 14,
  });
};

/**
 * Create an alarm for changing the background photo. Calls getPhoto()
 */
const createBackgroundAlarm = () => {
  console.info('createBackgroundAlarm')

  let midnight = new Date();
  midnight.setHours(23, 59, 59);
  // Create alarm that executes every 25 hours
  chrome.alarms.create("changeBackground", {
    when: midnight.getTime(),
    periodInMinutes: 60 * 24,
  });
};

/**
  Move all chrome.storage.sync entry dates that are older than 1 month 
  to chrome.storage.local to avoid going over the storage limit in 
  chrome.storage.sync
*/
const moveToLocal = () => {
  console.info('moveToLocal')
  // Move all entryDates from 1 week ago to localstorage
  chrome.storage.sync.get(null, (result) => {
    delete result.userSettings;
    delete result.background;
    // go through our items
    for (const date in result) {
      const today = new Date();
      const entryDate = new Date(date.replaceAll('_', '/'));
      // if it's a valid date (i.e. us timeformat)
      if (entryDate.getTime() !== NaN) {
        const weekMS = 1000 * 60 * 60 * 24 * 7;
        const entries = result[date]
        if (today.getTime() - entryDate.getTime() > weekMS) {
          chrome.storage.local.set({ [date]: entries }, () => {
            chrome.storage.sync.remove(date);
          });
        }
      }

    }
  });
};

/**
 * Clears all notifications from the system tray
 */
const clearNotifications = () => {
  console.info('clearNotifications')
  chrome.notifications.getAll((result) => {
    let notifications = Object.keys(result);
    for (let notification of notifications) {
      chrome.notifications.clear(notification);
    }
  });
};

/**
 * The great mistake of 2022. Revert all entries from _ to /
 */
// const ammendEntries = () => {

//   // Do all sync
//   chrome.storage.sync.get(null, (result) => {
//     delete result.userSettings;
//     delete result.background;
//     const entriesToFix = {}
//     // remove all underscored
//     for (const date in result) {
//       // check if the date contains an _
//       const containsUnderscore = date.includes('_');
//       if (containsUnderscore) {
//         entriesToFix[date] = result[date];
//         delete result[date];
//       }
//     }
//     // combine underscored if found
//     for (const filteredDate in result) {
//       const testDate = filteredDate.replaceAll('/', '_');
//       if (entriesToFix[testDate]) {
//         const toAmmendEntries = entriesToFix[testDate];
//         const currentEntries = result[filteredDate];
//         const combinedEntries = [...currentEntries, ...toAmmendEntries]
//         chrome.storage.sync.set({ [filteredDate]: combinedEntries })
//       }
//     }
//   })

//   // Do all local
//   chrome.storage.local.get(null, (result) => {
//     delete result.userSettings;
//     delete result.background;
//     const entriesToFix = {}
//     // remove all underscored
//     for (const date in result) {
//       // check if the date contains an _
//       const containsUnderscore = date.includes('_');
//       if (containsUnderscore) {
//         entriesToFix[date] = result[date];
//         delete result[date];
//       }
//     }
//     // combine underscored if found
//     for (const filteredDate in result) {
//       const testDate = filteredDate.replaceAll('/', '_');
//       if (entriesToFix[testDate]) {
//         const toAmmendEntries = entriesToFix[testDate];
//         const currentEntries = result[filteredDate];
//         const combinedEntries = [...currentEntries, ...toAmmendEntries]
//         chrome.storage.local.set({ [filteredDate]: combinedEntries })
//       }
//     }
//   })
// }

/**
 * Get new photo from collection https://unsplash.com/documentation and will
 * store it in the users chrome storage sync . Gets called whenever the alarm
 * changeBackground is fired
 */
const getPhoto = () => {
  console.info("Getting Photo")
  // This url hits an api endpoint to get a random photo and saves it to user's chrome storage
  let url =
    "https://api.unsplash.com/photos/random/?client_id=fdf184d2efd7efc38157064835198f0ce7d9c4f7bfcec07df0d9e64378a8d630&collections=8974511";

  fetch(url, { mode: "cors", credentials: "omit" })
    .then((response) => {
      if (!response.ok) throw response.statusText;
      return response;
    })
    .catch((err) => {
      throw err
    })
    .then((response) => response.json())
    .catch((err) => {
      throw err
    })
    .then((photo) => {
      let url = photo.urls.raw;
      let location = photo.location.name ? `${photo.location.name}` : "Unknown";
      let author = photo.user.name ? `${photo.user.name}` : "Unknown";
      let photoLink = photo.links.html;
      let downloadLink = `https://unsplash.com/photos/${photo.id}/download?client_id=fdf184d2efd7efc38157064835198f0ce7d9c4f7bfcec07df0d9e64378a8d630&force=true`;
      let background = {
        url,
        location,
        author,
        photoLink,
        downloadLink,
      };
      chrome.storage.sync.set({ background });
    })
    .catch((err) => {
      console.error(err)
      throw err
    });
};
