const createWeek = () => {
  // LEVEL 1 Week View
  weekView.innerHTML = "";

  // This will allow us to go back the days until we get Monday
  let startDate = new Date();
  while (startDate.getDay() !== 1) {
    startDate.setDate(startDate.getDate() - 1);
  }

  for (let i = 0; i <= 6; i++) {
    // Entry Variables
    let thisDate = new Date(startDate);
    thisDate.setDate(thisDate.getDate() + i);
    let year = thisDate.getFullYear(),
      month = thisDate.getMonth() + 1,
      day = thisDate.getDate(),
      date = `${month}/${day}/${year}`;

    // LEVEL 2 Week Day
    // Create DOM Elements
    let weekday = document.createElement("div");
    let weekDate = document.createElement("div");
    let weekTitle = document.createElement("div");
    let details = document.createElement("div");
    let detailsList = document.createElement("ul");
    let btn = document.createElement("button");

    // If week day is today
    if (currentDate.getDay() === thisDate.getDay()) {
      weekDate.style.backgroundColor = "rgba(5, 80, 123, 0.992)";
    }

    chrome.storage.sync.get([`${date}`], function(result) {
      if (!isEmpty(result)) {
        let entriesArr = result[`${date}`];
        for (let j = 0; j < entriesArr.length; j++) {
          // LEVEL 3
          // Create DOM Element
          let entryListItem = document.createElement("li");
          // let entryEdit = document.createElement("button");

          // Add Event Listeners
          // ==================================
          // EDIT ENTRY
          // entryInput.onkeypress = function(e) {
          //   if (!e) e = window.event;
          //   let keyCode = e.keyCode || e.which;
          //   if (keyCode === 13) {
          //     // remove focus
          //     this.blur();
          //     chrome.storage.sync.get([`${date}`], function(result) {
          //       let dateEntries = result[`${date}`];

          //       // Get the index of the current Entry
          //       let index = dateEntries.indexOf(dateEntries[j]);
          //       if (index !== -1) {
          //         // Find and replace the element at the index with the new value
          //         dateEntries[index] = entryInput.value;
          //       }

          //       chrome.storage.sync.set({ [date]: dateEntries }, function() {});
          //     });
          //   }
          // };

          // DRAGGING

          // Text Content
          // entryEdit.textContent = "#";
          entryListItem.textContent = entriesArr[j]["text"];

          // Set Attributes
          entryListItem.setAttribute("class", "entry");
          entryListItem.setAttribute("draggable", "true");
          entryListItem.ondragstart="event.dataTransfer.setdata('text/plain',null)"
          // entryInput.setAttribute("class", "newItem");
          // entryEdit.setAttribute("class", "edit");

          // Set Values
          entryListItem.style.textDecoration = entriesArr[j]["complete"]
            ? "line-through"
            : "none";
          entryListItem.value = entriesArr[j]["complete"];

          // Append
          detailsList.appendChild(entryListItem);

          // Last Item in the array
          if (j === entriesArr.length - 1) {
            entryFunctions(detailsList, date, entriesArr);
          }
        }
      }
    });

    // Text Content
    weekDate.textContent = `${day}`;
    weekTitle.textContent = `${weekdays[thisDate.getDay()]}`;
    btn.textContent = "+";

    // Set Attributes
    weekday.setAttribute("class", "weekday");
    weekDate.setAttribute("class", "weekDate");
    weekTitle.setAttribute("class", "weekTitle");
    details.setAttribute("class", "details");
    btn.setAttribute("class", "add");

    // Set Values
    btn.value = date;

    // Append
    details.appendChild(detailsList);
    details.appendChild(btn);
    weekday.appendChild(weekDate);
    weekday.appendChild(weekTitle);
    weekday.appendChild(details);
    weekView.appendChild(weekday);
  }
  addFunction();
};
