<template>
  <div>
    <Navbar />
    <main ref="main">
      <Clock />
      <Calendar />
    </main>
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import Clock from "./components/Clock.vue";
import Calendar from "./components/Calendar.vue";
import { state, actions } from "../utils/store";
export default {
  components: {
    Navbar,
    Clock,
    Calendar,
  },
  // here we retrieve the information via store
  beforeCreate() {
    window.addEventListener("resize", this.setBackground);
  },
  mounted() {
    this.setBackground();
  },
  destroyed() {
    window.removeEventListener("resize", this.setBackground);
  },
  methods: {
    //   Work on the background transition to load on page
    setBackground() {
      if (!state.userSettings || !state.background) return;
      let page = document.getElementsByTagName("html");
      let image = state.background.url;
      page[0].style.background = `rgba(0,0,0,0.9) url(${
        image + `&w=${window.innerWidth}`
      }) no-repeat fixed`;
      this.$refs.main.style.display = state.userSettings.pmode
        ? "none"
        : "block";

      // this is for local images
      // chrome.storage.sync.get(["background", "userSettings"], (result) => {
      // chrome.storage.sync.get("image", (syncRes) => {
      // if (Object.keys(syncRes).length > 0) {
      //   let image = syncRes.image;
      //   page[0].style.background = `url(${image})`;
      // }else {}
      // });
      // });
    },
  },
};
</script>

<style lang="scss" scoped>
main {
  margin: 1rem auto;
  justify-content: center;
  width: 100%;
}
</style>
