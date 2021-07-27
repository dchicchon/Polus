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

  void generateWeekDates() {
    print("Generating dates");
    // RETURN A LIST OF WIDGETS THAT REPRESENTS A WEEK
    // Each of these should be clickable to go to that date

    DateTime parentDate = widget.date;
    List<Widget> daysOfWeek = [];

    // Based on this date, we should get all the dates associated with this week
    int weekDay = parentDate.weekday;
    DateTime newDate = parentDate
        .subtract(Duration(days: weekDay)); // returns Sunday as DateTime?

    for (var i = 0; i < 7; i++) {
      if (newDate.day == DateTime.now().day) {
        daysOfWeek.add(Day(newDate, widget.changeDate, true));
      } else {
        daysOfWeek.add(Day(newDate, widget.changeDate,
            false)); // pass our date as a prop to days of week
      }
      newDate = newDate.add(Duration(days: 1)); // change days by 1
    }

    // DateList should be a list of all of our qualifying dates
    setState(() {
      dates = daysOfWeek;
    });
  }

  @override
  void initState() {
    super.initState();
    generateWeekDates();
  }

  void didUpdateWidget(old) {
    super.didUpdateWidget(old);
    // print(old); // this is navbar
    // Only re-render this week widget is swiped, otherwise do not re-render
  }

  void dispose() {
    super.dispose();
  }

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
            child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                // Make this into a swipable element that generates days and whatnot
                children: dates),
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
  final Function changeDate;
  final bool currentDate;
  const Day(this.date, this.changeDate, this.currentDate);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        print("Changing date to:");
        print(date);
        changeDate(date);
        // Change the date to this one
      },
      child: Text(
        date.day.toString(),
        style: TextStyle(color: currentDate ? Colors.red : Colors.white),
      ),
    );
  }
}
