// THIS SCRIPT IS FOR EVERYTHING TIME RELATED

// Global Variables
let currentDate;
let globalDate;

const updateTime = () => {
  // the format will chnage depending on the locale using the extension
  // British English uses day-month-year order
  // Korean uses year-month-day order
  currentDate = new Date();
  globalDate = currentDate.toLocaleDateString();

  // Format Options
  let options = {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric"
  };

  let clock = `${currentDate.toLocaleTimeString()}`;
  let date = `${currentDate.toLocaleDateString(undefined, options)}`;

  document.getElementById("clock").textContent = clock;
  document.getElementById("date").textContent = date;
};

updateTime();
