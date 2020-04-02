const createMonth = () => {
  monthView.innerHTML = "";
  let monthDate = new Date();

  // LEVEL 1 Month View
  // Create DOM Elements
  let monthNav = document.createElement("div"); // container of the nav
  let monthDays = document.createElement("div"); // container for the month days
  let prevBtn = document.createElement("button"); // previous button
  let nextBtn = document.createElement("button"); // next button
  let monthTitle = document.createElement("h4"); // title

  // =============================================

  // This will generate all the days for a month and all the associated notes
  let createDaysInMonth = dateObj => {
    let options = { month: "long", year: "numeric" };
    let title = dateObj.toLocaleDateString(undefined, options);
    monthDays.innerHTML = "";

    if (dateObj.getMonth() === currentDate.getMonth()) {
      monthTitle.style.backgroundColor = "rgba(5, 80, 123, 0.992)";
      monthTitle.style.borderRadius = '75px'
    } else {
      monthTitle.style.backgroundColor = "initial";
    }
    monthTitle.textContent = title;

    let daysInMonth = new Date(
      dateObj.getFullYear(),
      dateObj.getMonth() + 1,
      0
    ).getDate();

    // This is how we create each individual day. But we want to start with Monday!
    for (let i = 0; i < daysInMonth; i++) {
      let dayDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), i + 1), // ex. 1/20/20
        date = dayDate.toLocaleDateString();
      // day = dayDate.getDate(),

      // LEVEL 2 DAY
      // Create DOM Elements
      let monthDay = document.createElement("div");
      let monthDayTitle = document.createElement("h3");
      let monthDetails = document.createElement("div");
      let monthDetailsList = document.createElement("ul");
      let btn = document.createElement("button");

      // Gets storage items and creates an li element for each item
      setEntries(date, monthDetailsList);

      if (date === globalDate) {
        monthDayTitle.style.backgroundColor = "rgba(5, 80, 123, 0.992)";
      }

      // Set Attributes
      monthDetails.setAttribute("class", "monthDetails");
      monthDetails.id = date;
      monthDay.setAttribute("class", "monthDay");
      monthDayTitle.setAttribute("class", "monthDayTitle");
      btn.setAttribute("class", "add");

      // Text Content
      // monthDay.textContent = `${day} ${weekdays[dayDate.getUTCDay()]}`;
      let dayOptions = { day: "numeric", weekday: "long" };
      monthDayTitle.textContent = dayDate.toLocaleDateString(
        undefined,
        dayOptions
      );

      btn.textContent = "+";

      // Set Values
      btn.value = date;

      // Append
      monthDays.appendChild(monthDay);
      monthDetails.appendChild(monthDetailsList);
      monthDay.appendChild(monthDayTitle);
      monthDay.appendChild(monthDetails);
      monthDetails.appendChild(btn);
    }
    addFunction();
  };

  // Text Content
  prevBtn.innerHTML = "&larr;";
  nextBtn.innerHTML = "&rarr;";

  // Set attributes
  prevBtn.setAttribute("class", "arrow");
  nextBtn.setAttribute("class", "arrow");
  monthTitle.setAttribute("class", "title");
  monthNav.setAttribute("class", "nav");
  monthDays.setAttribute("class", "monthDays");
  monthDays.style.width = "98%";
  monthDays.style.margin = "0 auto";

  // Event Listeners

  // Previous Month
  prevBtn.addEventListener("click", function() {
    monthDate.setMonth(monthDate.getMonth() - 1);
    createDaysInMonth(monthDate);
  });

  // Next Month
  nextBtn.addEventListener("click", function() {
    monthDate.setMonth(monthDate.getMonth() + 1);
    createDaysInMonth(monthDate);
  });

  // Append
  // ===============================
  // Nav
  monthNav.appendChild(prevBtn);
  monthNav.appendChild(monthTitle);
  monthNav.appendChild(nextBtn);
  // View
  monthView.appendChild(monthNav);
  monthView.appendChild(monthDays);
  createDaysInMonth(monthDate);
  // ===============================
};
