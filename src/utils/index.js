import { reactive } from "vue";

const chromeAPI = chrome
/**
 * Use the local storage if an entry is being set to a date more than a week in the past
 * @param {*} date 
 * @returns 
 */
const storageType = (date) => {
  const todayDate = new Date();
  const entryListDate = new Date(date.replaceAll('_', '/'));
  const weekMS = 1000 * 60 * 60 * 24 * 7
  const timeDiff = todayDate.getTime() - entryListDate.getTime();

  if (timeDiff > weekMS) {
    return 'local'
  } else {
    return 'sync'
  }
}

const stores = {
  // Local storage manipulation
  local: {
    /** 
      Get entryDate objects from chrome.storage.local asynchronously and return them 
      to use on our Entry Lists
    */
    get: async ({ key }) => {
      console.debug('getLocal')
      return new Promise((resolve, reject) => {
        chromeAPI.storage.local.get([key], (result) => {
          if (Object.keys(result).length > 0) {
            resolve(result[key]); // this should return everything
          }
          resolve([]);
        });
      })
    },
    set: async ({ key, value }) => {
      // maybe use sync instead if the user is logged in?
      return new Promise((resolve, reject) => {
        chromeAPI.storage.local.set({ [key]: value }, (result) => {
          resolve(result);
        });
      });
    },
    remove: async ({ key }) => {
      return new Promise((resolve, reject) => {
        chromeAPI.storage.local.remove([key], (result) => {
          resolve(result);
        });
      });
    },
    clear: async () => {
      return new Promise((resolve, reject) => {
        // remove everything from storage besides background info and userSettings
        chromeAPI.storage.local.get(null, result => {
          for (const key in result) {
            removeLocal({ key })
          }
          resolve({})
        })

      })
    }
  },
  // Sync storage manipulation
  sync: {
    /**
     * Returns an array of entries based on the key provided
     * @param {string} key 
     * @returns {Array}
     */
    get: async ({ key }) => {
      console.debug('getSync');
      return new Promise((resolve, reject) => {
        chromeAPI.storage.sync.get([key], (result) => {
          console.debug({ result });
          if (Object.keys(result).length > 0) {
            resolve(result[key]); // this should return everything
          }
          resolve([]);
        });
      });
    },

    set: async ({ key, value }) => {
      // maybe use sync instead if the user is logged in?
      return new Promise((resolve, reject) => {
        chromeAPI.storage.sync.set({ [key]: value }, (result) => {
          resolve(result);
        });
      });
    },

    remove: async ({ key }) => {
      return new Promise((resolve, reject) => {
        chromeAPI.storage.sync.remove([key], (result) => {
          resolve(result);
        });
      });
    },

    clear: async () => {
      console.debug('clearSync');
      return new Promise((resolve, reject) => {
        // remove everything from storage besides background info and userSettings
        chromeAPI.sync.get(null, result => {
          console.debug({ result });
          delete result.userSettings;
          delete result.background;
          for (const key in result) {
            removeSync({ key })
          }
          resolve({})
        })
      })
    }
  }
}

export const state = reactive({
  userSettings: {},
  background: {}
});

export const actions = {
  initUserSettings: async () => {
    console.info('actions.initUserSettings')
    let userSettings = await stores.sync.get({ key: 'userSettings' })
    if (!userSettings) return;
    state.userSettings = userSettings
  },
  initBackground: async () => {
    console.info('actions.initBackground')
    let background = await stores.sync.get({ key: 'background' })
    if (!background) return;
    state.background = background;
  },
  setBackground: () => {
    console.info('actions.setBackground');
    stores.sync.set({ key: 'background', value: state.background })
  },
  setUserSettings: () => {
    console.info('actions.setUserSettings');
    stores.sync.set({ key: 'userSettings', value: state.userSettings })
  },
  resetSyncDatabase: async () => {
    await stores.sync.clearSync()
  },
  create: async ({ date, entry }) => {
    console.debug('actions.create');
    const type = storageType(date);
    try {
      const entriesArr = await stores[type].get({ key: date })
      entriesArr.push(entry);
      stores[type].set({ key: date, value: entriesArr })
    } catch (e) {
      console.error(e)
    }
  },
  read: async ({ date }) => {
    console.debug('read');
    const type = storageType(date);
    try {
      return stores[type].get({ key: date })
    } catch (e) {
      console.error(e)
    }
  },
  update: async ({ date, entry, key }) => {
    console.debug('actions.update');
    console.debug({ date, entry, key })
    const type = storageType(date);
    const dateArr = await stores[type].get({ key: date })
    const index = dateArr.findIndex(e => e.key === key);
    dateArr[index] = entry;
    const result = await stores[type].set({ key: date, value: dateArr })
    return result;
  },
  delete: async ({ date, key }) => {
    console.debug('actions.delete');
    console.debug({ date, key })
    let results;
    const type = storageType(date);
    const dateArray = await stores[type].get({ key: date })
    const index = dateArray.findIndex(e => e.key === key);
    console.debug({ dateArray });
    dateArray.splice(index, 1)
    if (dateArray.length === 0) {
      console.debug('Delete entries array at date')
      results = await stores[type].remove({ key: date })
    } else {
      console.debug('Set updated entries array')
      results = await stores[type].set({ key: date, value: dateArray })
    }
    return results;
  },
  /**
  * Creates an alarm in chrome 
  * @param name - name of alarm
  * @param time - time for alarm to go off
  * @returns void
  */
  createNotification: ({ name, time }) => {
    console.info('actions.createAlarm');
    chromeAPI.permissions.contains({ permissions: ["notifications"] }, (result) => {
      // If allowed, create an alarm for this entry
      if (result) {
        console.info('user has notifications permission. Creating alarm');
        chromeAPI.alarms.create(name, {
          when: time,
        });
      }
    })
  },
  showDefaultTab: () => {
    console.info('actions.showDefaultTab');
    chromeAPI.tabs.update({
      url: "chrome-search://local-ntp/local-ntp.html",
    });
  },
  removeNotificationAlarms: () => {
    console.log('removeNotificationAlarms');
    chromeAPI.alarms.getAll((result) => {
      console.log({ result })
      const mainList = result.filter(alarm => {
        return alarm.name !== 'changeBackground' && alarm.name !== 'moveToLocal'
      })
      console.log({ mainList })
      mainList.forEach(alarm => {
        chromeAPI.alarms.clear(alarm.name)
      })
    })
  },
  getOptionsPage: () => {
    chromeAPI.runtime.openOptionsPage();
  },
  /**
  Move all chrome.storage.sync entry dates that are older than 1 month 
  to chrome.storage.local to avoid going over the storage limit in 
  chrome.storage.sync
*/
  moveToLocal: () => {
    console.info('moveToLocal')
    // Move all entryDates from 2 weeks ago to localstorage
    chromeAPI.storage.sync.get(null, (result) => {
      console.info({ result })
      delete result.userSettings;
      delete result.background;
      // go through our items
      for (const date in result) {
        console.info('Date to check')
        console.info({ date })
        const today = new Date(); // today
        // Ensure that we transform previous date style (/ vs _)
        const entryDate = new Date(date.replaceAll('_', '/')); // normalize date
        const weekMS = 1000 * 60 * 60 * 24 * 7; // one week
        if (today.getTime() - entryDate.getTime() > weekMS) {
          console.info(`Moving date:${date} from sync to local`);
          // place the date inside of localStorage and deletefrom syncStorage
          chromeAPI.storage.local.set({ [date]: result[date] }, () => {
            chrome.storage.sync.remove([date]);
          });
        }
      }
    });
  }
};