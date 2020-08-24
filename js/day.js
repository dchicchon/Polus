const createToday = () => {
  let todayDate = new Date();
  let dayOptions = { weekday: "short" };
  let dayDate = todayDate.toLocaleDateString();

  dayView.innerHTML = "";
  // LEVEL 1 Day View
  // Create DOM Elements\
  let dayDiv = document.createElement("div");
  let dayNav = document.createElement("div");
  let details = document.createElement("div"); // day details
  let prevBtn = document.createElement("button");
  let nextBtn = document.createElement("button");
  let dayTitle = document.createElement("h5");

  // Input dateStamp to get relevant info
  let dayInfo = (dateStamp) => {
    // LEVEL 2 Day
    // Create DOM Elements
    let detailsList = document.createElement("ul");
    let btn = document.createElement("button");

    if (dayDate === globalDate) {
      dayTitle.style.backgroundColor = "rgba(5, 80, 123, 0.992)";
    } else {
      dayTitle.style.backgroundColor = "initial";
    }

    // Get the entries to fill list
    setEntries(dateStamp, detailsList);

    // Text Content
    details.innerHTML = "";
    btn.textContent = "+";
    let dayOfWeek = todayDate.toLocaleDateString(undefined, dayOptions);
    dayTitle.textContent = `${dayOfWeek} ${dayDate}`;

    // Set Attributes
    btn.setAttribute("class", "add");
    details.addEventListener("mouseenter", () => {
      btn.style.opacity = "1";
    });
    details.addEventListener("mouseleave", () => {
      btn.style.opacity = "0";
    });

    details.setAttribute("class", "details");
    // Set Values
    btn.value = dateStamp;
    // Append
    details.appendChild(detailsList);
    details.appendChild(btn);
    addFunction();
  };

  // Event Listeners
  // ==============================
  // Previous Day
  prevBtn.addEventListener("click", function () {
    todayDate.setDate(todayDate.getDate() - 1);
    dayDate = todayDate.toLocaleDateString();
    dayInfo(dayDate);
  });

  // Next Day
  nextBtn.addEventListener("click", function () {
    todayDate.setDate(todayDate.getDate() + 1);
    dayDate = todayDate.toLocaleDateString();
    dayInfo(dayDate);
  });
  // ==============================

  // Text Content
  prevBtn.innerHTML = "&larr;";
  dayTitle.textContent = dayDate;
  nextBtn.innerHTML = "&rarr;";

  // Set Attributes

  prevBtn.setAttribute("class", "arrow");
  nextBtn.setAttribute("class", "arrow");
  dayNav.setAttribute("class", "nav");
  dayDiv.setAttribute("class", "dayDiv");
  dayTitle.setAttribute("class", "dayTitle");

  // Append
  dayNav.appendChild(prevBtn);
  dayNav.appendChild(dayTitle);
  dayNav.appendChild(nextBtn);

  dayDiv.appendChild(details);
  dayView.appendChild(dayNav);
  dayView.appendChild(dayDiv);

  dayInfo(dayDate);
};
