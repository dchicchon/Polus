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
  