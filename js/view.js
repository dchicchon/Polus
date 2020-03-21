// THIS SCRIPT IS FOR ALL THE VIEWS

let dayView = document.getElementById("daily");
let weekView = document.getElementById("week");
let monthView = document.getElementById("month");
let views = [dayView, weekView, monthView];

let viewButtons = document.getElementsByClassName("view-btn");
let currentView;

const viewFunction = () => {
  for (let j = 0; j < viewButtons.length; j++) {
    viewButtons[j].onclick = function() {
      currentView = this.textContent.toLowerCase();
      chrome.storage.sync.get(["view"], function(result) {
        if (currentView !== result["view"]) {
          chrome.storage.sync.set({ view: currentView }, function() {
            hideViews(views);
          });
        }
      });
    };
  }
};

const hideViews = viewsArr => {
  chrome.storage.sync.get(["view"], function(result) {
    for (let k = 0; k < viewsArr.length; k++) {
      // If the view clicked on equals the result
      if (views[k].id === result["view"]) {
        // console.log(result["view"]);
        view = result["view"];
        switch (view) {
          case "daily":
            createToday();
            break;
          case "week":
            createWeek();

            break;
          case "month":
            createMonth();
            break;
        }
        views[k].setAttribute("style", "display:flex");
      } else {
        views[k].setAttribute("style", "display:none");
      }
    }
  });
};
