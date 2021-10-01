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

    <ul v-if="Object.keys(entries).length" ref="entryList" class="entryList">
      <Entry
        v-for="(entry, key, index) in entries"
        :key="index"
        :entryKey="key"
        :entry="entry"
        :createEntry="createEntry"
        :updateEntry="updateEntry"
        :deleteEntry="deleteEntry"
        :listDate="listDate"
        :dragStart="dragStart"
      />
    </ul>
    <ul v-else ref="entryList" class="entryList"></ul>

    <button @click="initEntry" :value="dateStamp" class="addButton">+</button>
  </div>
</template>

<script>
import Entry from "../Entry.vue";
import { onAuthStateChanged } from "firebase/auth";
import { actions } from "../../utils/store";
import shortid from "shortid";
import Vue from "vue";
// https://stackoverflow.com/questions/18548465/prevent-scroll-bar-from-adding-up-to-the-width-of-page-on-chrome
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
      entries: {},
      isOver: false,
    };
  },

  created() {
    // Create an event listener for if the alarm of reloadFirestore
    // goes off
    // chrome.storage.onChanged.addListener(this.checkChanges);
    this.readEntries();
    onAuthStateChanged(this.$auth, this.readEntries); // this watches to see if a user logs in or logs off
  },

  watch: {
    // do this if we change the date
    listDate(newValue) {
      this.readEntries();
    },
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

  methods: {
    initEntry() {
      // console.log("Init Entry");
      // Add to entries state and to chrome storage
      let newEntry = {
        text: "",
        color: "blue",
        active: false,
        new: true,
      };

      // Need to use Vue.set in order to have reactivity for objects
      Vue.set(this.entries, shortid.generate(), newEntry);
    },

    //===============
    // DRAG FUNCTIONS
    //===============
    // https://learnvue.co/2020/01/how-to-add-drag-and-drop-to-your-vuejs-project/
    // Start of drag
    dragStart(evt, key, entry, parentId) {
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
      this.isOver = false;
      // get original parent id
      const parentId = parseInt(evt.dataTransfer.getData("parentId"));
      const key = evt.dataTransfer.getData("key");

      // If in the same list, exit the function
      if (parentId === this._uid) return;

      // Else, lets grab the data from datatransfer
      const entryJSON = evt.dataTransfer.getData("text/plain");
      const entry = JSON.parse(entryJSON);

      // find the original parent component by reference of this parent
      let originalParent = this.$parent.$children.filter(
        (list) => list._uid === parentId
      )[0];

      originalParent.deleteEntry(key);
      Vue.set(this.entries, key, entry);
      this.createEntry(entry, key);
    },
    // END DRAG FUNCTIONS

    //===============
    // CRUD FUNCTIONS
    //===============
    createEntry(entry, key) {
      if (entry.text.length === 0) {
        Vue.delete(this.entries, key);
      } else {
        Vue.delete(this.entries[key], "new");
        actions
          .create({ date: this.dateStamp, entry, key })
          .then((result) => {
            // console.log(result);
          })
          .catch((e) => console.error(e));
      }
    },
    readEntries() {
      actions
        .read({ date: this.dateStamp })
        .then((result) => {
          this.entries = result;
        })
        .catch((e) => console.error(e));
    },

    updateEntry(key) {
      console.log("Read Entries");
      // check if entry is any different than before
      // Instead of doing just this i should specify what is being changed maybe?
      Vue.set(this.entries, key, this.entries[key]);
      actions
        .update({ date: this.dateStamp, entry: this.entries[key], key })
        .then((result) => {
          // console.log(result);
        })
        .catch((e) => console.error(e));
    },

    deleteEntry(key) {
      console.log("Delete Entry");
      if (this.entries[key].hasOwnProperty("time")) {
        chrome.alarms.clear(key); // clearing alarm if it has time
      }
      Vue.delete(this.entries, key);
      actions
        .delete({ date: this.dateStamp, key })
        .then((result) => {
          // console.log(result);
        })
        .catch((e) => console.error(e));
    },

    //===============
    // END CRUD FUNCTIONS
    //===============
  },
  computed: {
    dateStamp() {
      return this.listDate.toLocaleDateString("en-US").replaceAll("/", "-");
    },
    dayNumber() {
      return this.listDate.getDate();
    },
    todayDate() {
      if (
        this.listDate.toLocaleDateString("en-US") ===
        new Date().toLocaleDateString("en-US")
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

<style scoped lang="scss">
@import "./style.scss";
</style>
