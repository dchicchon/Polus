import { reactive } from "vue";

/**
 * * UTILS FILE
 * * CONSOLE LEVEL: DEBUG ONLY
 */

const chromeAPI = chrome
/**
 * Use the local storage if an entry is being set to a date more than a week in the past
 * @param {Date} date use a real date value, not the stamp
 * @returns 
 */
const storageType = (date) => {
  const todayDate = new Date();
  const entryListDate = new Date(date);
  const weekMS = 1000 * 60 * 60 * 24 * 7
  const timeDiff = todayDate.getTime() - entryListDate.getTime();
  return timeDiff > weekMS ? 'local' : 'sync';
}

const stores = {
  // Local storage manipulation
  local: {
    /** 
      Get entryDate objects from chrome.storage.local asynchronously and return them 
      to use on our Entry Lists
    */
    get: ({ key }) => {
      console.debug('local.get');
      return new Promise((resolve, reject) => {
        chromeAPI.storage.local.get([key], (result) => {
          if (Object.keys(result).length > 0) {
            resolve(result[key]); // this should return everything
          }
          resolve([]);
        });
      })
    },
    set: ({ key, value }) => {
      console.debug('local.set');
      // maybe use sync instead if the user is logged in?
      return new Promise((resolve, reject) => {
        chromeAPI.storage.local.set({ [key]: value }, (result) => {
          resolve(result);
        });
      });
    },
    remove: ({ key }) => {
      console.debug('local.remove');
      return new Promise((resolve, reject) => {
        chromeAPI.storage.local.remove([key], (result) => {
          resolve(result);
        });
      });
    },
    clear: () => {
      console.debug('local.clear');
      return new Promise((resolve, reject) => {
        // remove everything from storage besides background info and userSettings
        chromeAPI.storage.local.get(null, result => {
          for (const key in result) {
            stores.local.remove({ key })
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
    get: ({ key }) => {
      console.debug('sync.get');
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

    set: ({ key, value }) => {
      console.debug('sync.set');
      // maybe use sync instead if the user is logged in?
      return new Promise((resolve, reject) => {
        chromeAPI.storage.sync.set({ [key]: value }, (result) => {
          resolve(result);
        });
      });
    },

    remove: ({ key }) => {
      console.debug('sync.remove');
      return new Promise((resolve, reject) => {
        chromeAPI.storage.sync.remove([key], (result) => {
          resolve(result);
        });
      });
    },

    clear: () => {
      console.debug('sync.clear');
      return new Promise((resolve, reject) => {
        // remove everything from storage besides background info and userSettings
        chromeAPI.storage.sync.get(null, result => {
          console.debug({ result });
          delete result.userSettings;
          delete result.background;
          for (const key in result) {
            stores.sync.remove({ key })
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
    console.debug('actions.initUserSettings')
    const userSettings = await stores.sync.get({ key: 'userSettings' })
    if (!userSettings) return; // there is something wrong if this is not here we should think about this
    state.userSettings = userSettings
  },
  setUserSettings: () => {
    console.debug('actions.setUserSettings');
    stores.sync.set({ key: 'userSettings', value: state.userSettings })
  },
  initBackground: async () => {
    console.debug('actions.initBackground')
    const background = await stores.sync.get({ key: 'background' })
    if (!background) return; // there is something wrong if this is not here we should think about this
    state.background = background;
  },
  setBackground: () => {
    console.debug('actions.setBackground');
    stores.sync.set({ key: 'background', value: state.background })
  },
  resetSyncDatabase: async () => {
    await stores.sync.clear()
  },
  resetLocalDatabase: async () => {
    await stores.local.clear()
  },
  create: async ({ date, entry }) => {
    console.debug('actions.create');
    console.debug({ date, entry })
    const safeDate = date.replaceAll('_', '/')
    const dateStamp = date;
    const type = storageType(safeDate);
    try {
      /**
       * TODO: TECH DEBT
       * TODO: What might be better to do here is to just bring the array here rather than reading again
       */
      const entriesArr = await stores[type].get({ key: dateStamp })
      entriesArr.push(entry);
      stores[type].set({ key: dateStamp, value: entriesArr })
    } catch (e) {
      console.error(e)
    }
  },
  read: async ({ date }) => {
    console.debug('actions.read');
    console.debug({ date })
    const dateStamp = date;
    const safeDate = date.replaceAll('_', '/')
    const type = storageType(safeDate);
    try {
      const entries = await stores[type].get({ key: dateStamp });
      /**
       * TODO: TECH DEBT
       * TODO: need this for old way of getting entires. could rethink this later on
       * TODO: this introduces a double read which can affect costs over time
       */
      const originalDate = new Date(safeDate);
      const originalDateStamp = originalDate.toLocaleDateString();
      const oldEntries = await stores[type].get({ key: originalDateStamp })
      const allEntries = [...entries, ...oldEntries]
      return allEntries
    } catch (e) {
      console.error(e)
    }
  },
  update: async ({ date, entry, key }) => {
    console.debug('actions.update');
    console.debug({ date, entry, key })
    let result;
    const safeDate = date.replaceAll('_', '/')
    const dateStamp = date;
    const type = storageType(safeDate);
    const entries = await stores[type].get({ key: dateStamp })
    const index = entries.findIndex(e => e.key === key);
    if (index !== -1) {
      entries[index] = entry;
      result = await stores[type].set({ key: dateStamp, value: entries })
      return result;
    } else {
      // if not found, must mean it's in the old version. Bring it to the new version then delete
      entries.push(entry);
      const originalDate = new Date(safeDate);
      const originalDateStamp = originalDate.toLocaleDateString();
      const oldEntriesArr = await stores[type].get({ key: originalDateStamp })
      const oldIndex = oldEntriesArr.findIndex(e => e.key === key);
      console.debug({ oldEntriesArr });
      oldEntriesArr.splice(oldIndex, 1)
      if (oldEntriesArr.length === 0) {
        console.debug('Delete entries array at date')
        result = await stores[type].remove({ key: originalDateStamp })
      } else {
        console.debug('Set updated entries array')
        result = await stores[type].set({ key: originalDateStamp, value: oldEntriesArr })
      }
      return result;
    }

  },
  /**
   * 
   * @param {string} date entryListDate of entry
   * @param {string} key entry key
   * @returns 
   */
  delete: async ({ date, key }) => {
    console.debug('actions.delete');
    console.debug({ date, key })
    const safeDate = date.replaceAll('_', '/')
    const dateStamp = date;
    let results;
    const type = storageType(safeDate);
    const entriesArr = await stores[type].get({ key: dateStamp });
    const index = entriesArr.findIndex(e => e.key === key);
    if (index !== -1) {
      console.debug({ entriesArr });
      entriesArr.splice(index, 1)
      if (entriesArr.length === 0) {
        console.debug('Delete entries array at date')
        results = await stores[type].remove({ key: dateStamp })
      } else {
        console.debug('Set updated entries array')
        results = await stores[type].set({ key: dateStamp, value: entriesArr })
      }
    } else {
      const originalDate = new Date(safeDate);
      const originalDateStamp = originalDate.toLocaleDateString();
      const oldEntriesArr = await stores[type].get({ key: originalDateStamp })
      const oldIndex = oldEntriesArr.findIndex(e => e.key === key);
      console.debug({ oldEntriesArr });
      oldEntriesArr.splice(oldIndex, 1)
      if (oldEntriesArr.length === 0) {
        console.debug('Delete entries array at date')
        results = await stores[type].remove({ key: originalDateStamp })
      } else {
        console.debug('Set updated entries array')
        results = await stores[type].set({ key: originalDateStamp, value: oldEntriesArr })
      }
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
    console.debug('actions.createAlarm');
    chromeAPI.permissions.contains({ permissions: ["notifications"] }, (result) => {
      // If allowed, create an alarm for this entry
      if (result) {
        console.debug('user has notifications permission. Creating alarm');
        chromeAPI.alarms.create(name, {
          when: time,
        });
      }
    })
  },
  showDefaultTab: () => {
    console.debug('actions.showDefaultTab');
    chromeAPI.tabs.update({
      url: "chrome-search://local-ntp/local-ntp.html",
    });
  },
  removeNotificationAlarms: () => {
    console.debug('removeNotificationAlarms');
    chromeAPI.alarms.getAll((result) => {
      console.debug({ result })
      const mainList = result.filter(alarm => {
        return alarm.name !== 'changeBackground' && alarm.name !== 'moveToLocal'
      })
      console.debug({ mainList })
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
    console.debug('moveToLocal')
    // Move all entryDates from 1 week ago to localstorage
    chromeAPI.storage.sync.get(null, (result) => {
      console.debug({ result })
      delete result.userSettings;
      delete result.background;
      // go through our items
      for (const date in result) {
        console.debug('Date to check')
        console.debug({ date })
        const today = new Date(); // today
        // Ensure that we transform previous date style (/ vs _)
        const entryDate = new Date(date.replaceAll('_', '/')); // normalize date
        const weekMS = 1000 * 60 * 60 * 24 * 7; // one week
        if (today.getTime() - entryDate.getTime() > weekMS) {
          console.debug(`Moving date:${date} from sync to local`);
          // place the date inside of localStorage and deletefrom syncStorage
          chromeAPI.storage.local.set({ [date]: result[date] }, () => {
            chrome.storage.sync.remove([date]);
          });
        }
      }
    });
  }
};