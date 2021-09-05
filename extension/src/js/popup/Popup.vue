<template>
  <div class="main">
    <div class="container">
      <component :is="currentTabComponent"></component>
    </div>
    <md-bottom-bar class="blue" md-type="shift">
      <md-bottom-bar-item
        @click="($event) => changeTab($event, 'options')"
        id="bottom-bar-item-options"
        md-label="Options"
        md-icon="/assets/popup_icons/options.svg"
      />
      <md-bottom-bar-item
        @click="($event) => changeTab($event, 'updates')"
        id="bottom-bar-item-updates"
        md-label="Updates"
        md-icon="/assets/popup_icons/updates.svg"
      />
      <md-bottom-bar-item
        @click="($event) => changeTab($event, 'account')"
        id="bottom-bar-item-account"
        md-label="Account"
        md-icon="/assets/popup_icons/account.svg"
      />
    </md-bottom-bar>
  </div>
</template>

<script>
import Options from "./components/Options";
import Updates from "./components/Updates";
import Account from "./components/Account";

// Popup Entry Point. Should create a check to see if user is logged in with firebase
export default {
  // components in the popup
  components: {
    Options,
    Updates,
    Account,
  },

  data() {
    return {
      tab: "options",
    };
  },

  created() {

  },

  methods: {
    changeTab(event, name) {
      event.preventDefault();
      this.tab = name;
    },
  },

  // computed in app, costs less than using methods
  computed: {
    currentTabComponent() {
      console.log("Current Tab Component");
      let component = this.tab.charAt(0).toUpperCase() + this.tab.slice(1);
      return component;
    },
  },
};
</script>

<style lang="scss">
html {
  height: 0px !important;
}

.blue {
  background-color: #1197d4 !important;
}
</style>

<style lang="scss" scoped>
.main {
  height: 100%;
}

.container {
  margin: 10px 10px 0px 10px;
  height: 90%;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 3px;
    height: 2px;
  }
  &::-webkit-scrollbar-track {
    background: none;
  }
  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #888;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
}
</style>
