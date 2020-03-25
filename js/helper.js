// Helper functions for calendar
// Feature to add new entries

// GLOBAL VARIABLES
// date = current Date

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
      entryListItem.setAttribute("class", "entry");
      entryListItem.id = date;

      entryListItem.style.animationName = "grow";
      entryListItem.style.animationFillMode = "forwards";
      entryListItem.style.animationDuration = "0.25s";
      let done = false; // so that blur and enter arent done together

      // Add a key press listener for the HTML input element (listen for the keycode for Enter (13))
      entryInput.onkeypress = function(e) {
        let keyCode = e.keyCode || e.which;
        if (!e) e = window.event;
        if (keyCode === 13) {
          done = true;
          let text = entryInput.value.toString();
          let parent = this.parentNode;
          parent.textContent = text; // when this is done, the input element is removed
          let list = parent.parentNode;
          if (text.length > 0) {
            addToStorage(list, date, text);
          } else {
            entryListItem.remove();
          }
        }
      };

      entryInput.addEventListener("blur", function() {
        if (!done) {
          let text = entryInput.value.toString();
          let parent = this.parentNode;
          parent.textContent = text; // when this is done, the input element is removed
          let list = parent.parentNode;
          if (text.length > 0) {
            addToStorage(list, date, text);
          } else {
            entryListItem.remove();
          }
        }
      });
      // });

      entryListItem.appendChild(entryInput);
      addButtons[i].previousElementSibling.append(entryListItem);
      entryInput.focus();
    };
  }
};

let addToStorage = function(listElm, date, text) {
  chrome.storage.sync.get([`${date}`], function(result) {
    // If the date is empty, we will set the entry to it
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
      entryFunctions(listElm, date, entries);
      chrome.storage.sync.set({ [date]: entries }, function() {});

      // If its not empty, we will append the entry to the others
    } else {
      let dateEntries = result[`${date}`];
      dateEntries.push(entry);
      entryFunctions(listElm, date, dateEntries);
      chrome.storage.sync.set({ [date]: dateEntries }, function() {});
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

// let addSites = mostVisitedURLs => {
//   let ul = document.getElementsByClassName("topSites");
//   for (let i = 0; i < mostVisitedURLs.length - 3; i++) {
//     let index = mostVisitedURLs[i].url.indexOf("://");
//     let lastIndex = mostVisitedURLs[i].url.indexOf(".com");
//     if (lastIndex !== -1) {
//       let url = mostVisitedURLs[i].url.substring(index + 3, lastIndex);
//       let newIndex = url.indexOf("www.");
//       if (newIndex !== -1) {
//         url = url.substring(newIndex + 4);
//       }
//       url = url[0].toUpperCase() + url.slice(1);
//       let link = document.createElement("a");
//       link.textContent = url;
//       link.setAttribute("class", "site");
//       link.setAttribute("href", mostVisitedURLs[i].url);
//       link.setAttribute("target", "_blank");
//       ul[0].appendChild(link);
//     }
//   }
//   let siteBox = document.getElementById("site-box");
//   siteBox.addEventListener("mouseenter", function() {
//     ul[0].setAttribute("style", "display:block");
//   });

//   siteBox.addEventListener("mouseleave", function() {
//     ul[0].setAttribute("style", "display:none");
//   });
// };

// ENTRY FUNCTIONS
let entryFunctions = function(elmList, date, arr) {
  let entriesArr = elmList.getElementsByClassName("entry");
  console.log(entriesArr);
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

    // DRAGGING ITEMS

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
      // Filter by the delete btn val. Set this filtered arr to the existing variable of arr
      arr = arr.filter(elm => elm.key !== entryDelete.value);
      entry.style.display = "none";
      chrome.storage.sync.set({ [date]: arr });
    });
  }
};

// ENTRY DRAG
let dragFunctions = function() {
  let dragged;
  document.addEventListener("drag", function(event) {}, false);
  document.addEventListener(
    "dragstart",
    function(event) {
      if (event.target.className === "entry") {
        dragged = event.target;
        event.target.style.opacity = 0.5;
      }
    },
    false
  );
  document.addEventListener(
    "dragend",
    function(event) {
      event.target.style.opacity = "";
    },
    false
  );
  document.addEventListener(
    "dragover",
    function(event) {
      event.preventDefault();
    },
    false
  );
  document.addEventListener(
    "dragenter",
    function(event) {
      if (
        event.target.className === "details" ||
        event.target.className === "monthDetails" // ||
        // event.target.className === "detailsList"
      ) {
        event.target.style.background = "rgba(90, 90, 90, 0.329)";
      }
    },
    false
  );

  document.addEventListener(
    "dragleave",
    function(event) {
      if (
        event.target.className === "details" ||
        event.target.className === "monthDetails" // ||
        // event.target.className === "detailsList"
      ) {
        event.target.style.background = "initial";
      }
    },
    false
  );

  document.addEventListener(
    "drop",
    function(event) {
      event.preventDefault();
      // console.log(event.dataTransfer.getData("text"));
      if (
        event.target.className === "details" ||
        event.target.className === "monthDetails"
      ) {
        event.target.style.background = "initial";
        dragged.parentNode.removeChild(dragged);
        if (event.target.className === "details" || "monthDetails") {
          let date = event.target.id;
          let prevDate = dragged.id;
          event.target.children[0].appendChild(dragged);
          chrome.storage.sync.get([`${prevDate}`], function(result) {
            let entriesArr = result[`${prevDate}`];
            console.log(entriesArr);
            entriesArr = entriesArr.filter(
              elm => elm.text !== dragged.textContent
            );
            chrome.storage.sync.set({ [prevDate]: entriesArr });
          });
          addToStorage(date, dragged.textContent);
        } // else if (event.target.className === "detailsList") {
        // event.target.parentNode.appendChild(dragged);
        // }
      }
    },
    false
  );
};
