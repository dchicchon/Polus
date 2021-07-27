import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'settings.dart';
import 'package:firebase_auth/firebase_auth.dart';

class Navbar extends StatefulWidget {
  final Function changeDate;
  final DateTime date;
  const Navbar(this.changeDate, this.date);

  @override
  _NavbarState createState() => _NavbarState();
}

class _NavbarState extends State<Navbar> {
  List<Widget> dates = [];

  void handleMenuClick(String value) {
    // https://stackoverflow.com/questions/58144948/easiest-way-to-add-3-dot-pop-up-menu-appbar-in-flutter
    switch (value) {
      case 'Logout':
        FirebaseAuth.instance.signOut();
        break;
      case 'Settings':
        Navigator.push(
            context, MaterialPageRoute(builder: (context) => SettingsPage()));
        break;
    }
  }

// Optimize this later. Right now this code is rerunning every single time
  List<Widget> generateWeekDates() {
    print("Generating dates");
    // RETURN A LIST OF WIDGETS THAT REPRESENTS A WEEK
    // Each of these should be clickable to go to that date

    DateTime parentDate = widget.date;
    List<Widget> daysOfWeek = [];

    // Based on this date, we should get all the dates associated with this week
    int weekDay = parentDate.weekday;
    if (weekDay == 7) {
      weekDay = 0;
    }
    DateTime newDate = parentDate
        .subtract(Duration(days: weekDay)); // returns Sunday as DateTime?

    for (var i = 0; i < 7; i++) {
      daysOfWeek.add(Day(
          newDate,
          widget.changeDate,
          newDate.day ==
              parentDate.day)); // pass our date as a prop to days of week
      newDate = newDate.add(Duration(days: 1)); // change days by 1
    }

    // DateList should be a list of all of our qualifying dates
    return daysOfWeek;
  }

  void swipeWeek(details) {
    print(details);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
        // Leave margin here for top bar
        color: Colors.grey[900],
        padding: EdgeInsets.fromLTRB(10.0, 20.0, 10.0, 5.0),
        child: (Column(children: [
          Row(
            children: [
              // Image(height: 30.0, image: AssetImage('assets/polus_icon48.png')),
              Spacer(),
              PopupMenuButton<String>(
                  onSelected: handleMenuClick,
                  icon: Icon(Icons.more_vert, color: Colors.white),
                  itemBuilder: (BuildContext context) {
                    return {'Logout', 'Settings'}.map((String choice) {
                      return PopupMenuItem<String>(
                        value: choice,
                        child: Text(choice),
                      );
                    }).toList();
                  }),
            ],
          ),
          GestureDetector(
            onHorizontalDragStart: swipeWeek,
            child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                // Make this into a swipable element that generates days and whatnot
                children: generateWeekDates()),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(DateFormat.yMMMMEEEEd().format(widget.date),
                  style: TextStyle(color: Colors.white)),
            ],
          )
        ])));
  }
}

class Day extends StatelessWidget {
  final DateTime date;
  final bool selected;
  final Function changeDate;
  const Day(this.date, this.changeDate, this.selected);

  Color ContainerBackgroundColor() {
    if (selected && date.day == DateTime.now().day) {
      return Colors.red;
    } else if (selected) {
      return Colors.white;
    } else {
      return Colors.transparent;
    }
  }

  TextStyle DayTextStyle() {
    if (selected && date.day == DateTime.now().day) {
      return TextStyle(
        color: Colors.white,
        // backgroundColor: Colors.red,
      );
    } else if (selected) {
      return TextStyle(
        color: Colors.black,
        // backgroundColor: Colors.white
      );
    } else if (date.day == DateTime.now().day) {
      return TextStyle(color: Colors.red);
    } else {
      return TextStyle(color: Colors.white);
    }
  }

  void selectDay() {
    if (!selected) changeDate(date);
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
        onTap: selectDay,
        child: Container(
            height: 22.0,
            width: 22.0,
            decoration: BoxDecoration(
                color: ContainerBackgroundColor(), shape: BoxShape.circle),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(date.day.toString(), style: DayTextStyle()),
              ],
            )));
  }
}
