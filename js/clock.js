// THIS SCRIPT IS FOR EVERYTHING TIME RELATED

let currentDate = new Date(),
  month = currentDate.getMonth(),
  year = currentDate.getFullYear();

let weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const updateTime = () => {
  let currentDate = new Date(),
    year = currentDate.getFullYear(),
    month = currentDate.getMonth() + 1,
    day = currentDate.getDate(),
    hour = currentDate.getHours(),
    minute = currentDate.getMinutes(),
    second = currentDate.getSeconds();

  let time = `${hour}: ${minute}: ${second}`; // your input
  time = time.split(":"); // convert to array

  // fetch2
  let hours = Number(time[0]),
    minutes = Number(time[1]),
    seconds = Number(time[2]);

  // calculate
  let timeValue;

  if (hours > 0 && hours <= 12) {
    timeValue = "" + hours;
  } else if (hours > 12) {
    timeValue = "" + (hours - 12);
  } else if (hours == 0) {
    timeValue = "12";
  }

  timeValue += minutes < 10 ? ":0" + minutes : ":" + minutes; // get minutes
  timeValue += seconds < 10 ? ":0" + seconds : ":" + seconds; // get seconds
  timeValue += hours >= 12 ? " pm" : " am"; // get AM/PM

  let clock = `${timeValue}`;
  let date = `${weekdays[currentDate.getDay()]} ${month}/${day}/${year} `;

  // document.getElementById('date').textContent = date
  document.getElementById("clock").textContent = clock;
  document.getElementById("date").textContent = date;

  // Maybe we can use this function for other methods too?
};
updateTime();
