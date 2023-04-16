import { signal, effect, computed } from '@preact/signals';

export const userSettings = signal({});
export const backgroundInfo = signal({});
export const entryMoved = signal(false);

const chromeAPI = chrome;
if (chromeAPI) {
  // add listeners, we could potentially use this later on
  // chromeAPI.storage.onChanged.addListener((changes, areaName) => {
  //   console.log({ changes, areaName });
  // });
}

const defaultUserSettings = {
  changePhoto: true,
  indexOpen: false,
  newTab: true,
  notifications: false,
  pmode: false,
  view: 'week',
};
const defaultBackgroundSettings = {
  url: '',
  location: '',
  author: '',
  photoLink: '',
  downloadLink: '',
};

export const generateId = () => {
  const alpha = 'abcdefghijklmnopqrstuvwxyz';
  const char = alpha[Math.floor(Math.random() * alpha.length)];
  const id = `${char}-${Date.now()}`;
  return id;
};

/**
 * Use the local storage if an entry is being set to a date more than a week in the past
 * @param {Date} date use a real date value, not the stamp
 * @returns
 */
const storageType = (date) => {
  const todayDate = new Date();
  const entryListDate = new Date(date);
  const weekMS = 1000 * 60 * 60 * 24 * 7;
  const timeDiff = todayDate.getTime() - entryListDate.getTime();
  return timeDiff > weekMS ? 'local' : 'sync';
};

const stores = {
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
      });
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
        chromeAPI.storage.local.get(null, (result) => {
          for (const key in result) {
            stores.local.remove({ key });
          }
          resolve({});
        });
      });
    },
  },
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
        chromeAPI.storage.sync.get(null, (result) => {
          console.debug({ result });
          delete result.userSettings;
          delete result.background;
          for (const key in result) {
            stores.sync.remove({ key });
          }
          resolve({});
        });
      });
    },
  },
};
// were going to use preact signals to update our date like we did with
// vue reactive
// lets see how it goes

