<template>
  <div class="details" :class="addClasses" @drop="onDrop($event)" ref="details">
    <div v-if="dateTitle" :style="todayDate" class="dateTitle">
      {{ dayNumber }}
    </div>
    <ul ref="entryList" class="entryList">
      <Entry
        v-for="(entry, index) in entries"
        v-bind:entry="entry"
        :dragStart="dragStart"
        :dragEnd="dragEnd"
        :listDate="listDate"
        :index="index"
        :checkEntry="checkEntry"
        :colorEntry="colorEntry"
        :deleteEntry="deleteEntry"
        :submitEntry="submitEntry"
        :key="entry.id"
      />
    </ul>
    <button @click="addEntry" :value="dateStamp" class="addButton">+</button>
  </div>
</template>

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
    dateTitle: {
      type: Boolean,
      required: false,
    },
    classNames: {
      type: Array,
      required: false,
    },
  },
  data() {
    return {
      entries: [],
      isOver: false,
    };
  },
  created() {
    // We do this to get the entries for the date
    this.getEntries();
  },
  watch: {
    listDate(newValue) {
      this.getEntries();
    },
  },

  mounted() {
    this.$refs.details.addEventListener("dragover", () => {
      this.isOver = true;
    });
    this.$refs.details.addEventListener("dragleave", () => {
      this.isOver = false;
    });
    this.$refs.details.addEventListener("drop", () => {
      this.isOver = false;
    });
  },
  // This is how we can check if a prop has changed

  methods: {
    addEntry() {
      // Add to entries state and to chrome storage
      let newEntry = {
        key: uuid(),
        text: "",
        color: "blue",
        active: false,
      };
      this.entries.push(newEntry);
    },
    checkEntry(key) {
      let index = this.entries.map((entry) => entry.key).indexOf(key);
      let currentState = this.entries[index].active;
      this.entries[index].active = !currentState;
      this.updateStorage();
    },
    colorEntry() {
      this.updateStorage();
    },
    deleteEntry(key) {
      // https://stackoverflow.com/questions/8668174/indexof-method-in-an-object-array
      let index = this.entries.map((entry) => entry.key).indexOf(key);
      this.entries.splice(index, 1);
      this.updateStorage();
    },

    // https://learnvue.co/2020/01/how-to-add-drag-and-drop-to-your-vuejs-project/
    // Start of drag
    dragStart(evt, entry) {
      // We need a callback so we can remove from the original data and entries list
      evt.dataTransfer.dropEffect = "move";
      evt.dataTransfer.effectAllowed = "move";
      evt.dataTransfer.setData("key", entry.key);
      evt.dataTransfer.setData("complete", entry.active);
      evt.dataTransfer.setData("entry", entry.text);
      evt.dataTransfer.setData("color", entry.color);
    },

    // This will allow us to delete from the original list
    dragEnd(evt, key) {
      this.deleteEntry(key);
    },

    getEntries() {
      let dateStamp = this.listDate.toLocaleDateString();
      chrome.storage.sync.get([dateStamp], (result) => {
        this.entries = Object.keys(result).length > 0 ? result[dateStamp] : [];
      });
    },

    // This is how we add to the new list
    onDrop(evt) {
      const entryKey = evt.dataTransfer.getData("key");
      const entryColor = evt.dataTransfer.getData("color");
      const entryActive = JSON.parse(evt.dataTransfer.getData("complete"));
      const entryText = evt.dataTransfer.getData("entry");
      const entry = {
        key: entryKey,
        color: entryColor,
        text: entryText,
        active: entryActive,
      };
      this.entries.unshift(entry); // might change it back to push later, unsure
      this.updateStorage();
    },

    submitEntry(text, key) {
      let index = this.entries.map((entry) => entry.key).indexOf(key);
      if (text.length === 0) {
        this.entries.splice(index, 1);
      } else {
        this.entries[index].text = text;
        this.updateStorage();
      }
    },
    updateStorage() {
      let currentDate = this.listDate.toLocaleDateString();
      chrome.storage.sync.set({ [currentDate]: this.entries });
    },
  },
  computed: {
    dateStamp() {
      return this.listDate.toLocaleDateString();
    },
    dayNumber() {
      return this.listDate.getDate();
    },
    todayDate() {
      if (
        this.listDate.toLocaleDateString() === new Date().toLocaleDateString()
      ) {
        return {
          background: "rgba(5,80,123,0.992)",
          borderRadius: "75px",
        };
      }
    },
    addClasses() {
      // classnames is a list
      if (this.isOver) {
        let classList = this.classNames.slice();
        classList.push("over");
        return classList;
      }
      return this.classNames;
    },
  },
};
</script>
<style scoped lang="scss">
.over {
  background: rgba(37, 37, 37, 0.329) !important;
}

.details {
  overflow: auto;
  height: 20rem;

  .dateTitle {
    font-weight: 0;
    border-radius: 12px;
    margin-bottom: 0.25rem;
    width: 20px;
    height: 20px;
    min-width: 16px;
    // padding: 4px 3px 0 3px;
    text-align: center;
  }
  .entryList {
    list-style-type: none;
    padding: 0;
    display: flex;
    align-items: center;
    flex-direction: column;
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

  // CANT USE THIS YET, looks bad over a light background
  // For scrollbar hover over
  // mask-image: linear-gradient(to top, transparent, black),
  //   linear-gradient(to left, transparent 17px, black 17px);
  // mask-size: 100% 20000px;
  // mask-position: left bottom;
  // transition: mask-position 0.5s;
  // //

  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-thumb {
    // height: 6px;
    width: 10px;
    border: 4px solid rgba(0, 0, 0, 0);
    background-clip: padding-box;
    background-color: #888;
    // background-color: #888;
    // background-color: none;
    background-color: none;

    transition: background 0.5s;
    box-shadow: inset -1px -1px 0px rgb(0 0 0 / 5%),
      inset 1px 1px 0px rgb(0 0 0 / 5%);
    border-radius: 25px;
  }
  &::-webkit-scrollbar-button {
    width: 0;
    height: 0;
    display: none;
  }
  &:hover {
    mask-position: left top;
    // &::-webkit-scrollbar-thumb {
    // height: 6px;
    // width: 10px;
    // border: 4px solid rgba(0, 0, 0, 0);
    // background-clip: padding-box;
    // background-color: #888;
    // box-shadow: inset -1px -1px 0px rgb(0 0 0 / 5%),
    // inset 1px 1px 0px rgb(0 0 0 / 5%);
    // border-radius: 25px;
    // }
    .addButton {
      opacity: 1;
    }
  }
}
</style>
