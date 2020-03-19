const startApp = () => {
  chrome.storage.sync.get(["background"], function(result) {
    chrome.topSites.get(addSites); // add topsites
    let page = document.getElementsByTagName("html");
    // &auto=format
    // &w=1500&dpi=1
    // console.log(result.background.url);
    page[0].style.background = `rgba(0,0,0,0.9) url(${result.background.url +
      `&w=${window.innerWidth}&dpi=2`}) no-repeat center center fixed`;
    page[0].style.backgroundSize = `cover`;

    let backgroundInfo = document.getElementById("background-info");
    let backgroundLocation = document.getElementById("background-location");
    let backgroundSource = document.getElementById("background-source");
    let backgroundLink = document.getElementById("background-link");
    backgroundLink.setAttribute("href", result.background.authorLink);
    if (result.background.location) {
      backgroundLocation.textContent = result.background.location;
    } else {
      backgroundLocation.textContent = "Unknown";
    }

    if (result.background.author) {
      backgroundLink.textContent = result.background.author;
    } else {
      backgroundLocation.textContent = "Unknown Author";
    }

    backgroundInfo.addEventListener("mouseover", () => {
      backgroundLocation.style.opacity = 0;
      backgroundSource.style.opacity = 0.5;
    });

    backgroundInfo.addEventListener("mouseleave", () => {
      backgroundLocation.style.opacity = 0.5;
      backgroundSource.style.opacity = 0;
    });

    hideViews(views); // pass in views arr to hide different calendars depending on the stored view
    viewFunction(); // This function is to give the view buttons the ability to pick a view!
    let timer = setInterval(updateTime, 1000); // set a timer that executes the updateTime() function every second
  });
};

startApp();
