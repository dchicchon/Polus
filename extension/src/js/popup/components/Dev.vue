<template>
  <div>
    <h3>Dev</h3>
    <button @click="checkAlarms">Check Alarms</button>
    <button @click="moveToLocal">moveToLocal</button>
    <h4>Logs</h4>
    <div id="logs"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() { 
    // chrome.storage.sync.get(["reload"], (result) => {
    //   console.log("Current State");
    //   console.log(result);
    // });
  },
  methods: {
    checkAlarms() {
      chrome.alarms.getAll((result) => {
        const logs = document.getElementById("logs");
        logs.innerHTML = "";
        console.log(result);
        for (const alarm of result) {
          for (const key in alarm) {
            console.log(key);
            const textElm = document.createElement("p");
            let text = "";
            if (key === "scheduledTime") {
              const ms = alarm[key];
              const scheduledDate = new Date(ms);
              text = scheduledDate.toLocaleString();
            } else {
              text = alarm[key];
            }
            textElm.textContent = `${key} : ${text}`;
            logs.append(textElm);
          }
        }
      });
    },

    moveToLocal() {
      chrome.storage.sync.get(null, (result) => {
        delete result.userSettings;
        delete result.background;
        // go through our items
        for (const date in result) {
          const today = new Date();
          const entryDate = new Date(date);
          // check if its older than a month old
          const monthMS = 1000 * 60 * 60 * 24 * 30;
          if (today.getTime() - entryDate.getTime() > monthMS) {
            // place the date inside of localStorage and deletefrom syncStorage
            chrome.storage.local.set({ [date]: result[date] }, () => {
              chrome.storage.sync.remove([date]);
            });
          }
        }
      });
    },

    addMaxItemsTosync() {
      // check the amount of items in storage
      chrome.storage.sync.get(null, (result) => {
        console.log(Object.keys(result).length);

        // Go until 360 items in storage
        let currentLength = Object.keys(result).length;
        while (currentLength < 360) {
          const keyName = `TestItem${currentLength}}`;
          chrome.storage.sync.set({ keyName: 1 });
          currentLength++;
        }
        // Now show the popup modal
        // chrome.storage.sync.set({maxItemsReached: true})
      });
    },
  },
};
</script>
<style lang="scss" scoped>
#logs {
  padding: 5px;
  height: 40vh;
  overflow: auto;
  width: 100%;
  border: 1px solid black;
}
</style>
