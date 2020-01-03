// Find out what this is
// update: the first time the user adds the extension, I believe we set initial variables
chrome.runtime.onInstalled.addListener(function() {
  // Removed entries array for the moment
  chrome.storage.sync.set({ view: "today" }, function() {
    console.log("Storage key set to week");
  });
});

// MAIN VARIABLES
// =========================================
// Views
let dayView = document.getElementById("today");
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

// +++++++++++++++++++++++++++++++++++++++++

// VIEWS
// =========================================

// This is a bit misleading somewhat. This function will hide all the other views that are not the result.
const hideViews = viewsArr => {
  chrome.storage.sync.get(["view"], function(result) {
    for (let k = 0; k < viewsArr.length; k++) {
      if (views[k].id === result["view"]) {
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
      chrome.storage.sync.set({ view: currentView }, function() {
        console.log("Storage view set to", currentView);
      });
      hideViews(views);
    };
  }
};
// +++++++++++++++++++++++++++++++++++++++++

// there are months in a year, 12 of them. In our case, we only want to show the next three months
// for each month there are a certain amount of days (30, 31, feb = 28?)

// PLANNER BUILDS
// ========================================
const createToday = () => {
  let currentDate = new Date();
  // let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  // let weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  let dayTitle = document.createElement("h5");
  // Monday, November 27th 2019 or Monday 11/27/2019. Customize this!
  // Fix this later to get the cool 'th' on it or 'st' or 'nd'. Maybe start using moment? Or other time packages
  let date = `${weekdays[currentDate.getDay()]}, ${
    months[currentDate.getMonth()]
  } ${currentDate.getDate()}th ${currentDate.getFullYear()}`; // might assign this straight to textContent later
  dayTitle.setAttribute("class", "dayTitle");
  dayTitle.textContent = date;

  // note: turns out theres semantic html called details which pops open stuff which might be useful later on;
  let details = document.createElement("div");
  details.setAttribute("class", "dayDetails");

  let ul = document.createElement("ul");
  let addBtn = document.createElement("button");
  addBtn.setAttribute("class", "add");
  addBtn.textContent = "+";

  details.appendChild(ul);
  details.appendChild(addBtn);
  dayView.appendChild(dayTitle);
  dayView.appendChild(details);
};

// Currently appending today over and over again, be sure to set it to other days as well
const createWeek = () => {
  for (let i = 0; i <= 6; i++) {
    // Parent elm
    // Give a new date object to each element
    let thisDate = new Date();
    thisDate.setDate(thisDate.getDate() + i);

    let year = thisDate.getFullYear(),
      month = thisDate.getMonth() + 1,
      day = thisDate.getDate(),
      date = `${month}/${day}/${year} `;

    let weekday = document.createElement("div");
    weekday.setAttribute("class", "weekday");

    // Children
    let weekDate = document.createElement("div");
    weekDate.setAttribute("class", "weekDate");
    let weekTitle = document.createElement("div");
    weekTitle.setAttribute("class", "weekTitle");
    // Make today the center day

    // Before I got the day of the week, but now I'm getting the timestamp
    // weekTitle.textContent = `${weekdays[currentDate.getDate() + i]}`; // this is where im goofing. I am relying on the arr to give me the weekday.
    // console.log(thisDate);
    weekDate.textContent = `${day}`;
    weekTitle.textContent = `${weekdays[thisDate.getDay()]}`; // this is where im goofing. I am relying on the arr to give me the weekday.

    // I should check chrome storage here to see if I need to fill up anything
    let details = document.createElement("div");
    let detailsList = document.createElement("ul");
    details.appendChild(detailsList);
    details.setAttribute("class", "details");

    // This creates a list of entries. For each entry we create a "div" element that surrounds it. Instead, I should make it an input element with the value of the entry

    // Probably can run this get function at the top of the page for only one time
    chrome.storage.sync.get([`${date}`], function(result) {
      console.log(date);
      console.log(result);
      if (!isEmpty(result)) {
        console.log(result[`${date}`]);
        let entriesArr = result[`${date}`];
        for (let i = 0; i < entriesArr.length; i++) {
          let entryListItem = document.createElement("li");
          let entryInput = document.createElement("input");
          let entryDelete = document.createElement("button");
          entryDelete.textContent = "x";
          entryDelete.setAttribute("class", "delete");
          entryInput.setAttribute("class", "newItem");
          entryInput.value = entriesArr[i];
          entryListItem.appendChild(entryInput);
          entryListItem.appendChild(entryDelete);
          detailsList.appendChild(entryListItem);
        }
      }
    });

    let ul = document.createElement("ul");

    // Need to find a way to pass the js object to the btn? Maybe I can pass it by creating the event listener here
    let btn = document.createElement("button");
    btn.textContent = "+";
    btn.setAttribute("class", "add");

    // Make a chrome object of the day itself
    // so 12/31/2019 should be an object
    // and it should have an array of entries
    // so a different version would be like
    // I hope I can do this
    //  12/31/2019 : []
    btn.onclick = function() {
      let entryListItem = document.createElement("li");
      let entryInput = document.createElement("input");
      entryInput.setAttribute("class", "newItem");
      entryInput.setAttribute("autofocus", "true");

      //   on enter
      entryInput.onkeypress = function(e) {
        if (!e) e = window.event;
        let keyCode = e.keyCode || e.which;
        if (keyCode === 13) {
          // remove focus
          this.blur();
          //   Check input value
          console.log(entryInput.value);
          chrome.storage.sync.get([`${date}`], function(result) {
            // Create a date object if it does not exist.
            console.log(date);
            if (isEmpty(result)) {
              let entries = [`${entryInput.value}`];
              chrome.storage.sync.set({ [date]: entries }, function() {});
            } else {
              let dateEntries = result[`${date}`];
              dateEntries.push(`${entryInput.value}`);
              chrome.storage.sync.set({ [date]: dateEntries }, function() {
                console.log(dateEntries);
              });
            }
          });
        }
      };
      let ul = this.previousElementSibling;
      entryListItem.appendChild(entryInput);
      ul.appendChild(entryListItem);
      // Check if date object exists

      //

      //   At the moment it looks like its getting the nex day in front of it rather than its actual Date
      //   chrome.storage.sync.get(["entries"], function(result) {
      //     // console.log(result["entries"]);

      //     let oldEntries = result["entries"];
      //     let newEntries = [entry];
      //     if (oldEntries !== null) {
      //       let combineEntries = newEntries.concat(oldEntries);
      //       chrome.storage.sync.set({ entries: combineEntries }, function() {
      //         console.log("Updated Entries");
      //         console.log(combineEntries);
      //       });
      //     } else {
      //       chrome.storage.sync.set({ entries: newEntries }, function() {
      //         console.log(`Entries is set to ${newEntries}`);
      //       });
      //     }
      //   });
    };

    // btn.addEventListener()

    details.appendChild(ul);
    details.appendChild(btn);

    weekday.appendChild(weekDate);
    weekday.appendChild(weekTitle);
    weekday.appendChild(details);

    weekView.appendChild(weekday);
  }
};

const createMonth = () => {
  let currentDate = new Date();

  // Create the element
  let monthDiv = document.createElement("div");
  let monthTitle = document.createElement("h4");
  // let dayDiv = document.createElement("div") // does not work

  // Set attributes
  monthDiv.setAttribute("class", "month");
  monthTitle.setAttribute("class", "monthTitle");

  monthTitle.textContent = currentDate.getMonth();

  // Do it 31 times for each day
  // monthDiv.appendChild(monthTitle)

  for (let x = 1; x <= 5; x++) {
    let rowDiv = document.createElement("div");
    rowDiv.setAttribute("class", "row");
    for (let y = 0; y <= 6; y++) {
      let dayDiv = document.createElement("div");
      dayDiv.setAttribute("class", "monthDay");
      dayDiv.textContent = y + x;
      rowDiv.appendChild(dayDiv);
    }
    monthDiv.appendChild(rowDiv);
  }
  monthView.appendChild(monthTitle);
  monthView.appendChild(monthDiv);
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

  let clock = `${timeValue} `;
  let date = `${month}/${day}/${year} `;

  // document.getElementById('date').textContent = date
  document.getElementById("clock").textContent = clock;
  document.getElementById("date").textContent = date;

  // Maybe we can use this function for other methods too?
};
// +++++++++++++++++++++++++++++++++++++++++

// ADD ITEMS TO DAY
// =========================================
// Put this in function maybe?
const addFunction = () => {
  let addButtons = document.getElementsByClassName("add");
  for (let i = 0; i < addButtons.length; i++) {
    addButtons[i].onclick = function() {
      // The JavaScript this keyword refers to the object it belongs to.
      let listItem = document.createElement("li");
      let inputItem = document.createElement("input");
      inputItem.setAttribute("class", "newItem");
      inputItem.setAttribute("autofocus", "true");

      // Click on item to edit it. In here, we should update the note in the db as well
      inputItem.onclick = function() {
        console.log("editing item!");
      };

      // https://stackoverflow.com/questions/11365632/how-to-detect-when-the-user-presses-enter-in-an-input-field
      // When I press 'enter' (keyCode = 13)
      inputItem.onkeypress = function(e) {
        if (!e) e = window.event;
        let keyCode = e.keyCode || e.which;

        // This is where I should enter the note in the db; Also include a submit button
        if (keyCode === 13) {
          this.blur();
          console.log("Entered Note!");
        }
      };

      let ul = this.previousElementSibling;
      listItem.appendChild(inputItem);
      ul.appendChild(listItem);
      // this.previousSibling.appendChild(newItem)
      // let newItem = document.createElement("p")
    };
  }
};

function isEmpty(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}
// +++++++++++++++++++++++++++++++++++++++++

// START APP
const startApp = () => {
  // These will all be conditionally rendered eventually
  // =================================================
  createToday();
  createWeek();
  createMonth();
  // =================================================

  hideViews(views); // pass in views arr to hide different calendars depending on the stored view
  viewFunction(); // This function is to give the view buttons the ability to pick a view!
  updateTime(); // this updates the clock

  //   add function moved to each creation block
  //   addFunction(); // ability to include new items on a day
  let timer = setInterval(updateTime, 1000); // set a timer that executes the updateTime() function every second
};

// Unsplash API
// let response = fetch('https://api.unsplash.com/photos/random')
startApp();
