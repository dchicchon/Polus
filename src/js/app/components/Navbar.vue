

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
          <!-- {{ photoInfo.location }} -->
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

<style lang="scss">
#app-info {
  padding: 0.5rem 1rem 0;
  display: grid;
  font-size: 1.5rem;

  :hover {
    #app-title {
      display: none;
    }
    #app-items {
      display: inline-block;
    }
  }
  #app-title {
    grid-column: 1;
    grid-row: 1;
    display: inline-block;
    animation-name: fadeIn;
    animation-duration: 0.75s;
    animation-fill-mode: forwards;
    color: white;
    .app-icon {
      width: 35px;
      height: 35px;
    }
    .app-sub {
      display: inline-block;
      font-weight: 200;
      letter-spacing: 0.1rem;
      text-shadow: 0 0 15px rgba(0, 0, 0, 1);
      transform: translateY(-25%);
    }
  }

  #app-items {
    display: none;
    background-blend-mode: screen;
    grid-column: 1;
    grid-row: 1;
    animation-name: fadeIn;
    animation-duration: 0.75s;
    animation-fill-mode: forwards;
    div {
      transition: background 0.25s;
      font-size: 60%;
      padding: 0.5rem;
      cursor: pointer;
      display: inline-block;
      &:hover {
        background-color: rgba($color: white, $alpha: 0.1);
      }
    }
  }
}

#background-info {
  padding: 1rem;
  display: grid;
  text-align: center;
  background-blend-mode: screen;
  background: none;
  color: white;

  #background-location {
    grid-column: 1;
    grid-row: 1;
    opacity: 0.75;
    font-size: 1rem;
    transition: opacity 0.25s;
  }
  #background-source {
    font-size: 1rem;
    grid-column: 1;
    grid-row: 1;
    opacity: 0;
    transition: opacity 0.25s;
    a {
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    #download {
      margin-left: 0.5rem;
      color: white;
    }
  }

  #background-link {
    position: relative;
    text-decoration: none;
    color: white;
  }
}

</style>

<script>
export default {
  data: function () {
    chrome.storage.sync.get(["background"], ({ background }) => {
      console.log(background)
      let photoInfo = {
        location: background.location ? background.location : "Unknown",
        download: background.downloadLink,
        author: background.author,
        link: background.photoLink + "?utm_source=Planner&utm_medium=referral",
      };
      console.log(photoInfo);
      return photoInfo;
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
