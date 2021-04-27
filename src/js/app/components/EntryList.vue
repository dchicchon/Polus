<template>
  <div class="details">
    <ul ref="entryList" class="entryList">
      <Entry v-for="entry in entries" v-bind:entry="entry" :key="entry.id" />
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
    // console.log("Render List");
    let dateStamp = this.listDate.toLocaleDateString();
    chrome.storage.sync.get([dateStamp], (result) => {
      this.entries = Object.values(result[dateStamp]);
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
    submitEntry() {
      let currentDate = this.listDate.toLocaleDateString();
      chrome.storage.sync.set({ [currentDate]: oldArr }, () => {
        console.log("added to storage");
      });
    },
  },
  computed: {
    dateStamp() {
      return this.listDate.toLocaleDateString();
    },
  },
};
</script>
