const startApp = () => {
  backgroundImage();
  dragFunctions();
  hideViews(views); // pass in views arr to hide different calendars depending on the stored view
  viewFunction(); // This function is to give the view buttons the ability to pick a view!
  let timer = setInterval(updateTime, 1000); // set a timer that executes the updateTime() function every second
};

startApp();
