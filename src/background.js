console.info('Starting Background Page')

// Recurring alarms object
const recurringAlarms = {
  moveToLocal: {
    createAlarm: () => {
      // run every two weeks
      console.info('moveToLocalAlarm')
      let nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 14);
      chrome.alarms.create("moveToLocal", {
        when: nextWeek.getTime(),
        periodInMinutes: 60 * 24 * 14,
      });
    },

    /**
      Move all chrome.storage.sync entry dates that are older than 1 month 
      to chrome.storage.local to avoid going over the storage limit in 
      chrome.storage.sync
    */
    execute: () => {
      console.info('moveToLocal')
      // Move all entryDates from 1 week ago to localstorage
      chrome.storage.sync.get(null, (result) => {
        delete result.userSettings;
        delete result.background;
        // go through our items
        Object.keys(result).forEach(date => {
          const today = new Date();
          const entryDate = new Date(date.replaceAll('_', '/'));
          if (isDate(entryDate)) {
            const weekMS = 1000 * 60 * 60 * 24 * 7;
            const entries = result[date]
            if (today.getTime() - entryDate.getTime() > weekMS) {
              chrome.storage.local.set({ [date]: entries }, () => {
                chrome.storage.sync.remove(date);
              });
            }
          }
        })
      });
    }
  },
  changeBackground: {
    createAlarm: () => {
      console.info('createBackgroundAlarm')
      let midnight = new Date();
      midnight.setHours(23, 59, 59);
      // Create alarm that executes every 25 hours
      chrome.alarms.create("changeBackground", {
        when: midnight.getTime(),
        periodInMinutes: 60 * 24,
      });
    },
    /**
     * Get new photo from collection https://unsplash.com/documentation and will
     * store it in the users chrome storage sync . Gets called whenever the alarm
     * changeBackground is fired
    */
    execute: () => {
      chrome.storage.sync.get("userSettings", (result) => {
        let { userSettings } = result;
        if (!userSettings.changePhoto) return;
      });
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
    }
  }
}

/**
 *  Checks current created alarms against mapped recurring alarms. If a recurring alarm is missing,
 *  then we will create the alarm using the mapped alarm function.
 * @name alarmCheck
 * @description Checks current alarms for missing alarms
 * @returns {void}
 */
const alarmCheck = () => {
  chrome.alarms.getAll((foundAlarms) => {
    const foundAlarmsMap = foundAlarms.map(a => a.name);
    Object.keys(recurringAlarms).forEach(alarmName => {
      if (!foundAlarmsMap.includes(alarmName)) {
        console.info(`Creating alarm for ${alarmName}`)
        recurringAlarms[alarmName].createAlarm();
      }
    })
  })
}

const isDate = (date) => {
  return date instanceof Date && !isNaN(date);
}

// Alarm Listeners
console.info('Setting onAlarm listeners')
chrome.alarms.onAlarm.addListener((alarm) => {
  console.info(`Alarm fired: ${alarm.name}`)
  if (Object.keys(recurringAlarms).includes(alarm.name)) {
    recurringAlarms[alarm.name].execute();
  } else {
    handleNotification(alarm.name);
  }
});


// Runtime OnInstalled Listeners
console.info('Setting onInstalled listeners')
chrome.runtime.onInstalled.addListener((details) => {
  // check current alarms
  alarmCheck();
  if (details.reason == "install") {
    console.info('Installing Application')
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
    recurringAlarms.changeBackground.execute(); // get initial photo;
  } else if (details.reason == "update") {
    console.info('Updating extension')
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

/**
 * @name handleNotification
 * @description handles an entry alarm to create a notification
 * @param {string} id notification id
 */
const handleNotification = (id) => {
  // get the current date. be sure to replace all
  let dateStamp = new Date().toLocaleDateString("en-US").replaceAll('_', '/');
  chrome.storage.sync.get([dateStamp], (result) => {
    console.info({ result })
    let entries = result[dateStamp];
    let entry = entries.find((entry) => entry.key === id);
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

/**
 * @name clearNotifications
 * @description Clears all notifications from the system tray
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
