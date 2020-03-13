// Bring in modules at the top
// The first time the user adds the extension, we set initial storage

// MAIN VARIABLES
// =========================================
// Views
let dayView = document.getElementById("daily");
let weekView = document.getElementById("week");
let monthView = document.getElementById("month");

// Btns
// let addButtons = document.getElementsByClassName('add')
let viewButtons = document.getElementsByClassName("view-btn");

let currentDate = new Date();
let views = [dayView, weekView, monthView];
let currentView;
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

let weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

// VIEWS
// =========================================

const hideViews = viewsArr => {
  chrome.storage.sync.get(["view"], function(result) {
    for (let k = 0; k < viewsArr.length; k++) {
      // If the view clicked on equals the result
      if (views[k].id === result["view"]) {
        // console.log(result["view"]);
        view = result["view"];
        switch (view) {
          case "daily":
            createToday();
            break;
          case "week":
            createWeek();
            break;
          case "month":
            createMonth();
            break;
        }
        views[k].setAttribute("style", "display:flex");
      } else {
        views[k].setAttribute("style", "display:none");
      }
    }
  });
};

// Using the array of the elements of views, we give each of them an onclick function that will set the chrome storage object of "view" to "currentView"
const viewFunction = () => {
  for (let j = 0; j < viewButtons.length; j++) {
    viewButtons[j].onclick = function() {
      currentView = this.textContent.toLowerCase();
      chrome.storage.sync.get(["view"], function(result) {
        if (currentView !== result["view"]) {
          chrome.storage.sync.set({ view: currentView }, function() {
            hideViews(views);
          });
        }
      });
    };
  }
};
// +++++++++++++++++++++++++++++++++++++++++
// Helper functions for calendar
// Feature to add new entries
let addFunction = () => {
  let addButtons = document.getElementsByClassName("add");
  // For each add button, do something
  for (let i = 0; i < addButtons.length; i++) {
    let date = addButtons[i].value;
    // Lets add an onclick listener
    addButtons[i].onclick = function() {
      // When clicked, we will create a couple of HTML elements with attributes
      let entryListItem = document.createElement("li");
      let entryInput = document.createElement("input");
      entryInput.setAttribute("class", "newItem");
      entryInput.setAttribute("autofocus", "true");

      // Add a key press listener for the HTML input element (listen for the keycode for Enter (13))
      entryInput.onkeypress = function(e) {
        if (!e) e = window.event;
        let keyCode = e.keyCode || e.which;
        if (keyCode === 13) {
          this.blur();
          // Check the storage for this date
          chrome.storage.sync.get([`${date}`], function(result) {
            // If the date is empty, we will set the entry to it
            if (isEmpty(result)) {
              let entries = [`${entryInput.value}`];
              chrome.storage.sync.set({ [date]: entries }, function() {});

              // If its not empty, we will append the entry to the others
            } else {
              let dateEntries = result[`${date}`];
              dateEntries.push(`${entryInput.value}`);
              chrome.storage.sync.set({ [date]: dateEntries }, function() {});
            }
          });
        }
      };
      entryListItem.appendChild(entryInput);
      addButtons[i].previousElementSibling.append(entryListItem);
    };
  }
};

//   Delete entries: NOT WORKING AT THE MOMENT
let deleteFunction = () => {
  let deleteButtons = document.getElementsByClassName("delete");
  console.log(deleteButtons);
  for (let i = 0; i < deleteButtons.length; i++) {
    let date = deleteButtons[i].id;
    console.log(date);
    deleteButtons[i].onclick = function() {
      this.parentNode.style.display = "none";
      chrome.storage.sync.get([`${date}`], function(result) {
        let dateEntries = result[`${date}`];
        let index = parseInt(entryDelete.value);
        let newEntries = arrayRemove(dateEntries, index);

        console.log(index);
        console.log(newEntries);
        chrome.storage.sync.set({ [date]: newEntries }, function() {
          console.log(date);
          console.log("Removed Entry");
        });
      });
    };
  }
};

//   Check if object is empty. Used to see if a day has any entries
let isEmpty = obj => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
};

//   Removes a value from an array
let arrayRemove = (arr, val) => {
  return arr.filter(function(ele) {
    return arr.indexOf(ele) != val;
  });
};
// +++++++++++++++++++++++++++++++++++++++++

