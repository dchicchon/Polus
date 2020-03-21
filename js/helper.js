// Helper functions for calendar
// Feature to add new entries
let addFunction = function() {
  let addButtons = document.getElementsByClassName("add");
  // console.log(addButtons)
  // For each add button, do something
  for (let i = 0; i < addButtons.length; i++) {
    let date = addButtons[i].value;
    // Lets add an onclick listener
    addButtons[i].onclick = function() {
      // When clicked, we will create a couple of HTML elements with attributes
      let entryListItem = document.createElement("li");
      let entryInput = document.createElement("input");
      entryInput.setAttribute("class", "newItem");

      entryListItem.style.animationName = "grow";
      entryListItem.style.animationFillMode = "forwards";
      entryListItem.style.animationDuration = "0.25s";
      let done = false; // so that blur and enter arent done together

      // Add a key press listener for the HTML input element (listen for the keycode for Enter (13))
      entryInput.onkeypress = function(e) {
        done = true;
        if (!e) e = window.event;
        let keyCode = e.keyCode || e.which;
        if (keyCode === 13) {
          this.blur();
          let parent = this.parentNode;
          let text = entryInput.value.toString();
          addToStorage(parent, date, text);
        }
      };

      if (!done) {
        entryInput.addEventListener("blur", function() {
          chrome.storage.sync.get([`${date}`], result => {
            let parent = this.parentNode;
            let text = entryInput.value.toString();
            addToStorage(parent, date, text);
          });
        });
      }

      entryListItem.appendChild(entryInput);
      addButtons[i].previousElementSibling.append(entryListItem);
      entryInput.focus();
    };
  }
};

let addToStorage = function(parent, date, text) {
  chrome.storage.sync.get([`${date}`], function(result) {
    // If the date is empty, we will set the entry to it
    parent.textContent = text; // when this is done, the input element is removed
    if (text.length > 0) {
      let alpha = "abcdefghijklmnopqrstuvwxyz";
      let key = `${alpha[Math.floor(Math.random() * 25) - 1]}${Math.floor(
        Math.random() * 98
      ) + 1}`;
      let entry = {
        key,
        text,
        complete: false
      };

      if (isEmpty(result)) {
        let entries = [entry];
        chrome.storage.sync.set({ [date]: entries }, function() {});

        // If its not empty, we will append the entry to the others
      } else {
        let dateEntries = result[`${date}`];
        dateEntries.push(entry);
        chrome.storage.sync.set({ [date]: dateEntries }, function() {});
      }
    }
  });
};

//   Check if object is empty. Used to see if a day has any entries
let isEmpty = obj => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
};

let addSites = mostVisitedURLs => {
  let ul = document.getElementsByClassName("topSites");
  for (let i = 0; i < mostVisitedURLs.length - 3; i++) {
    let index = mostVisitedURLs[i].url.indexOf("://");
    let lastIndex = mostVisitedURLs[i].url.indexOf(".com");
    if (lastIndex !== -1) {
      let url = mostVisitedURLs[i].url.substring(index + 3, lastIndex);
      let newIndex = url.indexOf("www.");
      if (newIndex !== -1) {
        url = url.substring(newIndex + 4);
      }
      url = url[0].toUpperCase() + url.slice(1);
      let link = document.createElement("a");
      link.textContent = url;
      link.setAttribute("class", "site");
      link.setAttribute("href", mostVisitedURLs[i].url);
      link.setAttribute("target", "_blank");
      ul[0].appendChild(link);
    }
  }
  let siteBox = document.getElementById("site-box");
  siteBox.addEventListener("mouseenter", function() {
    ul[0].setAttribute("style", "display:block");
  });

  siteBox.addEventListener("mouseleave", function() {
    ul[0].setAttribute("style", "display:none");
  });
};

// ENTRY FUNCTIONS
// ====================
let entryFunctions = function(elmList, date, arr) {
  let entriesArr = elmList.getElementsByClassName("entry");
  for (let i = 0; i < entriesArr.length; i++) {
    // console.log(entriesArr[i]);
    let entry = entriesArr[i];
    let active = false; // This is to check the entry click function. If false, we will turn it true. Will only go back to false if we edit or check

    // let entryEdit = document.createElement("button");
    let entryCheck = document.createElement("button");
    let entryDelete = document.createElement("button");

    // entryEdit.setAttribute("class", "edit");
    entryCheck.setAttribute("class", "check");
    entryDelete.setAttribute("class", "delete");

    // Text Content
    // entryEdit.textContent = "#";
    entryCheck.textContent = "%";
    entryDelete.textContent = "x";

    // Values
    entryDelete.value = arr[i].key;

    // Entry Click
    entry.addEventListener("click", event => {
      if (!active) {
        active = true;
        entry.style.textOverflow = "none";
        entry.style.height = "fit-content";
        entry.style.whiteSpace = "normal";
        entry.style.overflow = "visible";
        entry.append(entryCheck);
        entry.append(entryDelete);
      } else if (event.target.className === "entry" && active) {
        active = false;
        entry.style.height = "1rem";
        entry.style.textOverflow = "ellipsis";
        entry.style.whiteSpace = "nowrap";
        entry.style.overflow = "hidden";
        entry.removeChild(entryCheck);
        entry.removeChild(entryDelete);
      }
    });

    // Edit Entry
    // entryEdit.addEventListener('click',() => {

    // })

    // Check Entry
    entryCheck.addEventListener("click", () => {
      if (entry.value === 0) {
        entry.style.textDecoration = "line-through";
        entry.value = true;
        arr[i]["complete"] = true;
        chrome.storage.sync.set({ [date]: arr });
      } else {
        entry.style.textDecoration = "none";
        entry.value = false;
        arr[i]["complete"] = false;
        chrome.storage.sync.set({ [date]: arr });
      }
    });

    // Delete Entry
    entryDelete.addEventListener("click", () => {
      console.log("DELETE");
      // Filter by the delete btn val. Set this filtered arr to the existing variable of arr
      arr = arr.filter(elm => elm.key !== entryDelete.value);
      entry.style.display = "none";
      chrome.storage.sync.set({ [date]: arr });
    });
  }
};

// ====================
