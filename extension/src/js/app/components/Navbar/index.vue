<template>
  <ul id="nav">
    <li id="app-info-box">
      <div id="app-info">
        <div id="app-title" ref="title">
          <!-- To bring in the img, we must use "/assets" in order to create a relative path for the compiler to find -->
          <img class="app-icon" src="/assets/polus_icon.png" alt="App icon" />
        </div>
        <div id="app-items" ref="items">
          <a href="https://mail.google.com/mail/u/0/">
            Gmail
          </a>
          <a href="https://drive.google.com/drive/u/0/">
            Drive
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://danielchicchon.io/polus"
            >Site</a
          >
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://docs.google.com/forms/d/e/1FAIpQLSdHcPhbcAWeWFvEFqF6qzmPUD0UtNn9e7pn_eLUukGLudMy1A/viewform"
          >
            Feedback</a
          >
          <a
            id="pmode"
            @click="photoMode"
            target="_blank"
            rel="noopener noreferrer"
            >Photo Mode</a
          >
        </div>
      </div>
    </li>

    <li id="background-info-box" style="float: right">
      <div id="background-info">
        <span id="background-location"> {{ location }}</span>
        <span id="background-source"
          >Photo by
          <a
            id="photo-link"
            :href="link"
            target="_blank"
            rel="noopener noreferrer"
            >{{ author }}</a
          >
          on
          <a
            id="site-link"
            target="_blank"
            rel="noopener noreferrer"
            href="https://unsplash.com/?utm_source=Planner&utm_medium=referral"
            >Unsplash
          </a>
          <a id="download" rel="nofollow" target="_blank" download>&#8681;</a>
        </span>
      </div>
    </li>
  </ul>
</template>
<script>
export default {
  data() {
    return {
      location: "",
      download: "",
      author: "",
      link: "",
      pmode: false,
    };
  },
  created() {
    chrome.storage.sync.get(["background", "userSettings"], (result) => {
      this.pmode = result.userSettings.pmode;
      this.location = result.background.location
        ? result.background.location
        : "Unknown";
      this.download = result.background.downloadLink;
      this.author = result.background.author;
      this.link =
        result.background.photoLink + "?utm_source=Planner&utm_medium=referral";
    });
  },

  methods: {
    photoMode() {
      this.pmode = !this.pmode;
      chrome.storage.sync.get("userSettings", (result) => {
        let { userSettings } = result;
        userSettings.pmode = this.pmode;
        chrome.storage.sync.set({ userSettings });
      });
      let mainView = document.getElementsByTagName("main");
      mainView[0].style.display = this.pmode ? "none" : "block";
    },
  },
};
</script>
<style lang="scss">
@import "./style.scss";
</style>
