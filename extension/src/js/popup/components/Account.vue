<template>
  <div>
    <h2 class="page-title">Account</h2>
    <!-- <component :is="page"> </component> Try this another time -->
    <!-- Based on page -->
    <div v-if="page === ''">
      <div class="account-container">
        <h3 class="signup-text">Sign In to a Polus Account</h3>
        <div class="email-btn-container">
          <button
            @click="($event) => changePage($event, 'signin')"
            class="email-btn"
          >
            <div class="btn-content-container">
              <div class="email-btn-icon"></div>
              <div class="email-btn-text">Sign In</div>
            </div>
          </button>
        </div>
        <div id="orContainer">
          <div class="orBar"></div>
          <div class="or">or</div>
          <div class="orBar"></div>
        </div>
        <div class="email-btn-container">
          <button
            @click="($event) => changePage($event, 'signup')"
            class="email-btn"
          >
            <div class="btn-content-container">
              <div class="email-btn-icon"></div>
              <div class="email-btn-text">Sign Up</div>
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
      </div>
    </div>
    <div v-else-if="page === 'signin'">
      <h3>Sign In</h3>
      <md-field>
        <label for="email"></label>
        <md-input v-model="email" placeholder="Email Address"></md-input>
      </md-field>
      <md-field>
        <label for="password"></label>
        <md-input
          type="password"
          v-model="password"
          placeholder="Password"
        ></md-input>
      </md-field>
      <ErrorText v-if="error" :error="error" />
      <md-button @click="signin" class="md-primary md-raised blue"
        >Submit</md-button
      >
      <md-button
        @click="($event) => (page = '')"
        class="md-primary md-raised blue"
        >Back
      </md-button>
    </div>
    <div v-else-if="page === 'signup'">
      <h3>Sign Up</h3>
      <md-field>
        <label for="email"></label>
        <md-input v-model="email" placeholder="Email Address"></md-input>
      </md-field>
      <md-field>
        <label for="password"></label>
        <md-input
          type="password"
          v-model="password"
          placeholder="Password"
        ></md-input>
      </md-field>
      <md-field>
        <label for="confirmPassword"></label>
        <md-input
          type="password"
          v-model="confirmPassword"
          placeholder="Confirm password"
        ></md-input>
      </md-field>
      <ErrorText v-if="error" :error="error" />
      <md-button @click="signup" class="md-primary md-raised blue"
        >Submit</md-button
      >
      <md-button
        @click="($event) => (page = '')"
        class="md-primary md-raised blue"
        >Back
      </md-button>
    </div>
    <div v-else-if="page === 'summary'">
      <!-- Include here how much data they have stored? -->

      <md-button @click="signout" class="md-primary md-raised blue"
        >Log Out</md-button
      >
      <!-- Somehow ask user if they are sure they want to delete this account -->
      <md-button
        @click="priorAccountDeletion = true"
        class="md-primary md-raised blue"
        >Delete Account
      </md-button>
      <div v-if="priorAccountDeletion">
        <p>
          Are you sure you want to delete your account? By deleting your
          account, all your entries and account information will be deleted but
          you will still have your entries on your machine and Google Account.
        </p>
        <md-button class="md-error md-raised red" @click="deleteAccount"
          >Yes</md-button
        >
        <md-button
          class="md-primary md-raised blue"
          @click="priorAccountDeletion = false"
          >No</md-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import ErrorText from "./ErrorText.vue";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
} from "firebase/auth";
import { doc, setDoc, getFirestore, updateDoc } from "firebase/firestore";
export default {
  components: {
    ErrorText,
  },
  data() {
    return {
      email: "",
      password: "",
      priorAccountDeletion: false,
      confirmPassword: "",
      page: "",
      error: "",
    };
  },

  created() {
    const auth = getAuth();
    if (auth.currentUser) {
      this.page = "summary";
    }
  },

  methods: {
    changePage(event, name) {
      event.preventDefault();
      this.email = "";
      this.password = "";
      this.confirmPassword = "";
      this.error = "";
      this.page = name;
    },
    deleteAccount() {
      // Show are you sure you want to delete account? All user data will be lost. And show user yes or no option
      console.log("Deleting Account");
      const auth = getAuth();
      const user = auth.currentUser;
      // show user a page are you sure?
      // then finally use cloud functions to delete their account. let them know it should take awhile
      deleteUser(user).then((user) => {
        console.log("User has been deleted");
        this.page = "";
      });
    },

    // await getting our items from storage
    getSyncStorageEntries: async () => {
      chrome.storage.sync.get(null, (result) => {
        delete result.userSettings;
        delete result.background;
        return result;
      });
    },
    // Should work now
    transferToFirestore: async () => {
      const db = getFirestore();
      const { uid } = getAuth().currentUser;
      const dateObject = await this.getSyncStorageEntries();
      for (let date in dateObject) {
        const dateObject = dateObject[date];
        if (date.includes("/")) {
          date = date.replaceAll("/", "-");
        }
        // Get each entry from our date collection and set to our subcollection date
        for (let key in dateObject) {
          const entry = dateObject[key];
          await setDoc(doc(db, "users", uid, date, key), entry);
        }
      }
      await updateDoc(doc(db, "users"));
    },
    signin() {
      const auth = getAuth();
      console.log("Logging In...");
      // use firebase signin system
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          console.log("User Credential");
          console.log(userCredential);

          let nextWeek = new Date();
          nextWeek.setDate(nextWeek.getDate() + 6);
          // Create the recurring alarm here to double check
          // Check if the alarm exists already
          chrome.alarms.get("reloadFirestore", (alarm) => {
            if (!alarm) {
              chrome.alarms.create("reloadFirestore", {
                when: nextWeek.getTime(),
                periodInMinutes: 60 * 24 * 7, // make this every 7 days?
              });
            }
          });

          this.page = "summary";

          // Here I then need to get some user info using firebase firestore methods
        })
        .catch((error) => {
          console.log("Error in signin");
          this.error = error.message;
        });
    },
    signup() {
      console.log("Signing in...");
      if (this.password !== this.confirmPassword) {
        this.error = "Passwords must match";
        return;
      }

      const auth = getAuth();
      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          console.log("User Successfully logged in");
          // Get all items from storage sync
          this.transferToFirestore();
          this.page = "summary";
        })
        .catch((error) => {
          console.log("Error in Sign Up");
          this.error = error.message;
        });
    },
    signout() {
      const auth = getAuth();

      // Delete the alarm here if it exists
      signOut(auth)
        .then(() => {
          console.log("Sign Out successful");
          chrome.alarms.get("reloadFirestore", (alarm) => {
            if (alarm) {
              chrome.alarms.clear("reloadFirestore");
            }
          });
          this.page = "";
        })
        .catch((error) => {
          this.error = error;
        });
    },
  },

  computed: {},
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

.signin {
  color: #212121;
  font-size: 14px;
  margin-top: 16px;
  text-align: left;
  .signin-btn {
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
