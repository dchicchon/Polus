// THIS SCRIPT IS FOR EVERYTHING TIME RELATED

// Global Variables
let currentDate;
let globalDate;

// Update Clock

const updateTime = () => {
  // the format will chnage depending on the locale using the extension
  // British En glish uses day-month-year order
  // Korean uses year-month-day order
  currentDate = new Date();
  globalDate = currentDate.toLocaleDateString();

  // Format Options
  let options = {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  chrome.storage.local.get(['clock', 'date'], result => {
    if (result['clock']) {
      let clock = `${currentDate.toLocaleTimeString()}`;
      document.getElementById("clock").textContent = clock;
    } else {
      document.getElementById("clock").innerHTML = '';

    }
    if (result['date']) {
      let date = `${currentDate.toLocaleDateString(undefined, options)}`;
      document.getElementById("date").textContent = date;
    } else {
      document.getElementById("date").innerHTML = '';

    }
  })


};

chrome.storage.onChanged.addListener(function (result) {
  if (result['clock'] || result['date']) {
    updateTime()
  }
})

updateTime();

