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
  },
  methods: {
    checkAlarms() {
      chrome.alarms.getAll((result) => {
        let textList = [];
        for (const alarm of result) {
          for (const key in alarm) {
            const textElm = document.createElement("p");
            let text = "";
            if (key === "scheduledTime") {
              const ms = alarm[key];
              const scheduledDate = new Date(ms);
              text = scheduledDate.toLocaleString();
            } else {
              text = alarm[key];
            }
            textList.push(`${key} : ${text}`);
          }
        }
        this.addToLog(textList);
      });
    },
    moveToLocal() {
      let textList = [];
      textList.push("Moving to local");
      chrome.storage.sync.get(null, (result) => {
        delete result.userSettings;
        delete result.background;
        for (const date in result) {
          textList.push(`Checking ${date.toLocaleString()}...`);
          const today = new Date();
          const entryDate = new Date(date);
          // check if its older than a month old
          const monthMS = 1000 * 60 * 60 * 24 * 30;
          if (today.getTime() - entryDate.getTime() > monthMS) {
            // place the date inside of localStorage and deletefrom syncStorage
            chrome.storage.local.set({ [date]: result[date] }, () => {
              textList.push(`${date.toLocaleString()} added to localStorage`);

              chrome.storage.sync.remove([date]);
            });
          }
        }
      });
      this.addToLog(textList);
    },

    addToLog(textArr) {
      const logs = document.getElementById("logs");
      logs.innerHTML = "";
      for (let text of textArr) {
        let textElm = document.createElement("p");
        textElm.textContent = text;
        logs.append(textElm);
      }
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
