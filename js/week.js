const createWeek = () => {
  // LEVEL 1 Week View
  weekView.innerHTML = "";

  // This will allow us to go back the days until we get Monday
  let startDate = new Date();
  while (startDate.getDay() !== 1) {
    startDate.setDate(startDate.getDate() - 1);
  }

  for (let i = 0; i <= 6; i++) {
    // Entry Variables
    let thisDate = new Date(startDate);
    thisDate.setDate(thisDate.getDate() + i);
    let date = thisDate.toLocaleDateString(); // ex: 2/20/2020 in U.S.

    // LEVEL 2 Week Day
    // Create DOM Elements
    let weekday = document.createElement("div");
    let weekDate = document.createElement("div");
    let weekTitle = document.createElement("div");
    let details = document.createElement("div");
    let detailsList = document.createElement("ul");
    let btn = document.createElement("button");

    // If week day is today
    if (globalDate === date) {
      weekDate.style.backgroundColor = "rgba(5, 80, 123, 0.992)";
    }

    setEntries(date, detailsList);

    // Text Content
    weekDate.textContent = `${thisDate.getDate()}`;
    weekTitle.textContent = `${thisDate.toLocaleDateString(undefined, {
      weekday: "long"
    })}`;
    btn.textContent = "+";

    // Set Attributes
    weekday.setAttribute("class", "weekday");
    weekDate.setAttribute("class", "weekDate");
    weekTitle.setAttribute("class", "weekTitle");
    details.setAttribute("class", "details");
    details.id = date;
    detailsList.setAttribute("class", "detailsList");
    btn.setAttribute("class", "add");

    // Set Values
    btn.value = date;

    // Append
    details.appendChild(detailsList);
    details.appendChild(btn);
    weekday.appendChild(weekDate);
    weekday.appendChild(weekTitle);
    weekday.appendChild(details);
    weekView.appendChild(weekday);
  }
  addFunction();
};
