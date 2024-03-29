import { signal, effect } from '@preact/signals';

// eventually we will have to bring firebase here

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
          resolve(null);
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
          resolve(null);
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

// Have a hook here to send a message to 
// registeredMobileIds if: 
// there is a user logged in
// there is a registeredMobileId? (maybe)

// Maybe we should split up our actions? This one object might be too big
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
      const foundEntries = await stores[type].get({ key: dateStamp });
      const entries = foundEntries || [];
      entries.push(entry);
      stores[type].set({ key: dateStamp, value: entries });
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
      const foundEntries = await stores[type].get({ key: dateStamp });
      const entries = foundEntries || [];
      const originalDate = new Date(safeDate);
      const originalDateStamp = originalDate.toLocaleDateString();
      const foundOldEntries = await stores[type].get({ key: originalDateStamp });
      const oldEntries = foundOldEntries || [];
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
    const foundEntries = await stores[type].get({ key: dateStamp });
    const entries = foundEntries || [];
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
      const foundOldEntries = await stores[type].get({ key: originalDateStamp });
      const oldEntriesArr = foundOldEntries || [];
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
    const foundEntries = await stores[type].get({ key: dateStamp });
    const entriesArr = foundEntries || [];
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
      const foundOldEntries = await stores[type].get({ key: originalDateStamp });
      const oldEntriesArr = foundOldEntries || [];
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
  createNotification: async ({ name, time }) => {
    console.debug('actions.createAlarm');
    const hasNotifications = await actions.hasNotifications();
    if (hasNotifications) {
      // we should check to see if we already have an alarm with this name? maybe
      console.debug('user has notifications permission. Creating alarm');
      chromeAPI.alarms.create(name, {
        when: time,
      });
    }
  },
  showDefaultTab: () => {
    console.debug('actions.showDefaultTab');
    chromeAPI.tabs.update({
      url: 'chrome-search://local-ntp/local-ntp.html',
    });
  },
  getOptionsPage: () => {
    chromeAPI.runtime.openOptionsPage();
  },
  resetSyncDatabase: async () => {
    await stores.sync.clear();
  },
  resetLocalDatabase: async () => {
    await stores.local.clear();
  },
  /**
 Move all chrome.storage.sync entry dates that are older than 1 month 
 to chrome.storage.local to avoid going over the storage limit in 
 chrome.storage.sync
*/
  moveToLocal: () => {
    console.debug('moveToLocal');
    // Move all entryDates from 1 week ago to localstorage
    chromeAPI.storage.sync.get(null, (result) => {
      console.debug({ result });
      delete result.userSettings;
      delete result.background;
      // go through our items
      Object.keys(result).forEach((date) => {
        console.debug('Date to check');
        console.debug({ date });
        const today = new Date(); // today
        const entryDate = new Date(date.replaceAll('_', '/')); // normalize date
        if (actions.isDate(entryDate)) {
          console.debug(`Created valid date from ${date}`);
          const weekMS = 1000 * 60 * 60 * 24 * 7; // one week
          if (today.getTime() - entryDate.getTime() > weekMS) {
            console.debug(`Moving date:${date} from sync to local`);
            const entries = result[date];
            // place the date inside of localStorage and deletefrom syncStorage
            chromeAPI.storage.local.set({ [date]: entries }, () => {
              chrome.storage.sync.remove([date]);
            });
          }
        } else {
          console.debug(`Could not create a valid date from ${date}`);
        }
      });
    });
  },
  removeNotificationAlarms: () => {
    console.debug('removeNotificationAlarms');
    chromeAPI.alarms.getAll((result) => {
      console.debug({ result });
      const mainList = result.filter((alarm) => {
        return alarm.name !== 'changeBackground' && alarm.name !== 'moveToLocal';
      });
      console.debug({ mainList });
      mainList.forEach((alarm) => {
        chromeAPI.alarms.clear(alarm.name);
      });
    });
  },
  isDate: (date) => {
    return date instanceof Date && !isNaN(date);
  },
  testFunc: () => {
    console.debug('testFunc');
    const today = new Date();
    const dateString = today.toLocaleDateString();
    const createDate = new Date(dateString); // this works since were in our own locale
    console.debug({ today, dateString, createDate });
  },
  hasNotifications: async () => {
    const result = await chromeAPI.permissions.contains({
      permissions: ['notifications'],
    });
    console.log({ result });
    return result;
  },
  // check if messaging permission is available
  hasMessaging: async () => {
    const result = await chromeAPI.permissions.contains({ permissions: ['gcm'] });
    console.log({ result });
    return result;
  },
  toggleMessaging: async () => {
    console.debug('toggling messaging');
    const hasMessaging = await actions.hasMessaging();
    if (hasMessaging) {
      console.log('removing permission');
      chromeAPI.permissions.remove(
        {
          permissions: ['gcm'],
        },
        (removed) => {
          if (removed) {
            if (!removed) return;
          }
        }
      );
    } else {
      console.log('enabling permission');
      chromeAPI.permissions.request(
        {
          permissions: ['gcm'],
        },
        (granted) => {
          if (!granted) return;
          console.log('granted');
        }
      );
    }
  },
  hasRegistration: async () => {
    const result = await stores.local.get({ key: 'registerId' });
    return result;
  },
  setRegistration: async (value) => {
    const result = await stores.local.set({ key: 'registerId', value });
    return result;
  },
  removeRegistration: async () => {
    const result = await stores.local.remove({ key: 'registerId' });
    return result;
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
