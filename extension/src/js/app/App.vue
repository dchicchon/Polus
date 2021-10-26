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
import Navbar from "./components/Navbar";
import Clock from "./components/Clock.vue";
import Calendar from "./components/Calendar.vue";
import { actions } from "./utils/store";
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
export default {
  components: {
    Navbar,
    Clock,
    Calendar,
  },

  beforeCreate() {
    onAuthStateChanged(this.$auth, async (user) => {
      if (user) {
        const db = getFirestore();
        actions.setSignedIn(true);
        actions.setUid(user.uid);
        const userRef = doc(db, "users", user.uid);
        const userDocument = await getDoc(userRef); // get the user document

        // get the updateList and hasExtension values in our user document data
        const { update: updateList, hasExtension } = userDocument.data();
        actions.setUpdateList(updateList); // add all the dates that need to be updated to our store

        // this will be set when user to ensure that the mobile
        // will be updating dates to update

        /**
         * If user does not have extension go ahead and update the
         * @param hasExtension of our user document to true
         * so that the mobile app will add dates to be updated to the updateList
         */
        if (!hasExtension) {
          // Then lets go ahead and update our local and sync database
          // with our firestore database
          await actions.readFirebase();
          await updateDoc(userRef, {
            hasExtension: true,
          }).catch((error) => {
            console.error(error);
            // read everything from the firebase
          });
        } else {
          await actions.readUpdateList();
        }
      } else {
        actions.setSignedIn(false);
        actions.setUid(null);
        actions.setUpdateList([]);
      }
    });
  },

  created() {
    this.setBackground();

    // chrome.storage.onChanged.addListener((changes, namespace) => {
    // if (changes.maxItemsReached)
    // showModal()
    // })
  },

  methods: {
    //   Work on the background transition to load on page
    setBackground() {
      let page = document.getElementsByTagName("html");
      chrome.storage.sync.get(["background", "userSettings"], (result) => {
        chrome.storage.sync.get("image", (syncRes) => {
          if (Object.keys(syncRes).length > 0) {
            let image = syncRes.image;
            page[0].style.background = `url(${image})`;
          } else {
            let image = result.background.url;
            page[0].style.background = `rgba(0,0,0,0.9) url(${
              image + `&w=${window.innerWidth}`
            }) no-repeat fixed`;
          }
        });
        this.$refs.main.style.display = result.userSettings.pmode
          ? "none"
          : "block";
      });
    },

    showMaxModal() {
      // here display a modal on the page that will inform the user
      // that they have reached the max amount of items alloted to them
      // for the extension! If they would like to add more, they must
      // delete items  or they can join Polus as a user
      // which will host their data for them.
      // To delete Items, enable option to automatically delete
      // old entries in the options menu or they can manually
      // delete old entries
      // would you like more space? Click this to delete X amount of older entries
      // "Delete All Entries Before: X = adds Xkb of space"
    },
  },
};
</script>

<style lang="scss" scoped>
main {
  margin: 1rem auto;
  justify-content: center;
  width: 100%;
  animation-name: fadeIn;
  animation-duration: 0.4s;
  animation-fill-mode: forwards;
}
</style>
