// THIS SCRIPT IS FOR EVERYTHING TIME RELATED

// Global Variables
// Format Options

// Update Clock



chrome.storage.onChanged.addListener(function (result) {
  for (let key in result) {
    if (key === "clock") {
      let clockDiv = document.getElementById("clock");
      if (result["clock"]["newValue"] === true) {
        console.log(result["clock"]["newValue"]);
        clockDiv.classList.remove("hidden");
      } else if (result["clock"]["newValue"] === false) {
        console.log(result["clock"]["newValue"]);
        clockDiv.classList.add("hidden");
      }
    } else if (key === "date") {
      let dateDiv = document.getElementById("date");
      if (result["date"]["newValue"] === true) {
        console.log(result["date"]["newValue"]);
        dateDiv.classList.remove("hidden");
      } else if (result["date"]["newValue"] === false) {
        console.log(result["date"]["newValue"]);
        dateDiv.classList.add("hidden");
      }
    }
  }
});

