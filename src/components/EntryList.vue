<template>
  <div
    class="details"
    :class="addClasses"
    @drop="onDrop($event)"
    @dragover.prevent
    ref="details"
  >
    <div v-if="dateTitle" :style="todayDate" class="dateTitle">
      {{ dayNumber }}
    </div>

    <ul v-if="entries.length" ref="entryList" class="entryList">
      <Entry
        v-for="(entry, index) in entries"
        :key="index"
        :entry="entry"
        draggable="true"
        @dragstart="dragStart($event, entry.key, entry, id)"
        :createEntry="createEntry"
        :updateEntry="updateEntry"
        :deleteEntry="deleteEntry"
        :listDate="listDate"
      />
    </ul>
    <ul v-else ref="entryList" class="entryList"></ul>

    <button @click="initEntry" :value="dateStamp" class="addButton">+</button>
  </div>
</template>

<script>
import { toRaw } from "vue";
import Entry from "./Entry.vue";
import { actions } from "../utils";
import shortid from "shortid";
// https://stackoverflow.com/questions/18548465/prevent-scroll-bar-from-adding-up-to-the-width-of-page-on-chrome
export default {
  components: {
    Entry,
  },
  props: {
    id: {
      type: Number,
      required: false,
    },
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
    this.readEntries();
  },
  mounted() {
    // https://learnvue.co/2020/01/how-to-add-drag-and-drop-to-your-vuejs-project/
    this.$refs.details.addEventListener("dragenter", () => {
      this.isOver = true;
    });
    this.$refs.details.addEventListener("dragleave", () => {
      this.isOver = false;
    });
  },
  watch: {
    // do this if we change the date
    listDate(newValue) {
      this.readEntries();
    },
  },
  methods: {
    initEntry() {
      console.info("initEntry");
      // Add to entries state and to chrome storage
      const key = shortid.generate();
      let newEntry = {
        key,
        text: "",
        color: "blue",
        active: false,
        new: true,
      };
      // Need to use Vue.set in order to have reactivity for objects
      this.entries.push(newEntry);
    },

    //===============
    // DRAG FUNCTIONS
    // https://learnvue.co/2020/01/how-to-add-drag-and-drop-to-your-vuejs-project/
    dragStart(evt, key, entry, parentId) {
      console.info("dragStart");
      // We need a callback so we can remove from the original data and entries list
      evt.dataTransfer.dropEffect = "move";
      evt.dataTransfer.effectAllowed = "move";

      // https://stackoverflow.com/questions/9533585/drag-drop-html-5-jquery-e-datatransfer-setdata-with-json
      evt.dataTransfer.setData("text/plain", JSON.stringify(entry));
      evt.dataTransfer.setData("parentId", parentId);
      evt.dataTransfer.setData("key", key);
    },
    // On drop, we will add to our list and delete from old one
    onDrop(evt) {
      console.info("onDrop");
      this.isOver = false;
      // get original parent id
      const parentId = parseInt(evt.dataTransfer.getData("parentId"));
      const key = evt.dataTransfer.getData("key");

      // If in the same list, exit the function
      if (parentId === this.id) return;

      // Else, lets grab the data from datatransfer
      const entryJSON = evt.dataTransfer.getData("text/plain");
      const entry = JSON.parse(entryJSON);

      this.$parent.$refs[parentId][0].deleteEntry(key);

      this.entries.push(entry);
      this.createEntry(entry);
    },

    createEntry(entry) {
      console.info("createEntry");
      const index = toRaw(this.entries).findIndex((e) => e.key === entry.key);
      if (entry.text.length === 0) {
        this.entries.splice(index, 1);
        return;
      }
      delete this.entries[index].new;
      actions
        .create({ date: this.dateStamp, entry, key: entry.key })
        .then((result) => {
          console.info({ result });
        })
        .catch((e) => console.error(e));
    },
    readEntries() {
      console.info("readEntries");
      actions
        .read({ date: this.dateStamp })
        .then((result) => {
          console.info({ result });
          this.entries = result;
        })
        .catch((e) => console.error(e));
    },
    updateEntry(key) {
      console.info("updateEntry");
      // check if entry is any different than before
      const index = this.entries.findIndex((e) => e.key === key);
      actions
        .update({ date: this.dateStamp, entry: this.entries[index], key })
        .then((result) => {
          console.info({ result });
        })
        .catch((e) => console.error(e));
    },
    deleteEntry(key) {
      console.info("Delete Entry");
      const entries = toRaw(this.entries);
      const index = entries.findIndex((e) => e.key === key);
      if (this.entries[index].hasOwnProperty("time")) {
        chrome.alarms.clear(key); // clearing alarm if it has time
      }
      this.entries.splice(index, 1);
      actions
        .delete({ date: this.dateStamp, key })
        .then((result) => {
          console.info({ result });
        })
        .catch((e) => console.error(e));
    },
  },
  computed: {
    dateStamp() {
      return this.listDate.toLocaleDateString("en-US").replaceAll("/", "_");
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
      if (this.isOver && this.classNames) {
        let classList = this.classNames.slice();
        classList.push("over");
        return classList;
      }
      return this.classNames;
    },
  },
};
</script>

<style lang="scss" scoped>
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
