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

export default {
  components: {
    Navbar,
    Clock,
    Calendar,
  },

  created() {
    // This is where I should check if I have it set as default new tab or not
    this.setBackground();
  },

  methods: {
    //   Work on the background transition to load on page
    setBackground() {
      chrome.storage.sync.get(["background", "userSettings"], (result) => {
        // Background Photo
        let page = document.getElementsByTagName("html");
        page[0].style.background = `rgba(0,0,0,0.9) url(${
          result.background.url + `&w=${window.innerWidth}`
        }) no-repeat fixed`;
        //
        this.$refs.main.style.display = result.userSettings.pmode
          ? "none"
          : "block";
      });
    },

    checkLogin() {},
  },
};
</script>

<style lang="scss" scoped>
main {
  margin: 1rem auto;
  justify-content: center;
  width: 100%;
  animation-name: fadeIn;
  animation-duration: 0.4s;
  animation-fill-mode: forwards;
}
</style>