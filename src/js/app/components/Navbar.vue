

<template>
  <ul id="nav">
    <li id="app-info-box">
      <div @mouseover="mouseOverNav" @mouseleave="mouseLeaveNav" id="app-info">
        <div id="app-title" ref="title">
          <!-- To bring in the img, we must use "/assets" in order to create a relative path for the compiler to find -->
          <img class="app-icon" src="/assets/polus_icon.png" alt="App icon" />
          <span class="app-sub">Polus</span>
        </div>
        <div id="app-items" ref="items">
          <div id="site">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://danielchicchon.io/polus"
              >Site</a
            >
          </div>
          <div id="contact">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.google.com/forms/d/e/1FAIpQLSdHcPhbcAWeWFvEFqF6qzmPUD0UtNn9e7pn_eLUukGLudMy1A/viewform"
            >
              Feedback</a
            >
          </div>
          <div>
            <a id="pmode" target="_blank" rel="noopener noreferrer"
              >Photo Mode</a
            >
          </div>
        </div>
      </div>
    </li>

    <li id="background-info-box" style="float: right">
      <div id="background-info">
        <span id="background-location">
          <!-- {{
            result.background.location ? result.background.location : "Unknown"
          }} -->
        </span>
        <span id="background-source"
          >Photo by
          <a id="photo-link" target="_blank" rel="noopener noreferrer"></a> on
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
  data: function () {
    chrome.storage.sync.get(["background"], function (result) {
      console.log(result);
      let photoInfo = {
          
      }
      return {
        location: result,
      };
    });
  },
  created() {},
  methods: {
    mouseOverNav: function () {
      this.$refs["title"].style.display = "none";
      this.$refs["items"].style.display = "inline-block";
    },
    mouseLeaveNav: function () {
      this.$refs["title"].style.display = "inline-block";
      this.$refs["items"].style.display = "none";
    },
  },
};
</script>
