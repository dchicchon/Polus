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
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  components: {
    Navbar,
    Clock,
    Calendar,
  },

  created() {
    const auth = getAuth();
    onAuthStateChanged(auth, this.checkForUser);
    this.setBackground();
  },

  methods: {
    checkForUser(user) {
      // If this is the case, be sure to set user as signed in
      if (user) {
        console.log(user);
        actions.setSignedIn(true);
        actions.setUid(user.uid);
      } else {
        console.log("No user present");
      }
    },

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
