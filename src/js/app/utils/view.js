// THIS SCRIPT IS FOR ALL THE VIEWS
// import { createToday } from "../calendar/day";
// import { createWeek } from "../calendar/week";
// import { createMonth } from "../calendar/month";

// Click on view buttons to allow selective viewing

// Sort views to show the one selected

// Get the background image and set stylings
export const backgroundImage = () => {
  chrome.storage.sync.get(["background"], function (result) {
    let page = document.getElementsByTagName("html");
    page[0].style.background = `rgba(0,0,0,0.9) url(${
      result.background.url + `&w=${window.innerWidth}`
    }) no-repeat fixed`;
  });
};
