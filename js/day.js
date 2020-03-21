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
      if (!isEmpty(result)) {
        let entriesArr = result[`${date}`];
        for (let i = 0; i < entriesArr.length; i++) {
          // LEVEL 3 Day Details
          // Create DOM Elements
          let entryListItem = document.createElement("li");

          // Text Content
          entryListItem.textContent = entriesArr[i].text;

          // Set Attributes
          entryListItem.setAttribute("class", "entry");

          // Set Values
          entryListItem.style.textDecoration = entriesArr[i]["complete"]
            ? "line-through"
            : "none";
          entryListItem.value = entriesArr[i]["complete"];

          // Append
          detailsList.appendChild(entryListItem);
          if (i === entriesArr.length - 1) {
            entryFunctions(detailsList, date, entriesArr);
          }
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
  prevBtn.innerHTML = "&larr;";
  dayTitle.textContent = date;
  nextBtn.innerHTML = "&rarr;";

  // Set Attributes

  prevBtn.setAttribute("class", "arrow");
  nextBtn.setAttribute("class", "arrow");
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
