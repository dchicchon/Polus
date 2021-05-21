<template>
  <div class="container">
    <h2 class="page-title">Account</h2>
    <p>Coming Soon!</p>
    <!-- <div class="account-container">
      <h3 class="signup-text">Join Polus</h3>
      <button @click="signUpWithGoogle()" id="Auth:Google" class="social-btn">
        <div style="display: inline-flex">
          <img />
          <div class="social-text">Continue with Google</div>
        </div>
      </button>
      <div id="orContainer">
        <div class="orBar"></div>
        <div class="or">or</div>
        <div class="orBar"></div>
      </div>
      <div class="email-btn-container">
        <button class="email-btn">
          <div class="btn-content-container">
            <div class="email-btn-icon"></div>
            <div class="email-btn-text">Join with Email</div>
          </div>
        </button>
      </div>
      <div class="terms">
        By joining, I agree to Polus's
        <a
          class="term-link"
          href="https://danielchicchon.io/polus/terms"
          target="_blank"
          rel="noopener noreferrer"
          >TOS</a
        >
        and
        <a
          class="term-link"
          href="https://danielchicchon.io/polus/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy
        </a>
      </div>
      <div class="login">
        Already a member?
        <button id="Auth:ToggleLink" class="login-btn">Login</button>
      </div>
    </div> -->
  </div>
</template>

<script>
import auth from "firebase/auth";

// Put this in the manifest to begin auth
// "oauth2": {
//   "client_id":"",
//   "scopes": [
//     ""
//   ]
// },

export default {
  methods: {
    signUpWithGoogle() {
      console.log("Sign up with google");
      var config = {
        apiKey: "AIzaSyC-jyQX_JbQnJAjADK3ApS1gyemkr-AqW8",
        authDomain: "polus-cc376.firebaseapp.com",
        databaseURL: "https://polus-cc376.firebaseio.com",
        storageBucket: "polus-cc376.appspot.com",
      };
      firebase.initializeApp(config);
      function startAuth(interactive) {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
          if (chrome.runtime.lastError && !interactive) {
            console.log("Unable to get token programmatically");
          } else if (chrome.runtime.lastError) {
            console.log("Chrome error?");
            console.error(chrome.runtime.lastError);
          } else if (token) {
            let credential = firebase.auth.GoogleAuthProvider.credential(
              null,
              token
            );
            firebase
              .auth()
              .signInWithCredential(credential)
              .catch(function (error) {
                if (error.code === "auth/invalid-credential") {
                  chrome.identity.removeCachedAuthToken(
                    { token: token },
                    function () {
                      startAuth(interactive);
                    }
                  );
                }
              });
          } else {
            console.error("The oAuth Token was null");
          }
        });
      }
      startAuth(true);
    },
  },
};
</script>

<style lang="scss" scoped>
.signup-text {
  font-weight: 200;
}
.term-link {
  color: #757575;
  text-decoration: underline;
}
.social-btn {
  width: 100%;
  border: 1px solid #9e9e9e;
  cursor: pointer;
  margin: 0px auto 8px;
  outline: none;
  min-height: 42px;
  border-radius: 3px;
  background-color: #ffffff;
  .social-text {
    font-size: 16px;
    margin-top: 2px;
    font-weight: 600;
    line-height: 22px;
    margin-left: 10px;
  }
}

#orContainer {
  display: flex;
  padding: 5px 0px 10px;
  .orBar {
    width: 44%;
    height: 1px;
    margin-top: 10px;
    background-color: #bdbdbd;
  }
  .or {
    color: #9e9e9e;
    width: 12%;
    font-size: 14px;
    text-align: center;
    font-weight: 600;
  }
}

.email-btn-container {
  margin: 5px auto 0;
  .email-btn {
    border-color: rgb(17, 151, 212);
    background-color: rgb(17, 151, 212);
    width: 100%;
    overflow: hidden;
    cursor: pointer;
    height: 40px;
    outline: none;
    padding: 0px 16px;
    box-shadow: none;
    text-shadow: none;
    border-style: solid;
    border-width: 1px;
    border-radius: 3px;
    .btn-content-container {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .email-btn-icon {
        order: 1;
        display: flex;
        margin-right: 10px;
      }
      .email-btn-text {
        font-size: 14px;
        color: rgb(255, 255, 255);
        order: 2;
        overflow: hidden;
        font-style: normal;
        font-family: SuisseIntl, BlinkMacSystemFont, "Segoe UI", Roboto,
          Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
          "Segoe UI Symbol";
        font-weight: 600;
        white-space: nowrap;
        font-stretch: normal;
        text-overflow: ellipsis;
        letter-spacing: normal;
        text-shadow: none !important;
        text-transform: none !important;
      }
    }
  }
}

.login {
  color: #212121;
  font-size: 14px;
  margin-top: 16px;
  text-align: left;
  .login-btn {
    font: inherit;
    color: #3d68fb;
    border: none;
    cursor: pointer;
    outline: inherit;
    padding: 0px;
    background: none;
    text-decoration: underline;
  }
}
</style>