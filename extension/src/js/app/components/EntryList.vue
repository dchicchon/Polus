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

    <ul ref="entryList" class="entryList">
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

    <button @click="initEntry" :value="dateStamp" class="addButton">+</button>
  </div>
</template>

<script>
import Entry from "./Entry";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { actions } from "../utils/store";
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
    // this.getEntries();
    const auth = getAuth();
    onAuthStateChanged(auth, this.readEntries); // this watches to see if a user logs in or logs off
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
      console.log("Init Entry");
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
      console.log("Create Entry");
      if (entry.text.length === 0) {
        Vue.delete(this.entries, key);
      } else {
        if (entry.hasOwnProperty("new")) delete entry.new;
        let date = this.listDate.toLocaleDateString().replaceAll("/", "-");
        actions.create(date, entry, key);
        // can optionally add a .then() resolver here if need to execute afterwards
      }
    },
    readEntries() {
      console.log("Read Entries");
      actions
        .read(this.dateStamp)
        .then((result) => {
          console.log("Result");
          this.entries = result;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    updateEntry(key) {
      console.log("Update Entry");
      // check if entry is any different than before
      Vue.set(this.entries, key, this.entries[key]);
      actions.update(this.dateStamp, this.entries[key], key);
    },

deleteEntry(key) {
      console.log("Delete Entry");
      if (this.entries[key].hasOwnProperty("time")) {
        chrome.alarms.clear(key); // clearing alarm if it has time
      }
      Vue.delete(this.entries, key);
      const date = this.listDate.toLocaleDateString().replaceAll("/", "-");
      actions.delete(date, key);
    },

    //===============
    // END CRUD FUNCTIONS
    //===============
  },
  computed: {
    dateStamp() {
      return this.listDate.toLocaleDateString().replaceAll("/", "-");
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
<style scoped lang="scss">
// https://css-tricks.com/almanac/properties/b/backdrop-filter/

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
