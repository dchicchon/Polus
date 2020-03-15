const createToday = () => {
    dayView.innerHTML = "";
    let currentDate = new Date();
  
    let year = currentDate.getFullYear(),
      month = currentDate.getMonth() + 1,
      day = currentDate.getDate(),
      date = `${month}/${day}/${year}`;
  
    // Nav
    let dayNav = document.createElement("div");
    let details = document.createElement("div"); // day details
  
    // Prev Btn
    let prevBtn = document.createElement("button");
    // Next Btn
    let nextBtn = document.createElement("button");
    // Title
    let dayTitle = document.createElement("h5");
    dayNav.appendChild(prevBtn);
    dayNav.appendChild(dayTitle);
    dayNav.appendChild(nextBtn);
  
    dayNav.setAttribute("class", "nav");
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
  
    // This is how we can change the day for the daily calendar view. What I want to do is based off the currentDate object, I will be able to get the previous day timestamp
    // This is a temporary fix
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
  
    dayView.appendChild(dayNav);
    dayView.appendChild(details);
    dayInfo(date);
  };