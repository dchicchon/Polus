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
import Navbar from "../components/Navbar.vue";
import Clock from "../components/Clock.vue";
import Calendar from "../components/Calendar.vue";
import { state } from "../utils";
export default {
  components: {
    Navbar,
    Clock,
    Calendar,
  },
  // here we retrieve the information via store
  beforeCreate() {},
  mounted() {
    window.addEventListener("resize", this.mountBackground);
    this.mountBackground();
  },
  destroyed() {
    window.removeEventListener("resize", this.mountBackground);
  },
  methods: {
    //   Work on the background transition to load on page
    mountBackground() {
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

<style lang="scss">
// STYLE VARIABLES
// ===================
$title-fontsize: 2rem;
$title-width: 17.5rem;
$title-fontweight: 100;
$border-color: rgba(32, 32, 32, 0.555);
$day-background: rgba(0, 0, 0, 0.15);

// ===================

// HTML ELEMENT STYLING
// ===================
.material-icons {
  &.md-18 {
    font-size: 18px;
  }
  &.md-21 {
    font-size: 21px;
  }
  &.invert {
    background: rgb(56 147 200 / 75%);
  }
}
html {
  background: black;
  overflow-y: scroll;
  transition: background 5s ease;
  backdrop-filter: brightness(90%);
  font-family: "Segoe UI", Tahoma, sans-serif;
  // max-width: 100vw;
  /* width */
  &::-webkit-scrollbar {
    width: 3px;
    height: 2px;
  }

  /* Track */
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
main {
  margin: 1rem auto;
  justify-content: center;
  width: 100%;
}
body {
  color: white;
  margin: 0;
}
h1 {
  margin: 0;
  font-weight: 300;
}
h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 100;
  text-shadow: 0 0 25px rgba(0, 0, 0, 0.75);
  letter-spacing: 0.15rem;
}
h3 {
  margin: 0;
  font-weight: 300;
}
a {
  color: white;
}
:focus-visible {
  outline: none;
}
::selection {
  background: rgba(90, 90, 90, 0.329);
}
// ANIMATIONS
// ===============
@keyframes grow {
  from {
    width: 10%;
  }
  to {
    width: 90%;
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
button {
  outline: none;
  border: none;
  padding: 0.5rem 1rem;
  color: white;
}
button:hover {
  // background: rgba(90, 90, 90, 0.747);
  cursor: pointer;
}
.hidden {
  display: none !important;
}
.add {
  background: none;
  width: 1.5rem;
  font-size: 1.25rem;
  border-radius: 100%;
  opacity: 0;
  transition: background 0.5s, opacity 0.5s;
  padding: 0 0.4rem;
}
.add:hover {
  background: rgba(43, 129, 185, 0.76);
}
.add:focus {
  background: rgba(43, 129, 185, 0.76);
}
.title {
  font-size: $title-fontsize;
  width: $title-width;
  font-weight: $title-fontweight;
  text-shadow: 0 0 25px rgba(0, 0, 0, 0.6);
  margin: 0 1rem;
  text-align: center;
}
.dayTitle {
  font-size: $title-fontsize;
  width: $title-width;
  font-weight: $title-fontweight;
  text-shadow: 0 0 25px rgba(0, 0, 0, 0.6);
  border-radius: 75px;
  margin: 0 1rem;
  text-align: center;
}
.arrow {
  font-size: 1.5rem;
  background: rgba(43, 42, 42, 0.329);
  transition: background 0.5s;
}
.arrow:hover {
  background: rgba(90, 90, 90, 0.329);
}
.gear {
  position: fixed;
  cursor: pointer;
  transition: transform 0.25s;
  font-size: 30px;
  margin-right: 1rem;
  bottom: 0;
  right: 0;
  transform: translateY(0);
  &:hover {
    transform: translateY(-5%);
  }
}
#ghostie {
  z-index: 1;
  position: relative;
  display: block;
  height: 100px;
  background: none !important;
}

</style>
