const createMonth = () => {
    monthView.innerHTML = "";
    let currentDate = new Date(),
      month = currentDate.getMonth(),
      year = currentDate.getFullYear();
  
    // Create the elements
    let monthNav = document.createElement("div"); // container of the nav
    let monthDays = document.createElement("div"); // container for the month days
  
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
    monthNav.setAttribute("class", "nav");
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
  
        // Text content of the div
        dayDiv.setAttribute("class", "monthDay");
        dayDiv.textContent = `${day} ${weekdays[dayDate.getUTCDay()]}`;
  
        let details = document.createElement("div");
        let detailsList = document.createElement("ul");
  
        // Gets storage items and creates an li element for each item
        chrome.storage.sync.get([`${date}`], function(result) {
          // If it is not empty
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
  
        details.setAttribute("class", "monthDetails");
        details.appendChild(detailsList);
        dayDiv.appendChild(details);
        details.appendChild(btn);
  
        monthDays.appendChild(dayDiv);
      }
      addFunction();
    };
  
    // Click to go to previous month
    prevBtn.addEventListener("click", function() {
      currentDate.setMonth(currentDate.getMonth() - 1);
      month = currentDate.getMonth();
      year = currentDate.getFullYear();
      monthTitle.textContent = months[month] + ` ${year}`;
      monthDays.innerHTML = "";
      createDaysInMonth(year, month);
    });
  
    // Click to go to next month
    nextBtn.addEventListener("click", function() {
      currentDate.setMonth(currentDate.getMonth() + 1);
      month = currentDate.getMonth();
      year = currentDate.getFullYear();
      monthTitle.textContent = months[month] + ` ${year}`;
      monthDays.innerHTML = "";
      createDaysInMonth(year, month);
    });
    // =============================================
  
    monthView.appendChild(monthNav);
    monthView.appendChild(monthDays);
    createDaysInMonth(year, month);
  };