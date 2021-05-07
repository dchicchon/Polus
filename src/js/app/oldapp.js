
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
