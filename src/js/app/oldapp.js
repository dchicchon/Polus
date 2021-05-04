// import { backgroundImage } from "./utils/view";
// import "./utils/ga";

// export const startApp = () => {
//   chrome.storage.sync.get(["newTab", "indexOpen"], function (result) {
//     if (!("indexOpen" in result)) {
//       // console.log("indexOpen hello");
//       chrome.storage.sync.set({ indexOpen: false });
//     }

//     if (!("newTab" in result)) {
//       // console.log("newTab hello");
//       chrome.storage.sync.set({ newTab: false });
//     }

//     if (result["newTab"] === false && result["indexOpen"] === false) {
//       chrome.tabs.update({ url: "chrome-search://local-ntp/local-ntp.html" });
//     }

//     if (result["indexOpen"]) {
//       chrome.storage.sync.set({ indexOpen: false });
//     }
//   });

//   backgroundImage();

//   chrome.storage.sync.get(["pmode", "date", "clock"], (result) => {
//     for (let key in result) {
//       if (key === "pmode") {
//         if (result["pmode"] === false) {
//           let mainView = document.getElementsByTagName("main");
//           mainView[0].style.display = "block";
//         }
//       } else if (key === "date") {
//         let dateDiv = document.getElementById("date");
//         if (result["date"] === false) {
//           dateDiv.classList.add("hidden");
//         }
//       } else if (key === "clock") {
//         let clockDiv = document.getElementById("clock");
//         if (result["clock"] === false) {
//           clockDiv.classList.add("hidden");
//         }
//       }
//     }
//   });
// };
