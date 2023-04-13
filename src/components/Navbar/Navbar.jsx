import styles from './Navbar.module.scss';

function Navbar() {
  return (
    <ul id={styles.nav}>
      <li id="app_info_box">
        <div id={styles.app_info}>
          <div
            id={styles.app_title}
            //   ref="title"
          >
            {/* To bring in the img, we must use "/assets" in order to create a relative path for the compiler to find */}
            <img
              className={styles.app_icon}
              src="/assets/polus_icon.png"
              alt="App icon"
            />
          </div>
          <div id={styles.app_items}>
            <a href="https://mail.google.com/mail/u/0/"> Gmail </a>
            <a href="https://drive.google.com/drive/u/0/"> Drive </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://danielchicchon.com/polus"
            >
              Site
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.google.com/forms/d/e/1FAIpQLSdHcPhbcAWeWFvEFqF6qzmPUD0UtNn9e7pn_eLUukGLudMy1A/viewform"
            >
              Feedback
            </a>
            <a
              id={styles.pmode}
              // @click="photoMode"
              target="_blank"
              rel="noopener noreferrer"
            >
              Photo Mode
            </a>
          </div>
        </div>
      </li>

      <li id="background_info_box" style="float: right">
        <div id={styles.background_info}>
          <span id={styles.background_location}> {{ location }}</span>
          <span id={styles.background_source}>
            Photo by
            <a
              id={styles.photo_link}
              // :href="link"
              target="_blank"
              rel="noopener noreferrer"
            ></a>
            on
            <a
              id={styles.site_link}
              target="_blank"
              rel="noopener noreferrer"
              href="https://unsplash.com/?utm_source=Planner&utm_medium=referral"
            >
              Unsplash
            </a>
            <a id={styles.download} rel="nofollow" target="_blank" download>
              &#8681;
            </a>
          </span>
        </div>
      </li>
    </ul>
  );
}

export default Navbar;