// PLANNER BUILDS
// ========================================
const createToday = () => {
  dayView.innerHTML = "";
  let currentDate = new Date();

  let year = currentDate.getFullYear(),
    month = currentDate.getMonth() + 1,
    day = currentDate.getDate(),
    date = `${month}/${day}/${year}`;

  // Nav
  let dayNav = document.createElement("div");
  // Day Details
  let details = document.createElement("div");

  // Prev Btn
  let prevBtn = document.createElement("button");
  // Next Btn
  let nextBtn = document.createElement("button");
  // Title
  let dayTitle = document.createElement("h5");
  dayNav.appendChild(prevBtn);
  dayNav.appendChild(dayTitle);
  dayNav.appendChild(nextBtn);

  dayNav.setAttribute("class", "dayNav");
  dayTitle.setAttribute("class", "title");
  prevBtn.textContent = "<-";
  dayTitle.textContent = date;
  nextBtn.textContent = "->";
  // note: turns out theres semantic html called details which pops open stuff which might be useful later on;

  // Takes in a dateStamp as a parameter to return info
  let dayInfo = dateStamp => {
    let detailsList = document.createElement("ul");
    details.appendChild(detailsList);
    details.setAttribute("class", "details");

    chrome.storage.sync.get([`${dateStamp}`], function(result) {
      // console.log("Get storage");
      if (!isEmpty(result)) {
        let entriesArr = result[`${date}`];
        for (let i = 0; i < entriesArr.length; i++) {
          let entryListItem = document.createElement("li");
          let entryInput = document.createElement("input");

          //   Delete. Should remove the entire note and delete the entry in storage.
          //   1. Give the button the key of the entry index
          let entryDelete = document.createElement("button");
          entryDelete.textContent = "x";
          entryDelete.setAttribute("value", `${i}`);
          entryDelete.setAttribute("class", "delete");
          // entryDelete.id = date;

          //   We can use a helper function here
          entryDelete.onclick = function() {
            this.parentNode.style.display = "none";
            chrome.storage.sync.get([`${date}`], function(result) {
              let dateEntries = result[`${date}`];
              let index = parseInt(entryDelete.value);
              let newEntries = arrayRemove(dateEntries, index);

              console.log(index);
              console.log(newEntries);
              chrome.storage.sync.set({ [date]: newEntries }, function() {
                console.log(date);
                console.log("Removed Entry");
              });
            });
          };

          entryInput.setAttribute("class", "newItem");
          entryInput.value = entriesArr[i];
          entryListItem.appendChild(entryInput);
          entryListItem.appendChild(entryDelete);
          detailsList.appendChild(entryListItem);
        }
      }
    });

    let btn = document.createElement("button");
    btn.setAttribute("class", "add");
    btn.textContent = "+";
    btn.value = dateStamp;

    details.appendChild(btn);
    addFunction();
  };

  dayInfo(date);

  // This is how we can change the day for the daily calendar view. What I want to do is based off the currentDate object, I will be able to get the previous day timestamp
  // This is a temporary fix
  prevBtn.addEventListener("click", function() {
    details.innerHTML = "";
    day -= 1;
    currentDate.setDate(currentDate.getDate() - 1);
    year = currentDate.getFullYear();
    month = currentDate.getMonth() + 1;
    day = currentDate.getDate();
    date = `${month}/${day}/${year}`;
    dayTitle.textContent = date;
    dayInfo(date);
    addFunction();
  });

  nextBtn.addEventListener("click", function() {
    details.innerHTML = "";
    // day += 1;
    currentDate.setDate(currentDate.getDate() + 1);
    year = currentDate.getFullYear();
    month = currentDate.getMonth() + 1;
    day = currentDate.getDate();
    date = `${month}/${day}/${year}`;
    dayTitle.textContent = date;
    dayInfo(date);
    addFunction();
  });

  dayView.appendChild(dayNav);
  dayView.appendChild(details);
  addFunction();
};

