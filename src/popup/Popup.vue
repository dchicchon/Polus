<template>
  <div class="main">
    <div class="container">
      <component :is="currentTabComponent"></component>
    </div>
    <div class="popup_nav">
      <h3
      @click="changeTab($event, 'options')"
      >Options</h3>
      <h3>Account</h3>
    </div>
    <!-- <md-bottom-bar class="blue" md-type="shift">
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
        @click="($event) => changeTab($event, 'dev')"
        id="bottom-bar-item-updates"
        md-label="Updates"
        md-icon="/assets/popup_icons/updates.svg"
      />
    </md-bottom-bar> -->
  </div>
</template>
<script>
import Options from "../components/PopupOptions.vue";

// Popup Entry Point. Should create a check to see if user is logged in with firebase
export default {
  // components in the popup
  components: {
    Options,
  },

  data() {
    return {
      tab: "options",
    };
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
      console.debug("currentTabComponent");
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
body {
  width: 300px;
  height: 250px;
  margin: 0;
}
#app {
  height: 100%;
}
.blue {
  background-color: #1197d4 !important;
}

.main {
  height: 100%;
}

.container {
  margin: 10px 10px 0px 10px;
  height: 100%;
  // overflow: auto;
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
  .page-title {
    font-size: 20px;
    font-weight: 200;
  }
}

.popup_nav {
  display: flex;
  color: white;
  background-color: rgb(14, 108, 151);
  // justify-content: space-around;
}
.popup_nav > h3 {
  cursor: pointer;
  margin: 0;
  flex: 2;
  text-align: center;
  padding: 1em;
  background-color: rgb(14, 108, 151);
  transition: background-color 0.5s;
}
.popup_nav > h3:hover {
  background: rgb(19, 138, 193);
}
</style>
