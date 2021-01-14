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

      // entryInput.setAttribute("class", "newItem");
      entryInput.classList.add("newItem");
      entryInput.style.background = "none";
      entryListItem.classList.add("entry", `${date}`, "blue", "new");
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
            addToStorage(list, date, text, key, "blue");
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
  let key = `${alpha[Math.floor(Math.random() * 25)]}${
    Math.floor(Math.random() * 98) + 1
  }`;
  return key;
};

// Takes a list, date, text, and key and add item to chrome.storage.sync
let addToStorage = function (listElm, date, text, key, color) {
  // Get the Date Object from Storage to add the entry
  chrome.storage.sync.get([`${date}`], function (result) {
    // Entry
    let entry = {
      key,
      text,
      color,
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
      chrome.storage.sync.set({ [date]: dateEntries }, function () {});
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
    // If the date has entries
    if (!isEmpty(result)) {
      let entriesArr = result[`${date}`]; // entries arr

      // For each entry
      for (let j = 0; j < entriesArr.length; j++) {
        let entryListItem = document.createElement("li");

        // Text Content
        entryListItem.textContent = entriesArr[j].text;

        let setEntryStyle = {
          textDecoration: entriesArr[j]["complete"] ? "line-through" : "none",
          // background: entriesArr[j]["color"] ? entriesArr[j]["color"] : "rgba(21, 115, 170, 0.63)",
        };

        let initialColor = entriesArr[j]["color"]
          ? entriesArr[j]["color"]
          : "blue";

        // Values
        Object.assign(entryListItem.style, setEntryStyle);
        // entryListItem.style.textDecoration = entriesArr[j]["complete"] ? "line-through" : "none";
        entryListItem.value = entriesArr[j]["complete"];

        // Setting Attributes
        entryListItem.id = entriesArr[j]["key"];
        entryListItem.classList.add("entry", `${date}`, initialColor);
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
    let date = entry.classList[1];

    let editEntry = function () {
      let editButton = this; // declare 'this' for less confusion and consistency in all functions
      // create input
      let input = document.createElement("textarea");
      input.className = "newItem";
      input.value = editButton.previousElementSibling.textContent;

      editButton.parentNode.insertBefore(
        input,
        editButton.previousElementSibling
      );
      editButton.previousElementSibling.remove();
      input.focus();
      editButton.textContent = "Submit";

      editButton.removeEventListener("click", editEntry);
      editButton.addEventListener("click", submitText);

      function submitText() {
        //  Get new text value
        let newText = input.value;

        // Create new text Node
        let textNode = document.createElement("p");
        textNode.className = "text";
        textNode.textContent = newText;

        // Insert and remove input node
        input.blur();
        editButton.parentNode.removeChild(input);

        editButton.parentNode.insertBefore(textNode, editButton);

        editButton.textContent = "Edit";

        // add text to storage to update
        chrome.storage.sync.get([`${date}`], function (result) {
          let dateEntries = result[`${date}`]; // [{complete: false, key: "u35", text: "work at 11"}, { complete: false, key: "a55", text: "Biceps" }]
          let newDateEntries = [...dateEntries];
          // Get the index of the current Entry
          let index = newDateEntries.findIndex((x) => x.key === entry.id);
          newDateEntries[index]["text"] = newText;
          chrome.storage.sync.set({ [date]: newDateEntries }, function () {
            editButton.removeEventListener("click", submitText);
            editButton.addEventListener("click", editEntry);
          });
        });
      }
    };

    let colorEntry = function () {
      let subParent = this.parentNode;
      let mainParent = subParent.parentNode;
      let prevVal = mainParent.classList[2];
      mainParent.classList.remove(prevVal);
      let color = this.value;
      mainParent.classList.add(color);
      chrome.storage.sync.get([`${date}`], function (result) {
        let oldArr = result[`${date}`];
        let newArr = [...oldArr];
        let index = newArr.findIndex((x) => x.key === entry.id);
        newArr[index]["color"] = color;
        console.log(color);
        console.log(newArr);
        chrome.storage.sync.set({ [date]: newArr });
      });
    };

    let deleteEntry = function () {
      // let entryDate = entry.classList.item(1); // check the classList for new dates
      chrome.storage.sync.get([`${date}`], (result) => {
        let oldArr = result[`${date}`];
        oldArr = oldArr.filter((elm) => elm.key !== entry.id);
        entry.style.display = "none";
        entry.remove();
        document.getElementById("ghostie").remove();
        chrome.storage.sync.set({ [date]: oldArr });
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

      function createEntryElements(entry) {
        let entryText = document.createElement("p");
        let entryColor = document.createElement("select");
        let entryEdit = document.createElement("button");
        let entryCheck = document.createElement("button");
        let entryDelete = document.createElement("button");

        entryText.className = "text";
        entryColor.className = "color";
        entryCheck.className = "check";
        entryDelete.className = "delete";
        entryEdit.className = "edit";

        // Text Content
        entryColor.value = entry.classList[2];
        
        console.log("ClassValue");
        console.log(entry.classList[2]);
        console.log("Select");
        console.log(entryColor);
        console.log("Value");
        console.log(entryColor.value);
        entryColor.style.outline = "none";
        let colorWheel = ["blue", "green", "gold"];
        // initial selected option should be the color that is already on the entry
        for (let color of colorWheel) {
          // console.log(color)
          let option = document.createElement("option");
          option.classList.add("color-option", entry.classList[2]);
          option.text = color;
          option.style.outline = "none";
          entryColor.options.add(option);
        }
        entryEdit.textContent = "Edit";
        entryCheck.innerHTML = "&#10003;";
        entryDelete.textContent = "x";

        entryText.textContent = entry.textContent;
        entryDelete.value = entry.id;

        let entryDiv = document.createElement("div");
        entryDiv.className = "entry-container";

        entryDiv.append(
          entryText,
          entryEdit,
          entryColor,
          entryCheck,
          entryDelete
        );

        entryColor.addEventListener("change", colorEntry);
        entryEdit.addEventListener("click", editEntry); // Edit Entry
        entryCheck.addEventListener("click", checkEntry); // Check Entry
        entryDelete.addEventListener("click", deleteEntry); // Delete entry

        return entryDiv;
      }

      let entryDiv = createEntryElements(entry);

      // If entry is not active
      entry.addEventListener("click", (event) => {
        if (!active) {
          active = true;

          let ghostElm = document.createElement("li");
          ghostElm.id = "ghostie"; // should i make this a class or an id?

          let nextSib = entry.nextSibling;
          entry.parentNode.insertBefore(ghostElm, nextSib); // 1.element to place, 2. reference node // remember praentNode!

          let newStyle = {
            // height: '100px',
            textOverflow: "none",
            // position: 'relative',
            height: "fit-content",
            whiteSpace: "normal",
            overflow: "visible",

            // NEW
            // background: "rgba(24, 127, 187, 0.993)",
            width: "300px",
            "max-width": "300px",
            height: "fit-content",
            position: "absolute",
            "z-index": "100",
          };

          Object.assign(entry.style, newStyle); // style

          entry.textContent = "";
          // Make new div inside of entry

          entry.append(entryDiv);
        }
        // If entry is active
        else if (
          (event.target.classList.contains("entry") && active) ||
          event.target.classList.contains("entry-container") ||
          event.target.classList.contains("text")
        ) {
          active = false;
          let newStyle = {
            // background: "rgba(24, 127, 187, 0.63)",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",

            // NEW
            height: "initial",
            "max-width": "",
            width: "90%",
            position: "relative",
          };
          Object.assign(entry.style, newStyle); // style
          document.getElementById("ghostie").remove();
          entry.removeChild(entryDiv);
          entry.textContent = entryDiv.children[0].textContent;
        }
      });
    }
  }
};

// ENTRY DRAG
let dragFunctions = function () {
  let dragged;
  document.addEventListener("drag", function (event) {}, false);
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
