<template>
  <div class="details">
    <ul ref="entryList" class="entryList">
      <Entry
        v-for="(entry, index) in entries"
        v-bind:entry="entry"
        :listDate="listDate"
        :index="index"
        :submitEntry="submitEntry"
        :key="entry.id"
      />
    </ul>
    <button @click="addEntry" :value="dateStamp" class="addButton">+</button>
  </div>
</template>

<style lang="scss">
.details {
  overflow: auto;
  height: 14rem;
  .entryList {
    list-style-type: none;
    padding: 0;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  &:hover {
    .addButton {
      opacity: 1;
    }
  }
}

.addButton {
  background: none;
  width: 1.5rem;
  font-size: 1.25rem;
  border-radius: 100%;
  opacity: 0;
  transition: background 0.5s, opacity 0.5s;
  padding: 0 0.4rem;
}
</style>

<script>
import Entry from "./Entry";
import uuid from "uuid/v4";
export default {
  components: {
    Entry,
  },
  // Eventually pass in props for styling component
  props: {
    listDate: {
      type: Date,
      required: true,
    },
  },
  data() {
    return {
      entries: [],
    };
  },
  created() {
    // We do this to get the entries for the date
    let dateStamp = this.listDate.toLocaleDateString();
    chrome.storage.sync.get([dateStamp], (result) => {
      this.entries = Object.keys(result).length > 0 ? result[dateStamp] : [];
    });
  },
  // This is how we can check if a prop has changed
  watch: {
    listDate(newValue) {
      let dateStamp = this.listDate.toLocaleDateString();
      chrome.storage.sync.get([dateStamp], (result) => {
        this.entries = Object.keys(result).length > 0 ? result[dateStamp] : [];
      });
    },
  },

  methods: {
    addEntry() {
      // Add to entries state and to chrome storage
      let copyArr = this.entries.slice();
      let newEntry = {
        key: uuid(),
        text: "",
        color: "blue",
        complete: false,
      };
      copyArr.push(newEntry);
      this.entries = copyArr;
    },
    submitEntry(text, index) {
      let copyArr = this.entries.slice();
      if (text.length === 0) {
        copyArr.splice(index, 1);
        this.entries = copyArr;
      } else {
        let copyArr = this.entries.slice();
        let entry = copyArr[index];
        entry.text = text;
        console.log(copyArr);
        let currentDate = this.listDate.toLocaleDateString();
        chrome.storage.sync.set({ [currentDate]: copyArr });
      }
    },
  },
  computed: {
    dateStamp() {
      return this.listDate.toLocaleDateString();
    },
  },
};
</script>