const createWeek = () => {
  weekView.innerHTML = "";
  for (let i = 0; i <= 6; i++) {
    // Parent elm
    // Give a new date object to each element
    let thisDate = new Date();
    thisDate.setDate(thisDate.getDate() + i);

    let year = thisDate.getFullYear(),
      month = thisDate.getMonth() + 1,
      day = thisDate.getDate(),
      date = `${month}/${day}/${year}`;

    let weekday = document.createElement("div");
    weekday.setAttribute("class", "weekday");

    // Children
    let weekDate = document.createElement("div");
    weekDate.setAttribute("class", "weekDate");
    let weekTitle = document.createElement("div");
    weekTitle.setAttribute("class", "weekTitle");
    weekDate.textContent = `${day}`;
    weekTitle.textContent = `${weekdays[thisDate.getDay()]}`;

    let details = document.createElement("div");
    let detailsList = document.createElement("ul");
    details.appendChild(detailsList);
    details.setAttribute("class", "details");

    chrome.storage.sync.get([`${date}`], function(result) {
      if (!isEmpty(result)) {
        // console.log(result[`${date}`]);
        let entriesArr = result[`${date}`];
        for (let i = 0; i < entriesArr.length; i++) {
          let entryListItem = document.createElement("li");
          let entryInput = document.createElement("input");

          //   Delete. Should remove the entire note and delete the entry in storage.
          //   1. Give the button the key of the entry index
          let entryDelete = document.createElement("button");
          entryDelete.textContent = "x";
          entryDelete.setAttribute("class", "delete");
          entryDelete.id = date;
          entryDelete.setAttribute("value", `${i}`);

          //   We can use a helper function here
          entryDelete.onclick = function() {
            this.parentNode.style.display = "none";
            chrome.storage.sync.get([`${date}`], function(result) {
              let dateEntries = result[`${date}`];
              let index = parseInt(entryDelete.value);
              let newEntries = arrayRemove(dateEntries, index);

              console.log(index);
              console.log(newEntries);
              chrome.storage.sync.set({ [date]: newEntries }, function() {
                console.log(date);
                console.log("Removed Entry");
              });
            });
          };

          entryInput.setAttribute("class", "newItem");
          entryInput.value = entriesArr[i];

          //   Edit Entry.
          entryInput.onkeypress = function(e) {
            if (!e) e = window.event;
            let keyCode = e.keyCode || e.which;
            if (keyCode === 13) {
              // remove focus
              this.blur();
              chrome.storage.sync.get([`${date}`], function(result) {
                let dateEntries = result[`${date}`];

                // Get the index of the current Entry
                let index = dateEntries.indexOf(dateEntries[i]);
                if (index !== -1) {
                  // Find and replace the element at the index with the new value
                  dateEntries[index] = entryInput.value;
                }

                chrome.storage.sync.set({ [date]: dateEntries }, function() {});
              });
            }
          };

          entryListItem.appendChild(entryInput);
          entryListItem.appendChild(entryDelete);
          detailsList.appendChild(entryListItem);
        }
      }
    });

    let btn = document.createElement("button");
    btn.setAttribute("class", "add");
    btn.textContent = "+";
    btn.value = date;

    details.appendChild(btn);

    weekday.appendChild(weekDate);
    weekday.appendChild(weekTitle);
    weekday.appendChild(details);

    weekView.appendChild(weekday);
  }
  addFunction();
};

