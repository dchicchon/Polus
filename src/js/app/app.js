import { viewFunction, hideViews, backgroundImage, views } from "./utils/view";
import "./utils/options";
import "./utils/ga";
import { dragFunctions } from "./utils/helper";
import { updateTime } from "./utils/clock";

export const startApp = () => {
  chrome.storage.sync.get(["newTab", "indexOpen"], function (result) {
    if (!("indexOpen" in result)) {
      console.log("indexOpen hello");
      chrome.storage.sync.set({ indexOpen: false });
    }

    if (!("newTab" in result)) {
      console.log("newTab hello");
      chrome.storage.sync.set({ newTab: false });
    }

    if (result["newTab"] === false && result["indexOpen"] === false) {
      chrome.tabs.update({ url: "chrome-search://local-ntp/local-ntp.html" });
    }

    if (result["indexOpen"]) {
      chrome.storage.sync.set({ indexOpen: false });
    }
  });

  function startAuth() {
    var config = {
      apiKey: "AIzaSyC-jyQX_JbQnJAjADK3ApS1gyemkr-AqW8",
      authDomain: "polus-cc376.firebaseapp.com",
      databaseURL: "https://polus-cc376.firebaseio.com",
      storageBucket: "polus-cc376.appspot.com",
    };
    firebase.initializeApp(config);

    let authButton = document.getElementById("auth");

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        authButton.textContent = "Logout";
        authButton.onclick = function () {
          firebase
            .auth()
            .signOut()
            .then(
              function () {
                console.log("Logged out");
              },
              function (error) {
                console.error("Logout Error", error);
              }
            );
        };
        console.log("User Logged in");
        console.log(user);
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        // console.log(displayName,email,emailVerified,photoURL, isAnonymous,uid,prov)
      } else {
        // Let's try to get a Google auth token programmatically.
        authButton.textContent = "Login";
        authButton.onclick = function () {
          function startAuth(interactive) {
            chrome.identity.getAuthToken(
              { interactive: true },
              function (token) {
                if (chrome.runtime.lastError && !interactive) {
                  console.log(
                    "It was not possible to get a token programmatically"
                  );
                } else if (chrome.runtime.lastError) {
                  console.error(chrome.runtime.lastError);
                } else if (token) {
                  // Authorize Firebase with the OAuth Access Token
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
                  console.error("The OAuth Token was null");
                }
              }
            );
          }

          startAuth(true);
        };
        console.log("Not logged in");
      }
    });
  }

  backgroundImage();
  dragFunctions();
  hideViews(views); // pass in views arr to hide different calendars depending on the stored view
  viewFunction(); // This function is to give the view buttons the ability to pick a view!
  let timer = setInterval(updateTime, 1000); // set a timer that executes the updateTime() function every second
  chrome.storage.sync.get(["pmode", "date", "clock"], (result) => {
    for (let key in result) {
      if (key === "pmode") {
        if (result["pmode"] === false) {
          let mainView = document.getElementsByTagName("main");
          mainView[0].style.display = "block";
        }
      } else if (key === "date") {
        let dateDiv = document.getElementById("date");
        if (result["date"] === false) {
          dateDiv.classList.add("hidden");
        }
      } else if (key === "clock") {
        let clockDiv = document.getElementById("clock");
        if (result["clock"] === false) {
          clockDiv.classList.add("hidden");
        }
      }
    }
  });
};
