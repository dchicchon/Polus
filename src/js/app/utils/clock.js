// THIS SCRIPT IS FOR EVERYTHING TIME RELATED

// Global Variables
export let currentDate;
export let globalDate;

// Format Options
let options = {
  weekday: "long",
  year: "numeric",
  month: "numeric",
  day: "numeric",
};

// Update Clock

export const updateTime = () => {
  // the format will chnage depending on the locale using the extension
  // British English uses day-month-year order
  // Korean uses year-month-day order
  currentDate = new Date();
  globalDate = currentDate.toLocaleDateString();
  let clock = `${currentDate.toLocaleTimeString()}`;
  document.getElementById("clock").textContent = clock;
  let date = `${currentDate.toLocaleDateString(undefined, options)}`;
  document.getElementById("date").textContent = date;
};

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

updateTime();