const createMonth = () => {
  monthView.innerHTML = "";
  let currentDate = new Date(),
    month = currentDate.getMonth(),
    year = currentDate.getFullYear();

  // Create the elements
  let monthNav = document.createElement("div"); // container of the nav
  let monthDays = document.createElement("div"); // container for the month days

  // Row 1
  // =============================================
  // Month Nav
  // Prev Btn
  let prevBtn = document.createElement("button");
  // Next Btn
  let nextBtn = document.createElement("button");
  // Title
  let monthTitle = document.createElement("h4");
  monthNav.appendChild(prevBtn);
  monthNav.appendChild(monthTitle);
  monthNav.appendChild(nextBtn);

  // Set attributes
  monthTitle.setAttribute("class", "title");
  monthNav.setAttribute("class", "monthNav");
  monthDays.setAttribute("class", "monthDays");
  prevBtn.textContent = "<-";
  monthTitle.textContent = months[month] + ` ${year}`;
  nextBtn.textContent = "->";

  // =============================================

  // This will generate all the days for a month and all the associated notes
  let createDaysInMonth = (year, month) => {
    let daysInMonth = new Date(year, month + 1, 0).getDate();
    //   Lets create a dayDiv for however many days in the month there are

    for (let i = 0; i < daysInMonth; i++) {
      //   Now lets give each div a date object
      let dayDate = new Date(year, month, i + 1), // ex. 1/20/20
        day = dayDate.getDate(),
        date = `${month + 1}/${day}/${year}`;
      let dayDiv = document.createElement("div");
      dayDiv.setAttribute("class", "monthDay");
      dayDiv.textContent = `${day} ${weekdays[dayDate.getUTCDay()]}`;

      // console.log("Day of the week");
      // console.log(dayDate)
      // console.log(dayDate.getUTCDay());
      // console.log(weekdays[dayDate.getUTCDay()]);

      let details = document.createElement("div");
      let detailsList = document.createElement("ul");

      // Gets storage items and creates an li element for each item
      // console.log(date);
      chrome.storage.sync.get([`${date}`], function(result) {
        if (!isEmpty(result)) {
          let entriesArr = result[`${date}`];
          for (let j = 0; j < entriesArr.length; j++) {
            let entryListItem = document.createElement("li");
            let entryInput = document.createElement("input");

            let entryDelete = document.createElement("button");
            entryDelete.textContent = "x";
            entryDelete.setAttribute("value", `${j}`);
            entryDelete.setAttribute("class", "delete");
            entryDelete.id = date;

            //   We can use a helper function here
            entryDelete.onclick = function() {
              this.parentNode.style.display = "none";
              chrome.storage.sync.get([`${date}`], function(result) {
                let dateEntries = result[`${date}`];
                let index = parseInt(entryDelete.value);
                let newEntries = arrayRemove(dateEntries, index);

                chrome.storage.sync.set({ [date]: newEntries }, function() {
                  // console.log(date);
                  console.log("Removed Entry");
                });
              });
            };

            entryInput.setAttribute("class", "newItem");
            entryInput.value = entriesArr[j];
            entryListItem.appendChild(entryInput);
            entryListItem.appendChild(entryDelete);
            detailsList.appendChild(entryListItem);
          }
        }
      });

      let btn = document.createElement("button");
      btn.textContent = "+";
      btn.setAttribute("class", "add");
      btn.value = date;

      details.setAttribute("class", "details");
      details.appendChild(detailsList);
      dayDiv.appendChild(details);
      details.appendChild(btn);

      monthDays.appendChild(dayDiv);
    }
    addFunction();
  };
  // Click to go to previous month

  prevBtn.addEventListener("click", function() {
    month -= 1;
    if (month < 0) {
      month = 11;
      year -= 1;
    }
    monthTitle.textContent = months[month] + ` ${year}`;
    monthDays.innerHTML = "";
    createDaysInMonth(year, month);
  });

  // Click to go to next month
  nextBtn.addEventListener("click", function() {
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
    monthDays.innerHTML = "";
    monthTitle.textContent = months[month] + ` ${year}`;
    // monthTitle.textContent = months[month];
    createDaysInMonth(year, month);
    addFunction();
  });
  // =============================================
  // Make this into a function!
  // The number of days in this month

  createDaysInMonth(year, month);

  monthView.appendChild(monthNav);
  monthView.appendChild(monthDays);
  addFunction();
  // monthView.appendChild(monthDiv);
};

// +++++++++++++++++++++++++++++++++++++++++

// CLOCK
// =========================================
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

// START APP
const startApp = () => {
  // These will all be conditionally rendered eventually
  // =================================================
  // This should happen everyday
  chrome.storage.sync.get(["background", "topSites"], function(result) {
    let ul = document.getElementsByClassName("topSites");
    for (let i = 0; i < 6; i++) {
      // Get rid of http://
      // console.log(result.topSites[i].url);
      let index = result.topSites[i].url.indexOf("://");
      let url = result.topSites[i].url.substring(index + 3);
      // console.log(url);
      let link = document.createElement("a");
      link.textContent = url;
      link.setAttribute("class", "site");
      link.setAttribute("href", result.topSites[i].url);
      link.setAttribute("target", "_blank");
      ul[0].appendChild(link);
    }

    let siteBox = document.getElementById("site-box");
    siteBox.addEventListener("mouseenter", function() {
      ul[0].setAttribute("style", "display:block");
    });

    siteBox.addEventListener("mouseleave", function() {
      ul[0].setAttribute("style", "display:none");
    });

    let page = document.getElementsByTagName("html");
    page[0].style.background = `rgba(0,0,0,0.9) url(${result.background}) no-repeat center center fixed`;
    page[0].style.backgroundSize = `cover`;

    // These create all the views
    hideViews(views); // pass in views arr to hide different calendars depending on the stored view
    viewFunction(); // This function is to give the view buttons the ability to pick a view!
    updateTime(); // this updates the clock
    // deleteFunction();

    let timer = setInterval(updateTime, 1000); // set a timer that executes the updateTime() function every second
  });
};

startApp();
