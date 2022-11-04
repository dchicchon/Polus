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


const useLocal = (date) => {
  const todayDate = new Date();
  const entryListDate = new Date(date);
  const monthMS = 1000 * 60 * 60 * 24 * 30
  return todayDate.getTime() - entryListDate.getTime() > monthMS
}

// Local storage manipulation
/** 
  Get entryDate objects from chrome.storage.local asynchronously and return them 
  to use on our Entry Lists
*/
const getLocal = async ({ key }) => {
  return new Promise((resolve, reject) => {
    store.local.get([key], (result) => {
      if (Object.keys(result).length > 0) {
        resolve(result[key]); // this should return everything
      }
      resolve({});
    });
  });
}
const setLocal = async ({ key, value }) => {
  // maybe use sync instead if the user is logged in?
  return new Promise((resolve, reject) => {
    store.local.set({ [key]: value }, (result) => {
      resolve(result);
    });
  });
};
const removeLocal = async ({ key }) => {
  return new Promise((resolve, reject) => {
    store.local.remove([key], (result) => {
      resolve(result);
    });
  });
};

const clearLocal = async ({ }) => {
  return new Promise((resolve, reject) => {
    // remove everything from storage besides background info and userSettings
    store.local.get(null, result => {
      delete result.userSettings;
      delete result.background;
      for (const key in result) {
        removeLocal({ key })
      }
      resolve({})
    })

  })
}

// SYNC
const getSync = async ({ key }) => {
  return new Promise((resolve, reject) => {
    store.sync.get([key], (result) => {
      if (Object.keys(result).length > 0) {
        resolve(result[key]); // this should return everything
      }
      resolve({});
    });
  });
};

const setSync = async ({ key, value }) => {
  // maybe use sync instead if the user is logged in?
  return new Promise((resolve, reject) => {
    store.sync.set({ [key]: value }, (result) => {
      resolve(result);
    });
  });
};

const removeSync = async ({ key }) => {
  return new Promise((resolve, reject) => {
    store.sync.remove([key], (result) => {
      resolve(result);
    });
  });
};

const clearSync = async ({ }) => {
  return new Promise((resolve, reject) => {
    // remove everything from storage besides background info and userSettings
    store.sync.get(null, result => {
      delete result.userSettings;
      delete result.background;
      for (const key in result) {
        removeSync({ key })
      }
      resolve({})
    })
  })
}

export const state = reactive({
  date: new Date(),
  userSettings: {},
  background: {}
});

export const actions = {
  initUserSettings: async () => {
    let userSettings = await getSync({ key: 'userSettings' })
    if (!userSettings) return;
    state.userSettings = userSettings
  },
  initBackground: async () => {
    let background = await getSync({ key: 'background' })
    if (!background) return;
    state.background = background;
  },
  setBackground: () => {
    setSync({ key: 'background', value: state.background })
  },
  setUserSettings: () => {
    setSync({ key: 'userSettings', value: state.userSettings })
  },
  setDate: (key) => {
    state.date = date;
  },
  resetSyncDatabase: async () => {
    await clearSync()
  },
  create: async ({ date, entry, key }) => {
    try {
      if (useLocal(date)) {
        const dateObject = await getLocal({ key: date });
        dateObject[key] = entry;
        await setLocal({ key: date, value: dateObject });
      } else {
        const dateObject = await getSync({ key: date });
        dateObject[key] = entry;
        await setSync({ key: date, value: dateObject });

      }
    } catch (e) {
      console.error(e)
    }

  },
  read: async ({ date }) => {
    try {
      let dateObject
      if (useLocal(date)) {
        dateObject = await getLocal({ key: date })
      } else {
        dateObject = await getSync({ key: date });
      }
      return dateObject
    } catch (e) {
      console.error(e)
    }
  },
  update: async ({ date, entry, key }) => {
    let dateObject = await getSync({ key: date });
    let result;
    if (key in dateObject) {
      dateObject[key] = entry;
      result = await setSync({ key: date, value: dateObject });
    } else {
      dateObject = await getLocal({ date })
      dateObject[key] = entry;
      result = await setLocal({ key: date, value: dateObject });
    }
    return result;
  },

  delete: async ({ date, key }) => {
    let dateObject = await getSync({ key: date });
    let results;
    if (key in dateObject) {
      delete dateObject[key];
      if (Object.keys(dateObject).length === 0) {
        results = await removeSync({ key: date });
      } else {
        results = await setSync({ key: date, value: dateObject });
      }
    } else {
      dateObject = await getLocal({ key: date })
      delete dateObject[key]
      if (Object.keys(dateObject).length === 0) {
        results = await removeLocal({ key: date })
      } else {
        results = await setLocal({ key: date, value: dateObject })
      }
    }
    return results;
  },
  /**
  * Creates an alarm in chrome 
  * @param name - name of alarm
  * @param time - time for alarm to go off
  * @returns void
  * @type {{name: String, time: Number}} 
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