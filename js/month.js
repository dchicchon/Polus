const createMonth = () => {
  monthView.innerHTML = "";

  // LEVEL 1 Month View
  // Create DOM Elements
  let monthNav = document.createElement("div"); // container of the nav
  let monthDays = document.createElement("div"); // container for the month days
  let prevBtn = document.createElement("button"); // previous button
  let nextBtn = document.createElement("button"); // next button
  let monthTitle = document.createElement("h4"); // title

  // =============================================

  // This will generate all the days for a month and all the associated notes
  let createDaysInMonth = (year, month) => {
    let daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 0; i < daysInMonth; i++) {
      let dayDate = new Date(year, month, i + 1), // ex. 1/20/20
        day = dayDate.getDate(),
        date = `${month + 1}/${day}/${year}`;

      // LEVEL 2 DAY
      // Create DOM Elements
      let dayDiv = document.createElement("div");
      let details = document.createElement("div");
      let detailsList = document.createElement("ul");
      let btn = document.createElement("button");

      // Gets storage items and creates an li element for each item
      chrome.storage.sync.get([`${date}`], function(result) {
        if (!isEmpty(result)) {
          let entriesArr = result[`${date}`];
          for (let j = 0; j < entriesArr.length; j++) {
            // LEVEL 3 Day Details
            // Create DOM Elements
            let entryListItem = document.createElement("li");
            let entryInput = document.createElement("input");
            let entryDelete = document.createElement("button");

            // Text Content
            entryDelete.textContent = "x";

            // Values
            entryDelete.id = date;
            entryInput.value = entriesArr[j];

            // Event Listeners
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

            // Setting Attributes
            entryListItem.setAttribute("class", "entry");
            entryDelete.setAttribute("value", `${j}`);
            entryDelete.setAttribute("class", "delete");
            entryInput.setAttribute("class", "newItem");

            // Append
            entryListItem.appendChild(entryInput);
            entryListItem.appendChild(entryDelete);
            detailsList.appendChild(entryListItem);
            entryDeleteHover();
          }
        }
      });

      // Set Attributes
      details.setAttribute("class", "monthDetails");
      dayDiv.setAttribute("class", "monthDay");
      btn.setAttribute("class", "add");

      // Text Content
      dayDiv.textContent = `${day} ${weekdays[dayDate.getUTCDay()]}`;
      btn.textContent = "+";

      // Set Values
      btn.value = date;

      // Append
      monthDays.appendChild(dayDiv);
      details.appendChild(detailsList);
      dayDiv.appendChild(details);
      details.appendChild(btn);
    }
    addFunction();
  };

  // Text Content
  prevBtn.textContent = "<-";
  monthTitle.textContent = months[month] + ` ${year}`;
  nextBtn.textContent = "->";

  // Set attributes
  monthTitle.setAttribute("class", "title");
  monthNav.setAttribute("class", "nav");
  monthDays.setAttribute("class", "monthDays");

  // Event Listeners
  prevBtn.addEventListener("click", function() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    month = currentDate.getMonth();
    year = currentDate.getFullYear();
    monthTitle.textContent = months[month] + ` ${year}`;
    monthDays.innerHTML = "";
    createDaysInMonth(year, month);
  });
  nextBtn.addEventListener("click", function() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    month = currentDate.getMonth();
    year = currentDate.getFullYear();
    monthTitle.textContent = months[month] + ` ${year}`;
    monthDays.innerHTML = "";
    createDaysInMonth(year, month);
  });

  // Append
  monthNav.appendChild(prevBtn);
  monthNav.appendChild(monthTitle);
  monthNav.appendChild(nextBtn);
  monthView.appendChild(monthNav);
  monthView.appendChild(monthDays);
  createDaysInMonth(year, month);
};
