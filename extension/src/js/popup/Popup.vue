<template>
  <div>
    <div class="container">
      <div v-if="tab === 'options'">
        <Options />
      </div>
      <div v-if="tab === 'updates'">
        <Updates />
      </div>
      <div v-if="tab === 'account'">
        <Account />
      </div>
    </div>
    <ul id="popup-links">
      <li :class="activeOptions">
        <a @click="($event) => changeTab($event, 'options')" href="">Options</a>
      </li>
      <li :class="activeUpdates">
        <a @click="($event) => changeTab($event, 'updates')" href="">Updates</a>
      </li>
      <li :class="activeAccount">
        <a @click="($event) => changeTab($event, 'account')" href="">Account</a>
      </li>
    </ul>
  </div>
</template>

<script>
import Options from "./components/Options";
import Updates from "./components/Updates";
import Account from "./components/Account";

export default {
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
    //   On created, get all the items from storage relating to the thing
  },
  methods: {
    changeTab(event, name) {
      event.preventDefault();
      this.tab = name;
    },
  },
  computed: {
    activeOptions() {
      if (this.tab === "options") return "active-popup";
    },
    activeUpdates() {
      if (this.tab === "updates") return "active-popup";
    },
    activeAccount() {
      if (this.tab === "account") return "active-popup";
    },
  },
};
</script>

<style lang="scss" >
.container {
  margin: 10px;
}

.page-title {
  font-size: 20px;
  font-weight: 200;
}

#popup-links {
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0;
  margin: 0;
  .active-popup {
    border-bottom: 5px solid rgb(17, 151, 212);
  }
  li {
    display: block;
    width: calc(100% / 3);
    height: 30px;
    flex: 0 1 auto;
    list-style-type: none;
    display: inline-flex;
    justify-content: center;
    a {
      text-decoration: none;
      color: rgb(0, 0, 0);
    }
  }
}
</style>