// Helper functions for calendar
// Feature to add new entries
let addFunction = () => {
  let addButtons = document.getElementsByClassName("add");
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

      // Add a key press listener for the HTML input element (listen for the keycode for Enter (13))
      entryInput.onkeypress = function(e) {
        if (!e) e = window.event;
        let keyCode = e.keyCode || e.which;
        if (keyCode === 13) {
          this.blur();
          // Check the storage for this date
          chrome.storage.sync.get([`${date}`], function(result) {
            // If the date is empty, we will set the entry to it
            let text = entryInput.value.toString();
            if (text.length > 0) {
              let entry = {
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
        }
      };

      entryInput.addEventListener("blur", () => {
        chrome.storage.sync.get([`${date}`], function(result) {
          // If the date is empty, we will set the entry to it
          let text = entryInput.value.toString();
          if (text.length > 0) {
            let entry = {
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
      });

      entryListItem.appendChild(entryInput);
      addButtons[i].previousElementSibling.append(entryListItem);
      entryInput.focus();
    };
  }
};

//   Delete entries: NOT WORKING AT THE MOMENT
let deleteFunction = () => {
  let deleteButtons = document.getElementsByClassName("delete");
  console.log(deleteButtons);
  for (let i = 0; i < deleteButtons.length; i++) {
    let date = deleteButtons[i].id;
    console.log(date);
    deleteButtons[i].onclick = function() {
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
  }
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

//   Removes a value from an array
let arrayRemove = (arr, val) => {
  return arr.filter(function(ele) {
    return arr.indexOf(ele) != val;
  });
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

// Set Event Listers for CSS
let entryDeleteHover = () => {
  let listItems = document.getElementsByClassName("entry");
  for (let i = 0; i < listItems.length; i++) {
    listItems[i].addEventListener("mouseenter", () => {
      listItems[i].children[0].style.opacity = 1; // this points to the delete button which is the 2nd child
    });
    listItems[i].addEventListener("mouseleave", () => {
      listItems[i].children[0].style.opacity = 0;
    });
  }
};
