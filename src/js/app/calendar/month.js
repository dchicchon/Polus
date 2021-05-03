import { setEntries, addFunction } from "../utils/helper";
// import { globalDate, currentDate } from "../utils/oldclock";

let monthView = document.getElementById("month");

export const createMonth = () => {
  monthView.innerHTML = "";
  let monthDate = new Date();

  // LEVEL 1 Month View
  // Create DOM Elements
  let monthNav = document.createElement("div"); // container of the nav
  let monthDays = document.createElement("div"); // container for the month days
  let prevBtn = document.createElement("button"); // previous button
  let nextBtn = document.createElement("button"); // next button
  let monthTitle = document.createElement("div"); // title
  let weekdayNames = document.createElement("div"); // weekday titles
  // =============================================

  let startDate = new Date();
  while (startDate.getDay() !== 0) {
    startDate.setDate(startDate.getDate() - 1);
  }

  let createDaysInMonth = (dateObj) => {
    monthDays.innerHTML = "";
    let options = { month: "long", year: "numeric" };
    let title = dateObj.toLocaleDateString(undefined, options);

    // Highlight todays date on calendar
    if (dateObj.getMonth() === new Date().getMonth()) {
      monthTitle.style.background = "rgba(5, 80, 123, 0.992)";
      monthTitle.style.borderRadius = "75px";
    } else {
      monthTitle.style.backgroundColor = "initial";
    }
    monthTitle.textContent = title;

    // start of calendar variable
    dateObj.setDate(1);
    if (dateObj.getDay() !== 0) {
      while (dateObj.getDay() !== 0) {
        dateObj.setDate(dateObj.getDate() - 1);
      }
    }

    // This is how we create each individual day. But we want to start with Sunday
    for (let i = 0; i < 35; i++) {
      let dayDate = new Date(
          dateObj.getFullYear(),
          dateObj.getMonth(),
          dateObj.getDate() + i
        ), // ex. 1/20/20
        date = dayDate.toLocaleDateString();

      // LEVEL 2 DAY
      // Create DOM Elements
      let monthDay = document.createElement("div");
      let monthDayTitle = document.createElement("h3");
      let monthDetails = document.createElement("div");
      let monthDetailsList = document.createElement("ul");
      let btn = document.createElement("button");

      // Gets storage items and creates an li element for each item
      // setEntries(date, monthDetailsList);

      if (date === new Date()) {
        monthDayTitle.style.backgroundColor = "rgba(5, 80, 123, 0.992)";
      }

      // Set Attributes
      monthDetails.setAttribute("class", "monthDetails");
      monthDay.setAttribute("class", "monthDay");
      monthDayTitle.setAttribute("class", "monthDayTitle");
      btn.setAttribute("class", "add");
      monthDetails.id = date;

      monthDay.addEventListener("mouseenter", () => {
        btn.style.opacity = "1";
      });
      monthDay.addEventListener("mouseleave", () => {
        btn.style.opacity = "0";
      });

      // Text Content
      // monthDay.textContent = `${day} ${weekdays[dayDate.getUTCDay()]}`;
      let dayOptions = { day: "numeric" };
      // let dayOptions = { day: "numeric", weekday: "long" };
      monthDayTitle.textContent = dayDate.toLocaleDateString(
        undefined,
        dayOptions
      );

      btn.textContent = "+";

      // Set Values
      btn.value = date;

      // Append
      // monthDays.appendChild(monthDay);
      // monthDetails.appendChild(monthDetailsList);
      // monthDay.appendChild(monthDayTitle);
      // monthDay.appendChild(monthDetails);
      // monthDetails.appendChild(btn);
    }

    // let monthNum = dateObj.getMonth(); // 2/27/2020

    // if (dateObj.getDate()) {
    //   dateObj.setMonth(dateObj.getMonth() + 1);
    // }
    // console.log(dateObj);
    dateObj.setDate(dateObj.getDate() + 7);
    // addFunction();
  };

  createDaysInMonth(monthDate);
  // ===============================
};
