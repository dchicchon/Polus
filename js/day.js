const createToday = () => {
  dayView.innerHTML = "";
  // LEVEL 1 Day View
  // Create DOM Elements
  let dayNav = document.createElement("div");
  let details = document.createElement("div"); // day details
  let prevBtn = document.createElement("button");
  let nextBtn = document.createElement("button");
  let dayTitle = document.createElement("h5");

  // let currentDate = new Date();
  let year = currentDate.getFullYear(),
    month = currentDate.getMonth() + 1,
    day = currentDate.getDate(),
    date = `${month}/${day}/${year}`;

  let dayInfo = dateStamp => {
    // LEVEL 2 Day
    // Create DOM Elements
    let detailsList = document.createElement("ul");
    let btn = document.createElement("button");

    chrome.storage.sync.get([`${dateStamp}`], function(result) {
      // console.log("Get storage");
      if (!isEmpty(result)) {
        let entriesArr = result[`${date}`];
        for (let i = 0; i < entriesArr.length; i++) {
          // LEVEL 3 Day Details
          // Create DOM Elements
          let entryListItem = document.createElement("li");
          let entryInput = document.createElement("input");
          let entryDelete = document.createElement("button");

          // Event Listeners
          entryDelete.onclick = function() {
            this.parentNode.style.display = "none";
            chrome.storage.sync.get([`${date}`], function(result) {
              let dateEntries = result[`${date}`];
              let index = parseInt(entryDelete.value);
              let newEntries = arrayRemove(dateEntries, index);
              chrome.storage.sync.set({ [date]: newEntries }, function() {});
            });
          };

          // Text Content
          entryDelete.textContent = "x";

          // Set Attributes
          entryListItem.setAttribute("class", "entry");
          entryInput.setAttribute("class", "newItem");
          entryDelete.setAttribute("value", `${i}`);
          entryDelete.setAttribute("class", "delete");

          // Set Values
          entryInput.value = entriesArr[i];

          // Append

          entryListItem.appendChild(entryInput);
          entryListItem.appendChild(entryDelete);
          detailsList.appendChild(entryListItem);
          entryDeleteHover();
        }
      }
    });

    // Text Content
    btn.textContent = "+";

    // Set Attributes
    btn.setAttribute("class", "add");
    details.setAttribute("class", "details");

    // Set Values
    btn.value = dateStamp;

    // Append
    details.appendChild(detailsList);
    details.appendChild(btn);
    addFunction();
  };

  // Event Listeners
  prevBtn.addEventListener("click", function() {
    details.innerHTML = "";
    currentDate.setDate(currentDate.getDate() - 1);
    year = currentDate.getFullYear();
    month = currentDate.getMonth() + 1;
    day = currentDate.getDate();
    date = `${month}/${day}/${year}`;
    dayTitle.textContent = date;
    dayInfo(date);
    // addFunction();
  });

  nextBtn.addEventListener("click", function() {
    details.innerHTML = "";
    currentDate.setDate(currentDate.getDate() + 1);
    year = currentDate.getFullYear();
    month = currentDate.getMonth() + 1;
    day = currentDate.getDate();
    date = `${month}/${day}/${year}`;
    dayTitle.textContent = date;
    dayInfo(date);
    // addFunction();
  });

  // Text Content
  prevBtn.textContent = "<-";
  dayTitle.textContent = date;
  nextBtn.textContent = "->";

  // Set Attributes
  dayNav.setAttribute("class", "nav");
  dayTitle.setAttribute("class", "title");

  // Append
  dayNav.appendChild(prevBtn);
  dayNav.appendChild(dayTitle);
  dayNav.appendChild(nextBtn);
  dayView.appendChild(dayNav);
  dayView.appendChild(details);

  dayInfo(date);
};
