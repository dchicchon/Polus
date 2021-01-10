// Helper functions for calendar
// Feature to add new entries

// GLOBAL VARIABLES
// date = current Date

let addFunction = function () {
  let addButtons = document.getElementsByClassName("add");
  // For each add button, do something
  for (let i = 0; i < addButtons.length; i++) {
    let date = addButtons[i].value;
    // Lets add an onclick listener
    addButtons[i].onclick = function () {
      // When clicked, we will create a couple of HTML elements with attributes
      let entryListItem = document.createElement("li");
      let entryInput = document.createElement("input");
      let key = getKey();

      entryInput.setAttribute("class", "newItem");
      entryListItem.classList.add("entry", `${date}`, "new");
      entryListItem.id = key;
      entryListItem.setAttribute("draggable", "true");

      entryListItem.style.animationName = "grow";
      entryListItem.style.animationFillMode = "forwards";
      entryListItem.style.animationDuration = "0.25s";
      let done = false; // so that blur and enter arent done together

      // Add a key press listener for the HTML input element (listen for the keycode for Enter (13))
      entryInput.onkeypress = function (e) {
        let keyCode = e.keyCode || e.which;
        if (!e) e = window.event;
        if (keyCode === 13) {
          done = true;
          let text = entryInput.value.toString();
          let parent = this.parentNode;
          parent.textContent = text; // when this is done, the input element is removed
          let list = parent.parentNode;
          if (text.length > 0) {
            addToStorage(list, date, text, key);
          } else {
            entryListItem.remove();
          }
        }
      };

      entryInput.addEventListener("blur", function () {
        if (!done) {
          let text = entryInput.value.toString();
          let parent = this.parentNode;
          parent.textContent = text; // when this is done, the input element is removed
          let list = parent.parentNode;
          if (text.length > 0) {
            addToStorage(list, date, text, key);
          } else {
            entryListItem.remove();
          }
        }
      });

      entryListItem.appendChild(entryInput);
      addButtons[i].previousElementSibling.append(entryListItem);
      entryInput.focus();
      dragFunctions();
    };
  }
};

let getKey = () => {
  let alpha = "abcdefghijklmnopqrstuvwxyz";
  let key = `${alpha[Math.floor(Math.random() * 25)]}${Math.floor(Math.random() * 98) + 1
    }`;
  return key;
};

// Takes a list, date, text, and key and add item to chrome.storage.sync
let addToStorage = function (listElm, date, text, key) {
  // Get the Date Object from Storage to add the entry
  chrome.storage.sync.get([`${date}`], function (result) {
    // Entry
    let entry = {
      key,
      text,
      complete: false,
    };

    // If date object is empty
    if (isEmpty(result)) {
      let entries = [entry];

      // Initiate entry functions once the date object is set
      chrome.storage.sync.set({ [date]: entries }, function () {
        entryFunctions(listElm, entries);
      });

      // If its not empty, we will append the entry to the current array
    } else {
      let dateEntries = result[`${date}`];
      dateEntries.push(entry);
      entryFunctions(listElm, dateEntries);
      chrome.storage.sync.set({ [date]: dateEntries }, function () { });
    }
  });
};

//   Check if object is empty. Used to see if a day has any entries
let isEmpty = (obj) => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
};

// SET ENTRIES
let setEntries = function (date, elmList) {
  chrome.storage.sync.get([`${date}`], function (result) {
    if (!isEmpty(result)) {
      let entriesArr = result[`${date}`];
      for (let j = 0; j < entriesArr.length; j++) {
        // LEVEL 3 Day Details
        // Create DOM Elements
        let entryListItem = document.createElement("li");

        // Text Content
        entryListItem.textContent = entriesArr[j].text;

        // Values
        entryListItem.style.textDecoration = entriesArr[j]["complete"] ? "line-through" : "none";
        entryListItem.value = entriesArr[j]["complete"];

        // Setting Attributes
        entryListItem.id = entriesArr[j]["key"];
        entryListItem.classList.add("entry", `${date}`);
        entryListItem.setAttribute("draggable", "true");

        // Append
        elmList.appendChild(entryListItem);
        if (j === entriesArr.length - 1) {
          entryFunctions(elmList, entriesArr);
        }
      }
    }
  });
};

