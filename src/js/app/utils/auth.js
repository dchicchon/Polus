var config = {
  apiKey: "AIzaSyC-jyQX_JbQnJAjADK3ApS1gyemkr-AqW8",
  authDomain: "polus-cc376.firebaseapp.com",
  databaseURL: "https://polus-cc376.firebaseio.com",
  storageBucket: "polus-cc376.appspot.com",
};
firebase.initializeApp(config);

let accountContainer = document.getElementsByClassName("account-container");
// let initalHTML = accountContainer[0].initalHTML;
// Signup with google btn

// Signup with email and pass btn

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



// Login btn
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    accountContainer[0].innerHTML = "";
    let profileInfo = document.createElement("div");
    let logoutBtn = document.createElement("button");
    logoutBtn.textContent = "Logout";

    // Logout function
    logoutBtn.onclick = function () {
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
    console.log(user);
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;

    profileInfo.textContent = displayName;
    accountContainer[0].append(profileInfo, logoutBtn);
  } else {
    // Let's try to get a Google auth token programmatically.
    // accountContainer.initalHTML = initalHTML;
    let googleAuth = document.getElementById("Auth:Google");
    googleAuth.onclick = function () {
      function startAuth(interactive) {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
          if (chrome.runtime.lastError && !interactive) {
            console.log("It was not possible to get a token programmatically");
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
        });
      }

      startAuth(true);
    };
    console.log("Not logged in");
  }
});
