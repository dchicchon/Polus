const createWeek = () => {
  // LEVEL 1 Week View
  weekView.innerHTML = "";

  // This will allow us to go back the days until we get Monday
  let startDate = new Date();
  while (startDate.getDay() !== 1) {
    startDate.setDate(startDate.getDate() - 1);
  }

  for (let i = 0; i <= 6; i++) {
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
        for (let i = 0; i < entriesArr.length; i++) {
          // LEVEL 3
          // Create DOM Element
          let entryListItem = document.createElement("li");

          let entryInput = document.createElement("input");
          let entryEdit = document.createElement("button");
          let entryCheck = document.createElement("button");
          let entryDelete = document.createElement("button");

          // Add Event Listeners
          entryDelete.onclick = function() {
            // DELETE ENTRY
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

          entryInput.onkeypress = function(e) {
            // EDIT ENTRY
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

          // Text Content
          entryEdit.textContent = "#";
          entryCheck.textContent = "%";
          entryDelete.textContent = "x";

          // Set Attributes
          entryInput.setAttribute("class", "newItem");
          entryListItem.setAttribute("class", "entry");
          entryDelete.setAttribute("value", `${i}`);
          entryEdit.setAttribute("class", "edit");
          entryCheck.setAttribute("class", "check");
          entryDelete.setAttribute("class", "delete");

          // Set Values
          entryListItem.textContent = entriesArr[i]["text"];
          entryListItem.style.textDecoration = entriesArr[i]["complete"]
            ? "line-through"
            : "none";
          entryListItem.value = 0;
          entryDelete.id = date;

          // Should be based on the entry object 'complete' key
          entryCheck.value = entriesArr[i]["complete"];

          // Should be able to edit, check, or delete entry
          // Lets have an onclick listener for entryListItem
          // Check
          entryCheck.addEventListener("click", () => {
            if (entryCheck.value === "false") {
              entryListItem.style.textDecoration = "line-through";
              entryCheck.value = true;
              // update in storage
              entriesArr[i]["complete"] = true;
              chrome.storage.sync.set({ [date]: entriesArr });
            } else {
              entryListItem.style.textDecoration = "none";
              entryCheck.value = false;
              entriesArr[i]["complete"] = false;
              chrome.storage.sync.set({ [date]: entriesArr });
            }
          });

          entryListItem.addEventListener("click", event => {
            if (entryListItem.value === 0) {
              entryListItem.value = 1;
              entryListItem.style.textOverflow = "none";
              entryListItem.style.height = "fit-content";
              entryListItem.style.whiteSpace = "normal";
              entryListItem.style.overflow = "visible";

              entryListItem.append(entryEdit);
              entryListItem.append(entryCheck);
              entryListItem.append(entryDelete);
            } else {
              entryListItem.value = 0;
              entryListItem.style.height = "1rem";
              entryListItem.style.textOverflow = "ellipsis";
              entryListItem.style.whiteSpace = "nowrap";
              entryListItem.style.overflow = "hidden";
              entryListItem.removeChild(entryEdit);
              entryListItem.removeChild(entryCheck);
              entryListItem.removeChild(entryDelete);
            }
          });

          // entryListItem.addEventListener

          // Append
          // entryListItem.appendChild(entryInput);
          // entryListItem.appendChild(entryDelete);
          detailsList.appendChild(entryListItem);
          // entryDeleteHover();
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
