import Vue from "vue";

// Local storage manipulation
/** 
  Get entryDate objects from chrome.storage.local asynchronously and return them 
  to use on our Entry Lists
*/
const getChromeStorageLocal = async ({ date }) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([date], (result) => {
      if (Object.keys(result).length > 0) {
        resolve(result[date]); // this should return everything
      }
      resolve({});
    });
  });
}
const setChromeStorageLocal = async ({ date, dateObject }) => {
  // maybe use sync instead if the user is logged in?
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [date]: dateObject }, (result) => {
      resolve(result);
    });
  });
};
const removeChromeStorageLocal = async ({ date }) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove([date], (result) => {
      resolve(result);
    });
  });
};
const clearChromeStorageLocal = async ({ }) => {
  return new Promise((resolve, reject) => {
    // remove everything from storage besides background info and userSettings
    chrome.storage.local.get(null, result => {
      delete result.userSettings;
      delete result.background;
      for (const key in result) {
        removeChromeStorageLocal({ key })
      }
    })
  })
}

// Sync Storage Manipulation

/** 
  Get entryDate objects from chrome.storage.sync asynchronously and return them 
  to use on our Entry Lists
*/
const getChromeStorageSync = async ({ date }) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([date], (result) => {
      if (Object.keys(result).length > 0) {
        resolve(result[date]); // this should return everything
      }
      resolve({});
    });
  });
};

/** 
  Set entry objects to our chrome.storage.sync asynchronously
  @param date: A date string
  @param dateObject: an object of the date that contains the entries
*/

const setChromeStorageSync = async ({ date, dateObject }) => {
  // maybe use sync instead if the user is logged in?
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [date]: dateObject }, (result) => {
      resolve(result);
    });
  });
};

const removeChromeStorageSync = async ({ date }) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.remove([date], (result) => {
      resolve(result);
    });
  });
};

const clearChromeStorageSync = async ({ }) => {
  return new Promise((resolve, reject) => {
    // remove everything from storage besides background info and userSettings
    chrome.storage.sync.get(null, result => {
      delete result.userSettings;
      delete result.background;
      for (const key in result) {
        removeChromeStorageSync({ key })
      }
    })
  })
}
// End Sync Storage Manipulation


// What is update list?
export const state = Vue.observable({
  date: new Date(),
  userSettings: {}
});

// CRUD Functions

/**
 * A store item with a set of CRUD functions and some stateful properties
 */

export const actions = {
  setDate: (date) => {
    state.date = date;
  },

  // Reload Database
  resetSyncDatabase: async () => {
    await clearChromeStorageSync()
  },

  // ==================
  // CREATE
    /**
   * Create items from our chrome.storage.sync, chrome.storage.local, and/or Firestore.
   * @param string date pass in a string of date to our read function
   */
  create: async ({ date, entry, key }) => {
    const dateObject = await getChromeStorageSync({ date });
    dateObject[key] = entry;
    const results = await setChromeStorageSync({ date, dateObject });
  },

  // ==================
  // READ DATA
  // https://firebase.google.com/docs/firestore/query-data/get-data
  /**
   * Read items from our chrome.storage.sync, chrome.storage.local, and/or Firestore.
   * @param string date pass in a string of date to our read function
   */

  read: async ({ date }) => {
    // Get all items
    let dateObject = await getChromeStorageSync({ date });
    // Check if dateObject is empty
    if (Object.keys(dateObject).length === 0) {
      // Get time items in order to check if this was about a month ago
      const todayDate = new Date();
      const entryListDate = new Date(date);
      const monthMS = 1000 * 60 * 60 * 24 * 30
      // If entryListDate is from ago, then lets check our local storage
      if (todayDate.getTime() - entryListDate.getTime() > monthMS) {
        // then lets check the local storage instead
        dateObject = await getChromeStorageLocal({ date })

        // cant really think that anyone would add something 
        // from the past
      }
    }
    return dateObject;
  },

  // ==================
  // UPDATE
  /**
   * Update an existing entry with new properties
   * @returns entry
   */
  update: async ({ date, entry, key }) => {
    // console.log("Update in storage");
    let dateObject = await getChromeStorageSync({ date });
    let result;
    if (key in dateObject) {
      dateObject[key] = entry;
      result = await setChromeStorageSync({ date, dateObject });
    } else {
      dateObject = await getChromeStorageLocal({ date })
      dateObject[key] = entry;
      result = await setChromeStorageLocal({ date, dateObject });
    }
    return result;
  },

  // ==================
  // DELETE
  /**
   * Deletes an item in 
   */
  delete: async ({ date, key }) => {
    let dateObject = await getChromeStorageSync({ date });
    let results;
    if (key in dateObject) {
      delete dateObject[key];
      if (Object.keys(dateObject).length === 0) {
        results = await removeChromeStorageSync({ date });
      } else {
        results = await setChromeStorageSync({ date, dateObject });
      }
    } else {
      dateObject = await getChromeStorageLocal({ date })
      delete dateObject[key]
      if (Object.keys(dateObject).length === 0) {
        results = await removeChromeStorageLocal({ date })
      } else {
        results = await setChromeStorageLocal({ date, dateObject })
      }
    }
    return results;
  },
};