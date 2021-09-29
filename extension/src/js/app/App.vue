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
import { actions } from "./utils/store";
import { onAuthStateChanged } from "firebase/auth";
// import { initializeApp } from "firebase/app";
// import { getFirestore, } from "firebase/firestore";
// import { getAuth, } from "firebase/auth";

export default {
  components: {
    Navbar,
    Clock,
    Calendar,
  },

  beforeCreate() {
    onAuthStateChanged(this.$auth, (user) => {
      if (user) {
        actions.setSignedIn(true);
        actions.setUid(user.uid);
      }
    });
  },

  created() {
    this.setBackground();
  },

  methods: {
    //   Work on the background transition to load on page
    setBackground() {
      let page = document.getElementsByTagName("html");
      chrome.storage.sync.get(["background", "userSettings"], (result) => {
        chrome.storage.local.get("image", (localRes) => {
          if (Object.keys(localRes).length > 0) {
            let image = localRes.image;
            page[0].style.background = `url(${image})`;
          } else {
            let image = result.background.url;
            page[0].style.background = `rgba(0,0,0,0.9) url(${
              image + `&w=${window.innerWidth}`
            }) no-repeat fixed`;
          }
        });
        this.$refs.main.style.display = result.userSettings.pmode
          ? "none"
          : "block";
      });
    },
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
