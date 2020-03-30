const createToday = () => {
  let todayDate = new Date();
  let dayYear = todayDate.getFullYear();
  let dayMonth = todayDate.getMonth() + 1;
  let dayDay = todayDate.getDate();
  let dayDate = `${dayMonth}/${dayDay}/${dayYear}`;
  dayView.innerHTML = "";
  // LEVEL 1 Day View
  // Create DOM Elements
  let dayNav = document.createElement("div");
  let details = document.createElement("div"); // day details
  let prevBtn = document.createElement("button");
  let nextBtn = document.createElement("button");
  let dayTitle = document.createElement("h5");

  // let currentDate = new Date();

  let dayInfo = dateStamp => {
    // LEVEL 2 Day
    // Create DOM Elements
    let detailsList = document.createElement("ul");
    let btn = document.createElement("button");

    if (dayDate === globalDate) {
      dayTitle.style.backgroundColor = "rgba(5, 80, 123, 0.992)";
    } else {
      dayTitle.style.backgroundColor = "initial";
    }

    setEntries(dateStamp, detailsList);
    // Text Content
    details.innerHTML = "";
    btn.textContent = "+";
    dayTitle.textContent = dayDate;

    // Set Attributes
    btn.setAttribute("class", "add");
    details.setAttribute("class", "details");
    // Set Values
    btn.value = dateStamp;
    // Append
    details.appendChild(detailsList);
    details.appendChild(btn);
    addFunction();
  };

  // Event Listeners
  prevBtn.addEventListener("click", function() {
    todayDate.setDate(todayDate.getDate() - 1);
    dayYear = todayDate.getFullYear();
    dayMonth = todayDate.getMonth() + 1;
    dayDay = todayDate.getDate();
    dayDate = `${dayMonth}/${dayDay}/${dayYear}`;
    dayInfo(dayDate);
  });

  nextBtn.addEventListener("click", function() {
    todayDate.setDate(todayDate.getDate() + 1);
    dayYear = todayDate.getFullYear();
    dayMonth = todayDate.getMonth() + 1;
    dayDay = todayDate.getDate();
    dayDate = `${dayMonth}/${dayDay}/${dayYear}`;
    dayInfo(dayDate);
  });

  // Text Content
  prevBtn.innerHTML = "&larr;";

  dayTitle.textContent = dayDate;
  nextBtn.innerHTML = "&rarr;";

  // Set Attributes

  prevBtn.setAttribute("class", "arrow");
  nextBtn.setAttribute("class", "arrow");
  dayNav.setAttribute("class", "nav");
  dayTitle.setAttribute("class", "dayTitle");

  // Append
  dayNav.appendChild(prevBtn);
  dayNav.appendChild(dayTitle);
  dayNav.appendChild(nextBtn);
  dayView.appendChild(dayNav);
  dayView.appendChild(details);

  dayInfo(dayDate);
};
