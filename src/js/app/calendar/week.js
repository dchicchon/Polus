import { setEntries, addFunction } from "../utils/helper";
let weekView = document.getElementById("week");

export const createWeek = () => {
  // LEVEL 1 Week View
  weekView.innerHTML = "";

  // Create DOM Elements
  let weekDays = document.createElement("div"); // container of weekdays
  let weekdayNames = document.createElement("div"); // weekday titles
  let weekNav = document.createElement("div");
  let prevBtn = document.createElement("button"); // previous button
  let nextBtn = document.createElement("button"); // next button
  let weekTitle = document.createElement("div"); // title

  // This will allow us to go back the days until we get Monday
  let initialDate = new Date();
  while (initialDate.getDay() !== 0) {
    initialDate.setDate(initialDate.getDate() - 1);
  }
  let startDate = new Date();
  while (startDate.getDay() !== 0) {
    startDate.setDate(startDate.getDate() - 1);
  }

  // Weekday Names
  for (let k = 0; k < 7; k++) {
    let weekdayTitle = document.createElement("h2");
    let thisDate = new Date(startDate);
    thisDate.setDate(thisDate.getDate() + k);
    weekdayTitle.textContent = `${thisDate.toLocaleDateString(undefined, {
      weekday: "long",
    })}`;
    weekdayTitle.style.padding = "0 0 0.5rem";
    weekdayTitle.style.textAlign = "center";
    weekdayNames.append(weekdayTitle);
  }

  // Text Content
  prevBtn.innerHTML = "&larr;";
  nextBtn.innerHTML = "&rarr;";

  // Set Attributes
  prevBtn.setAttribute("class", "arrow");
  nextBtn.setAttribute("class", "arrow");
  weekTitle.setAttribute("class", "title");
  weekNav.setAttribute("class", "nav");
  weekDays.setAttribute("class", "weekdays");
  weekdayNames.setAttribute("class", "weekdayNames");

  // Set Styles
  weekTitle.style.width = "22rem";

  // Previous Week
  prevBtn.addEventListener("click", function () {
    startDate.setDate(startDate.getDate() - 7);
    createDaysInWeek(startDate);
  });

  // Next Week
  nextBtn.addEventListener("click", function () {
    startDate.setDate(startDate.getDate() + 7);
    createDaysInWeek(startDate);
  });

  // Nav
  weekNav.append(prevBtn, weekTitle, nextBtn);

  // View
  weekView.append(weekNav, weekdayNames, weekDays);

  let createDaysInWeek = (dateObj) => {
    weekDays.innerHTML = "";
    let titleDate = new Date(dateObj);
    let startingDate = titleDate.toLocaleDateString();

    if (titleDate.getDate() === initialDate.getDate()) {
      weekTitle.style.background = "rgba(5, 80, 123, 0.992)";
      weekTitle.style.borderRadius = "75px";
    } else {
      weekTitle.style.backgroundColor = "initial";
    }
    titleDate.setDate(titleDate.getDate() + 6);
    let endingDate = titleDate.toLocaleDateString();
    weekTitle.textContent = `${startingDate} - ${endingDate}`;

    for (let i = 0; i <= 6; i++) {
      // Entry Variables
      let thisDate = new Date(dateObj);
      thisDate.setDate(thisDate.getDate() + i);
      let date = thisDate.toLocaleDateString(); // ex: 2/20/2020 in U.S.

      // LEVEL 2 Week Day
      // Create DOM Elements
      let weekday = document.createElement("div");
      let weekDate = document.createElement("div");

      let details = document.createElement("div");
      let detailsList = document.createElement("ul");

      let btn = document.createElement("button");

      // If week day is today
      if (new Date() === date) {
        weekDate.style.backgroundColor = "rgba(5, 80, 123, 0.992)";
      }

      setEntries(date, detailsList);

      // Text Content
      weekDate.textContent = `${thisDate.getDate()}`;
      btn.textContent = "+";

      // Set Attributes
      weekday.setAttribute("class", "weekday");
      weekDate.setAttribute("class", "weekDate");
      details.setAttribute("class", "weekDetails");
      details.id = date;
      btn.setAttribute("class", "add");

      weekday.addEventListener("mouseenter", () => {
        btn.style.opacity = "1";
      });
      weekday.addEventListener("mouseleave", () => {
        btn.style.opacity = "0";
      });

      // Set Values
      btn.value = date;

      // Append
      // details.append(detailsList, btn);
      // weekday.append(weekDate, details);
      // weekDays.appendChild(weekday);
    }

    addFunction();
  };

  createDaysInWeek(startDate);
};
