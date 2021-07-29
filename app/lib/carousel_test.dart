
  // void updateWeekList({bool swiped = null}) {
  //   print("UPDATE WEEK LIST");
  //   print(swiped);

// class DayContainer extends StatelessWidget {
//   final List<Day> dayList;
//   const DayContainer(this.dayList);

//   String get weekStart {
//     return dayList[0].date.toString();
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Row(
//       children: dayList,
//       mainAxisAlignment: MainAxisAlignment.spaceEvenly,
//     );
//   }
// }



  //   List<DayContainer> newWeekList = [];
  //   // This only happens once initially.
  //   if (swiped == null) {
  //     for (var i = -1; i <= 1; i++) {
  //       List<Day> week = generateWeek(i);
  //       print("Week Generated");
  //       print(week[0].date.toString());
  //       DayContainer container = DayContainer(week);
  //       newWeekList.add(container);
  //     }

  //     print("Initial Week List");
  //     for (var container in newWeekList) {
  //       print(container.weekStart);
  //     }
  //     setState(() {
  //       weekList = newWeekList;
  //     });
  //   }

  //   // Swipe to next week
  //   else if (swiped) {
  //     // Go forward a week, means we should remove the first element weekList and append a new week
  //     newWeekList = new List<DayContainer>.from(weekList);
  //     newWeekList.removeAt(0);
  //     // Now add a new week to this.
  //     List<Day> week = generateWeek(1);
  //     DayContainer container = DayContainer(week);
  //     newWeekList.add(container);
  //     setState(() {
  //       weekList = newWeekList;
  //     });
  //   }
  //   // Swipe to last week
  //   else {
  //     newWeekList = new List<DayContainer>.from(weekList);
  //     newWeekList.removeAt(2);
  //     // Now add a new week to this.
  //     List<Day> week = generateWeek(-1);
  //     DayContainer container = DayContainer(week);
  //     newWeekList.insert(0, container);
  //     setState(() {
  //       weekList = newWeekList;
  //     });
  //   }
  // }

  // void swipeWeek(int num, CarouselPageChangedReason reason) {
  //   print("SWIPE WEEK");
  //   print(num);
  //   // No indexes exist at the moment, so its changing atm
  //   DateTime thisDate;
  //   if (num == 2) {
  //     updateWeekList(swiped: true);
  //     thisDate = widget.date.add(Duration(days: 7));
  //   } else {
  //     updateWeekList(swiped: false);
  //     thisDate = widget.date.subtract(Duration(days: 7));
  //   }
  //   widget.changeDate(thisDate);
  // }


    // CarouselSlider.builder(
          //   itemCount: 3,
          //   options: CarouselOptions(
          //     onPageChanged: swipeWeek,
          //     onScrolled: scrollWeek,
          //     viewportFraction: 1.0,
          //     height: 25.0,
          //   ),
          //   itemBuilder:
          //       (BuildContext context, int itemIndex, int pageViewIndex) =>
          //           (Row(
          //     mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          //     children: generateWeekDates(), // we generate weeks through here
          //   )),
          // ),

          // CarouselSlider(
          //     items: weekList,
          //     options: CarouselOptions(
          //         height: 25.0, onPageChanged: swipeWeek, initialPage: 1)),


          

  // List<Day> generateWeek(int weekNum) {
  //   print("GENERATE WEEK $weekNum");
  //   DateTime parentDate = widget.date;
  //   List<Day> daysOfWeek = [];

  //   // Possible options are -1, 0, 1. This will determine the week that we are creating
  //   DateTime newDate = parentDate.add(Duration(days: weekNum * 7));

  //   int weekDay = newDate.weekday == 7 ? 0 : newDate.weekday;

  //   newDate = newDate
  //       .subtract(Duration(days: weekDay)); // returns Sunday as DateTime?

  //   for (var i = 0; i < 7; i++) {
  //     daysOfWeek.add(Day(
  //         newDate,
  //         widget.changeDate,
  //         newDate.day ==
  //             parentDate.day)); // pass our date as a prop to days of week
  //     newDate = newDate.add(Duration(days: 1)); // change days by 1
  //   }

  //   return daysOfWeek;
  // }
