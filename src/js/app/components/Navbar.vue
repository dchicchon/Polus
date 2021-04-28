<template>
  <ul id="nav">
    <li id="app-info-box">
      <div id="app-info">
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
            <a
              id="pmode"
              @click="photoMode"
              target="_blank"
              rel="noopener noreferrer"
              >Photo Mode</a
            >
          </div>
        </div>
      </div>
    </li>

    <li id="background-info-box" style="float: right">
      <div id="background-info">
        <span id="background-location"> {{ location }}</span>
        <span id="background-source"
          >Photo by {{ author }}
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
#nav {
  list-style-type: none;
  top: 0;
  height: 3rem;
  width: 100%;
  margin: 0;
  padding: 0;
  li {
    float: left;
    display: block;
    a {
      text-decoration: none;
    }
  }
}

#app-info {
  padding: 0.5rem 1rem 0;
  display: grid;
  font-size: 1.5rem;

  &:hover {
    #app-title {
      display: none;
    }
    #app-items {
      display: inline-block;
    }
  }
  // Default Display
  #app-title {
    grid-column: 1;
    grid-row: 1;
    display: inline-block;
    animation-name: fadeIn;
    animation-duration: 0.75s;
    animation-fill-mode: forwards;
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

    // eventually remove this please
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
  font-size: 1rem;
  background-blend-mode: screen;
  // background: none;
  &:hover {
    #background-location {
      display: none;
    }
    #background-source {
      display: inline-block;
    }
  }
  // Default Display

  #background-location {
    grid-column: 1;
    grid-row: 1;
    display: inline-block;
    animation-name: fadeIn;
    animation-duration: 0.75s;
    animation-fill-mode: forwards;
  }
  #background-source {
    display: none;
    font-size: 1rem;
    grid-column: 1;
    grid-row: 1;
    // opacity: 0;
    animation-name: fadeIn;
    animation-duration: 0.75s;
    animation-fill-mode: forwards;
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
    chrome.storage.sync.get(["background", "pmode"], (result) => {
      this.pmode = result.pmode;
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
      chrome.storage.sync.set({ pmode: this.pmode });
      let mainView = document.getElementsByTagName("main");
      mainView[0].style.display = this.pmode ? "none" : "block";
    },
  },
};
</script>
