import { reactive } from "vue";

class Container {
  constructor() {
    this.storage = {}
  }
  /**
   * Retrieve value
   * @param key 
   */
  get(key, cb) {
    if (!key) {
      return cb(this.storage)
    }
    // check if keys is array
    if (Array.isArray(key)) {
      // find all the items listed in key
      let arr = [];
      key.forEach(item => {
        if (this.storage[item]) {
          arr.push(this.storage[item])
        }
      })
      cb(arr);
    }

    return cb(this.storage[key])
  }

  remove(cb) {
    delete this.storage[key]
    return cb(true);
  }

  set(obj, cb) {
    // bring object into storage
    this.storage = {
      ...this.storage,
      ...obj
    }
    return cb(true);
  }
}
class Store {
  constructor() {
    this.sync = new Container();
    this.local = new Container();
  }
}

const store = chrome.storage || new Store();

/**
 * Use the local storage if an entry is being set to a date more than a week in the past
 * @param {*} date 
 * @returns 
 */
const storageType = (date) => {
  const todayDate = new Date();
  const entryListDate = new Date(date.replaceAll('_', '/'));
  const weekMS = 1000 * 60 * 60 * 24 * 7
  if (todayDate.getTime() - entryListDate.getTime() > weekMS) {
    return 'sync'
  } else {
    return 'local'
  }
}

// Local storage manipulation
const local = {
  /** 
    Get entryDate objects from chrome.storage.local asynchronously and return them 
    to use on our Entry Lists
  */
  get: async ({ key }) => {
    console.log('getLocal')
    return new Promise((resolve, reject) => {
      store.local.get([key], (result) => {
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
      store.local.set({ [key]: value }, (result) => {
        resolve(result);
      });
    });
  },
  remove: async ({ key }) => {
    return new Promise((resolve, reject) => {
      store.local.remove([key], (result) => {
        resolve(result);
      });
    });
  },
  clear: async () => {
    return new Promise((resolve, reject) => {
      // remove everything from storage besides background info and userSettings
      store.local.get(null, result => {
        for (const key in result) {
          removeLocal({ key })
        }
        resolve({})
      })

    })
  }
}

// Sync storage manipulation
const sync = {
  /**
   * Returns an array of entries based on the key provided
   * @param {string} key 
   * @returns {Array}
   */
  get: async ({ key }) => {
    console.log('getSync');
    return new Promise((resolve, reject) => {
      store.sync.get([key], (result) => {
        console.log(result);
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
      store.sync.set({ [key]: value }, (result) => {
        resolve(result);
      });
    });
  },

  remove: async ({ key }) => {
    return new Promise((resolve, reject) => {
      store.sync.remove([key], (result) => {
        resolve(result);
      });
    });
  },

  clear: async () => {
    console.log('clearSync');
    return new Promise((resolve, reject) => {
      // remove everything from storage besides background info and userSettings
      store.sync.get(null, result => {
        console.log('result');
        console.log(result);
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

const stores = {
  local,
  sync
}

export const state = reactive({
  date: new Date(),
  userSettings: {},
  background: {}
});

export const actions = {
  initUserSettings: async () => {
    let userSettings = await stores.sync.get({ key: 'userSettings' })
    if (!userSettings) return;
    state.userSettings = userSettings
  },
  initBackground: async () => {
    let background = await stores.sync.get({ key: 'background' })
    if (!background) return;
    state.background = background;
  },
  setBackground: () => {
    stores.sync.set({ key: 'background', value: state.background })
  },
  setUserSettings: () => {
    stores.sync.set({ key: 'userSettings', value: state.userSettings })
  },
  setDate: (key) => {
    state.date = date;
  },
  resetSyncDatabase: async () => {
    await stores.sync.clearSync()
  },
  create: async ({ date, entry }) => {
    console.log('create');
    const type = storageType(date);
    try {
      const dateArr = await stores[type].get({ key: date })
      dateArr.push(entry);
      stores[type].set({ key: date, value: dateArr })
    } catch (e) {
      console.error(e)
    }
  },
  read: async ({ date }) => {
    console.log('read');
    const type = storageType(date);
    try {
      return stores[type].get({ key: date })
    } catch (e) {
      console.error(e)
    }
  },
  update: async ({ date, entry, key }) => {
    console.log('update');
    const type = storageType(date);
    const dateArr = await stores[type].get({ key: date })
    const index = dateArr.findIndex(e => e.key === key);
    dateArr[index] = entry;
    const result = await stores[type].set({ key: date, value: dateArr })
    return result;
  },
  delete: async ({ date, key }) => {
    console.log('delete');
    let results;
    const type = storageType(date);
    const dateArray = await stores[type].get({ key: date })
    const index = dateArray.findIndex(e => e.key === key);
    console.log(dateArray);
    dateArray.splice(index, 1)
    if (dateArray.length === 0) {
      console.log('Delete Date')
      results = await stores[type].remove({ key: date })
    } else {
      console.log('Set new array')
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
  createAlarm: ({ name, time }) => {
    chrome.permissions.contains({ permissions: ["notifications"] }, (result) => {
      // If allowed, create an alarm for this entry
      if (result) {
        chrome.alarms.create(name, {
          when: time,
        });
      }
    })
  },

  showDefaultTab: () => {
    chrome.tabs.update({
      url: "chrome-search://local-ntp/local-ntp.html",
    });
  }


};