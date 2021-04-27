// THIS SCRIPT IS FOR ALL THE VIEWS
import { createToday } from "../calendar/day";
import { createWeek } from "../calendar/week";
import { createMonth } from "../calendar/month";

let dayView = document.getElementById("daily");
let weekView = document.getElementById("week");
let monthView = document.getElementById("month");
export const views = [dayView, weekView, monthView];

// Click on view buttons to allow selective viewing
export const viewFunction = () => {
  let viewButtons = document.getElementsByClassName("view-btn");
  for (let j = 0; j < viewButtons.length; j++) {
    viewButtons[j].onclick = function () {
      let clickedView = this.textContent.toLowerCase();
      chrome.storage.sync.get(["view"], function (result) {
        if (clickedView !== result["view"]) {
          chrome.storage.sync.set({ view: clickedView }, function () {
            hideViews(views);
          });
        }
      });
    };
  }
};

// Sort views to show the one selected
export const hideViews = (viewsArr) => {
  chrome.storage.sync.get(["view"], function (result) {
    for (let k = 0; k < viewsArr.length; k++) {
      // If the view clicked on equals the result
      if (views[k].id === result["view"]) {
        let view = result["view"];
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

// Get the background image and set stylings
export const backgroundImage = () => {
  chrome.storage.sync.get(["background"], function (result) {
    let page = document.getElementsByTagName("html");
    page[0].style.background = `rgba(0,0,0,0.9) url(${result.background.url + `&w=${window.innerWidth}`
      }) no-repeat fixed`;

  });
};
