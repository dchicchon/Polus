import { reactive } from "vue";

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
    chrome.storage.local.get([key], (result) => {
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
    chrome.storage.local.set({ [key]: value }, (result) => {
      resolve(result);
    });
  });
};
const removeLocal = async ({ key }) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove([key], (result) => {
      resolve(result);
    });
  });
};

const clearLocal = async ({ }) => {
  return new Promise((resolve, reject) => {
    // remove everything from storage besides background info and userSettings
    chrome.storage.local.get(null, result => {
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
    chrome.storage.sync.get([key], (result) => {
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
    chrome.storage.sync.set({ [key]: value }, (result) => {
      resolve(result);
    });
  });
};

const removeSync = async ({ key }) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.remove([key], (result) => {
      resolve(result);
    });
  });
};

const clearSync = async ({ }) => {
  return new Promise((resolve, reject) => {
    // remove everything from storage besides background info and userSettings
    chrome.storage.sync.get(null, result => {
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
    actions.setUserSettings(userSettings)
  },
  initBackground: async () => {
    let background = await getSync({ key: 'background' })
    if (!background) return;
    actions.setBackground(background)
  },
  setBackground: (background) => {
    state.background = background;
    setSync({ key: 'background', value: background })
  },
  setUserSettings: (userSettings) => {
    state.userSettings = userSettings
    setSync({ key: 'userSettings', value: userSettings })
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
      dateObject = await getChromeStorageLocal({ key: date })
      delete dateObject[key]
      if (Object.keys(dateObject).length === 0) {
        results = await removeChromeStorageLocal({ key: date })
      } else {
        results = await setChromeStorageLocal({ key: date, value: dateObject })
      }
    }
    return results;
  },
};