// ENTRY FUNCTIONS
let entryFunctions = function (elmList, arr) {
  let entriesArr = elmList.getElementsByClassName("entry");
  for (let i = 0; i < entriesArr.length; i++) {
    let entry = entriesArr[i];

    // EDIT ENTRY
    // let editDentry = function() {};
    // entryInput.onkeypress = function(e) {
    //   if (!e) e = window.event;
    //   let keyCode = e.keyCode || e.which;
    //   if (keyCode === 13) {
    //     // remove focus
    //     this.blur();
    //     chrome.storage.sync.get([`${date}`], function(result) {
    //       let dateEntries = result[`${date}`];

    //       // Get the index of the current Entry
    //       let index = dateEntries.indexOf(dateEntries[j]);
    //       if (index !== -1) {
    //         // Find and replace the element at the index with the new value
    //         dateEntries[index] = entryInput.value;
    //       }

    //       chrome.storage.sync.set({ [date]: dateEntries }, function() {});
    //     });
    //   }
    // };

    // Filter by the delete btn val. Set this filtered arr to the existing variable of arr

    let deleteEntry = function () {
      let entryDate = entry.classList.item(1); // check the classList for new dates
      chrome.storage.sync.get([`${entryDate}`], (result) => {
        let oldArr = result[`${entryDate}`];
        oldArr = oldArr.filter((elm) => elm.key !== entry.id);
        entry.style.display = "none";
        entry.remove();
        chrome.storage.sync.set({ [entryDate]: oldArr });
      });
    };

    let checkEntry = function () {
      let entryDate = entry.classList.item(1); // check the classList for new dates
      let checked = parseInt(entry.value);
      if (checked === 0) {
        entry.style.textDecoration = "line-through";
        entry.value = true;
        arr[i]["complete"] = true;
        chrome.storage.sync.set({ [entryDate]: arr });
      } else {
        entry.style.textDecoration = "none";
        entry.value = false;
        arr[i]["complete"] = false;
        chrome.storage.sync.set({ [entryDate]: arr });
      }
    };

    // If there is no listeners yet
    if (entry.getAttribute("listener") !== "true") {
      entry.setAttribute("listener", true);
      let active = false; // This is to check the entry click function. If false, we will turn it true. Will only go back to false if we edit or check
      // let entryEdit = document.createElement("button");

      function createCheckAndDelete(id) {
        let entryCheck = document.createElement("button");
        let entryDelete = document.createElement("button");

        // entryEdit.setAttribute("class", "edit");
        entryCheck.setAttribute("class", "check");
        entryDelete.setAttribute("class", "delete");

        // Text Content
        // entryEdit.textContent = "#";
        entryCheck.innerHTML = "&#10003;";
        entryDelete.textContent = "x";
        entryDelete.value = id
        return { entryCheck, entryDelete }
      }

      let { entryCheck, entryDelete } = createCheckAndDelete(entriesArr[i].id)

      entry.addEventListener("click", (event) => {
        // If entry is not active



        if (!active) {
          active = true;

          let ghostElm = document.createElement('li')
          ghostElm.id = 'ghostie'


          console.log(ghostElm)

          let nextSib = entry.nextSibling

          entry.parentNode.insertBefore(ghostElm, nextSib)

          let newStyle = {
            // height: '100px',
            textOverflow: 'none',
            // position: 'relative',
            height: 'fit-content',
            whiteSpace: 'normal',
            overflow: 'visible',

            // NEW
            background: 'rgba(24, 127, 187, 0.993)',
            width: '300px',
            height: '100px',
            position: 'absolute',
            'z-index': '100',

          }




          Object.assign(entry.style, newStyle) // style

          let rect = entry.getBoundingClientRect()

          // Prepend li where entry was to fill in space
          entry.append(entryCheck, entryDelete);
        }
        // If entry is active
        else if (event.target.classList.contains("entry") && active) {
          active = false;
          let newStyle = {
            // height: 'initial',

            background: 'rgba(24, 127, 187, 0.63)',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',

            // NEW
            height: 'initial',
            width: 'initial',
            position: 'relative',
          }
          Object.assign(entry.style, newStyle) // style
          document.getElementById('ghostie').remove()
          entry.removeChild(entryCheck);
          entry.removeChild(entryDelete);
        }
      });

      // DRAGGING ITEMS

      // Edit Entry
      // entryEdit.addEventListener('click',() => {

      // })

      entryCheck.addEventListener("click", checkEntry); // Check Entry
      entryDelete.addEventListener("click", deleteEntry); // Delete entry
    } else {
    }
  }
};

// ENTRY DRAG
let dragFunctions = function () {
  let dragged;
  document.addEventListener("drag", function (event) { }, false);
  document.addEventListener(
    "dragstart",
    function (event) {
      if (event.target.classList.contains("entry")) {
        dragged = event.target;
        event.dataTransfer.setData("text/plain", dragged.id);
        event.target.style.opacity = 0.5;
      }
    },
    false
  );
  document.addEventListener(
    "dragend",
    function (event) {
      event.target.style.opacity = "";
    },
    false
  );
  document.addEventListener(
    "dragover",
    function (event) {
      event.preventDefault();
    },
    false
  );
  document.addEventListener(
    "dragenter",
    function (event) {
      if (
        event.target.className === "weekDetails" ||
        event.target.className === "monthDetails"
      ) {
        event.target.style.background = "rgba(90, 90, 90, 0.329)";
      }
    },
    false
  );

  document.addEventListener(
    "dragleave",
    function (event) {
      if (
        event.target.className === "weekDetails" ||
        event.target.className === "monthDetails"
      ) {
        event.target.style.background = "initial";
      }
    },
    false
  );

  // DROP
  document.addEventListener(
    "drop",
    function (event) {
      event.preventDefault();
      // console.log(event.dataTransfer.getData("text"));  Might be useful later on to get data from the dragged item
      let date = event.target.id;
      let prevDate = dragged.classList.item(1);
      if (
        event.target.className === "weekDetails" ||
        event.target.className === "monthDetails"
      ) {
        event.target.style.background = "initial";
        dragged.parentNode.removeChild(dragged); // remove from initial DOM placement
        event.target.children[0].appendChild(dragged); // append to new location

        if (date !== prevDate) {
          dragged.classList.remove(prevDate); // remove previous date from classList
          dragged.classList.remove("new");
          dragged.classList.add(event.target.id, "new"); // add the new date to classList
          // Filter from previous Date object
          chrome.storage.sync.get([`${prevDate}`], function (result) {
            let entriesArr = result[`${prevDate}`];
            entriesArr = entriesArr.filter((elm) => elm.key !== dragged.id);
            chrome.storage.sync.set({ [prevDate]: entriesArr });
          });

          // Add to new date object
          addToStorage(
            event.target.children[0],
            date,
            dragged.textContent,
            dragged.id
          );
        }

        // Add to new Date Object
        // event.target.parentNode.appendChild(dragged);
        // }
      }
    },
    false
  );
};
