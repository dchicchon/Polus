<template>
  <div>
    <h3>Dev</h3>
    <button @click="checkAlarms">Check Alarms</button>
    <button @click="reloadFirestore">Reload Firestore</button>
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
        for (const alarm of result) {
          for (const key in alarm) {
            const textElm = document.createElement("p");
            let text = "";
            if (key === "scheduledTime") {
              const ms = alarm[key];
              const scheduledDate = new Date(ms);
              text = scheduledDate.tosynceString();
            } else {
              text = alarm[key];
            }
            textElm.textContent = `${key} : ${text}`;
            logs.append(textElm);
          }
        }
        console.log(result);
      });
    },
    reloadFirestore() {
      console.log("Reloading Firestore");
      chrome.storage.sync.set({ reload: true });
      // maybe here we can set some things to local?
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