import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'settings.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:carousel_slider/carousel_slider.dart';

class Navbar extends StatefulWidget {
  final Function changeDate;
  final DateTime date;
  final Function addEntry;
  const Navbar(this.changeDate, this.date, this.addEntry);

  @override
  _NavbarState createState() => _NavbarState();
}

class _NavbarState extends State<Navbar> {
  // List<Widget> dates = [];
  bool swipeDir = false;
  double scrollNum = 10000.0;
  void handleMenuClick(String value) {
    // https://stackoverflow.com/questions/58144948/easiest-way-to-add-3-dot-pop-up-menu-appbar-in-flutter
    switch (value) {
      case 'Log Out':
        FirebaseAuth.instance.signOut();
        break;
      case 'Settings':
        Navigator.push(
            context, MaterialPageRoute(builder: (context) => Settings()));
        break;
    }
  }

// Optimize this later. Right now this code is rerunning every single time

  List<Widget> generateWeekDates() {
    // print("GENERATE WEEK DATES");
    DateTime parentDate = widget.date;
    List<Day> daysOfWeek = [];

    // Based on this date, we should get all the dates associated with this week
    int weekDay = parentDate.weekday == 7 ? 0 : parentDate.weekday;

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

  void swipeWeek(int num, CarouselPageChangedReason reason) {
    // print("SWIPE WEEK");
    DateTime thisDate;
    if (swipeDir) {
      thisDate = widget.date.add(Duration(days: 7));
    } else {
      thisDate = widget.date.subtract(Duration(days: 7));
    }
    widget.changeDate(thisDate);
    // Change numbers here
  }

  void scrollWeek(double num) {
    // print("SCROLL WEEK");
    bool scrollBool = num < scrollNum ? false : true;
    setState(() {
      scrollNum = num;
      swipeDir = scrollBool;
    });
  }

  @override
  void initState() {
    super.initState();
  }

  Widget build(BuildContext context) {
    return Container(
        color: Theme.of(context).primaryColorDark,
        padding: EdgeInsets.fromLTRB(15.0, 20.0, 10.0, 5.0),
        child: (Column(children: [
          Row(
            children: [
              Spacer(flex: 2),
              Spacer(flex: 1),
              InkWell(
                onTap: () {
                  widget.changeDate(DateTime.now());
                },
                child: Image(
                    height: 30.0, image: AssetImage('assets/polus_icon48.png')),
              ),
              Spacer(flex: 2),
              GestureDetector(
                onTap: widget.addEntry,
                child: Icon(Icons.add, color: Colors.white),
              ),
              PopupMenuButton<String>(
                  onSelected: handleMenuClick,
                  icon: Icon(Icons.more_vert, color: Colors.white),
                  itemBuilder: (BuildContext context) {
                    return {'Settings', 'Log Out'}.map((String choice) {
                      return PopupMenuItem<String>(
                        value: choice,
                        child: Text(choice),
                      );
                    }).toList();
                  }),
            ],
          ),
          CarouselSlider.builder(
            itemCount: 1,
            options: CarouselOptions(
              onPageChanged: swipeWeek,
              onScrolled: scrollWeek,
              viewportFraction: 1.0,
              height: 25.0,
            ),
            itemBuilder:
                (BuildContext context, int itemIndex, int pageViewIndex) =>
                    (Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: generateWeekDates(),
            )),
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

  Color containerBackgroundColor() {
    if (selected &&
        date.day == DateTime.now().day &&
        date.month == DateTime.now().month &&
        date.year == DateTime.now().year) {
      return Color.fromRGBO(0, 143, 200, 1.0);
    } else if (selected) {
      return Colors.white;
    } else {
      return Colors.transparent;
    }
  }

  TextStyle dayTextStyle() {
    if (selected &&
        date.day == DateTime.now().day &&
        date.month == DateTime.now().month &&
        date.year == DateTime.now().year) {
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
      return TextStyle(color: Color.fromRGBO(0, 143, 255, 1.0));
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
                color: containerBackgroundColor(), shape: BoxShape.circle),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(date.day.toString(), style: dayTextStyle()),
              ],
            )));
  }
}