export const actions = {
  create: async ({ date, entry }) => {
    console.debug('actions.create');
    if (!date || !entry) {
      return console.debug('actions.create failed, missing data');
    }
    console.debug({ date, entry });
    const safeDate = date.replaceAll('_', '/');
    const dateStamp = date;
    const type = storageType(safeDate);
    try {
      /**
       * TODO: TECH DEBT
       * TODO: What might be better to do here is to just bring the array here rather than reading again
       */
      const entriesArr = await stores[type].get({ key: dateStamp });
      entriesArr.push(entry);
      stores[type].set({ key: dateStamp, value: entriesArr });
    } catch (e) {
      console.error(e);
    }
  },
  read: async ({ date }) => {
    console.debug('actions.read');
    console.debug({ date });
    if (!date) {
      return console.debug('actions.read failed, missing data');
    }
    const dateStamp = date;
    const safeDate = date.replaceAll('_', '/');
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
      const oldEntries = await stores[type].get({ key: originalDateStamp });
      const allEntries = [...entries, ...oldEntries];
      return allEntries;
    } catch (e) {
      console.error(e);
    }
  },
  update: async ({ date, entry, key }) => {
    console.debug('actions.update');
    console.debug({ date, entry, key });
    if (!date || !key || !entry) {
      return console.debug('actions.update failed, missing data');
    }
    let result;
    const safeDate = date.replaceAll('_', '/');
    const dateStamp = date;
    const type = storageType(safeDate);
    const entries = await stores[type].get({ key: dateStamp });
    const index = entries.findIndex((e) => e.key === key);
    if (index !== -1) {
      entries[index] = entry;
      result = await stores[type].set({ key: dateStamp, value: entries });
      return result;
    } else {
      // if not found, must mean it's in the old version. Bring it to the new version then delete
      entries.push(entry);
      const originalDate = new Date(safeDate);
      const originalDateStamp = originalDate.toLocaleDateString();
      const oldEntriesArr = await stores[type].get({ key: originalDateStamp });
      const oldIndex = oldEntriesArr.findIndex((e) => e.key === key);
      console.debug({ oldEntriesArr });
      oldEntriesArr.splice(oldIndex, 1);
      if (oldEntriesArr.length === 0) {
        console.debug('Delete entries array at date');
        result = await stores[type].remove({ key: originalDateStamp });
      } else {
        console.debug('Set updated entries array');
        result = await stores[type].set({ key: originalDateStamp, value: oldEntriesArr });
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
    console.debug({ date, key });
    if (!date || !key) {
      return console.debug('actions.delete failed, missing data');
    }
    const safeDate = date.replaceAll('_', '/');
    const dateStamp = date;
    let results;
    const type = storageType(safeDate);
    const entriesArr = await stores[type].get({ key: dateStamp });
    const index = entriesArr.findIndex((e) => e.key === key);
    if (index !== -1) {
      console.debug({ entriesArr });
      entriesArr.splice(index, 1);
      if (entriesArr.length === 0) {
        console.debug('Delete entries array at date');
        results = await stores[type].remove({ key: dateStamp });
      } else {
        console.debug('Set updated entries array');
        results = await stores[type].set({ key: dateStamp, value: entriesArr });
      }
    } else {
      const originalDate = new Date(safeDate);
      const originalDateStamp = originalDate.toLocaleDateString();
      const oldEntriesArr = await stores[type].get({ key: originalDateStamp });
      const oldIndex = oldEntriesArr.findIndex((e) => e.key === key);
      console.debug({ oldEntriesArr });
      oldEntriesArr.splice(oldIndex, 1);
      if (oldEntriesArr.length === 0) {
        console.debug('Delete entries array at date');
        results = await stores[type].remove({ key: originalDateStamp });
      } else {
        console.debug('Set updated entries array');
        results = await stores[type].set({
          key: originalDateStamp,
          value: oldEntriesArr,
        });
      }
    }
    return results;
  },
  initializeUserSettings: async () => {
    console.debug('actions.getBackground');
    const foundUserSettings = await stores.sync.get({ key: 'userSettings' });
    if (!foundUserSettings || Object.keys(foundUserSettings).length === 0) {
      console.debug('storage: setting default userSettings');
      userSettings.value = defaultUserSettings;
      return;
    }
    userSettings.value = foundUserSettings;
  },
  initializeBackground: async () => {
    console.debug('actions.getBackground');
    const foundBackgroundInfo = await stores.sync.get({ key: 'background' });
    if (!foundBackgroundInfo || Object.keys(foundBackgroundInfo).length === 0) {
      console.debug('storage: setting default backgroundInfo');
      backgroundInfo.value = defaultBackgroundSettings;
      return;
    }
    const page = document.getElementsByTagName('html');
    const image = foundBackgroundInfo.url;
    page[0].style.background = `rgba(0,0,0,0.9) url(${
      image + `&w=${window.innerWidth}`
    }) no-repeat fixed`;
    backgroundInfo.value = foundBackgroundInfo;
  },
  createNotification: ({ name, time }) => {
    console.debug('actions.createAlarm');
    chromeAPI.permissions.contains({ permissions: ['notifications'] }, (result) => {
      // If allowed, create an alarm for this entry
      if (result) {
        console.debug('user has notifications permission. Creating alarm');
        chromeAPI.alarms.create(name, {
          when: time,
        });
      }
    });
  },
};

// if we see that userSettings is empty, we should refresh it
// if we see that backgroundSettings is empty, maybe we should refresh that too?
// we should be careful about breaking the max quota for sync storage. Just be aware of that

effect(() => {
  console.debug('effect: backgroundInfo');
  if (Object.keys(backgroundInfo.value).length === 0) return;
  console.debug('storage: updating background');
  stores.sync.set({ key: 'background', value: backgroundInfo.value });
});

effect(() => {
  console.debug('effect: userSettings');
  if (Object.keys(userSettings.value).length === 0) return;
  console.debug('storage: updating userSettings');
  stores.sync.set({ key: 'userSettings', value: userSettings.value });
});
