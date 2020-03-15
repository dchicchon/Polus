const createWeek = () => {
  // LEVEL 1 Week View
  weekView.innerHTML = "";

  // Week should always start with Monday or Sunday?
  // Monday index = 1

  for (let i = 0; i <= 6; i++) {
    let thisDate = new Date();
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

    chrome.storage.sync.get([`${date}`], function(result) {
      if (!isEmpty(result)) {
        let entriesArr = result[`${date}`];
        for (let i = 0; i < entriesArr.length; i++) {
          // LEVEL 3
          // Create DOM Element
          let entryListItem = document.createElement("li");
          let entryInput = document.createElement("input");
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
          entryDelete.textContent = "x";

          // Set Attributes
          entryInput.setAttribute("class", "newItem");
          entryListItem.setAttribute("class", "entry");
          entryDelete.setAttribute("value", `${i}`);
          entryDelete.setAttribute("class", "delete");

          // Set Values
          entryInput.value = entriesArr[i];
          entryDelete.id = date;

          // Append
          entryListItem.appendChild(entryInput);
          entryListItem.appendChild(entryDelete);
          detailsList.appendChild(entryListItem);
          entryDeleteHover();
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
