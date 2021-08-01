import 'package:app/nav.dart';
import 'package:flutter/material.dart';
import 'entries.dart';

class HomePage extends StatefulWidget {
  const HomePage();
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  bool newEntry = false;
  DateTime date = new DateTime.now();

  // Change this date!
  void changeDate(newDate) {
    setState(() {
      date = newDate;
    });
  }

// =================================================================
// =================================================================
// move to entries.dart for modularity
  ScrollController scrollController = ScrollController();

  void newEntryState(bool active) {
    setState(() {
      newEntry = active;
    });
  }

  void addEntry() {
    setState(() {
      // entryTextController.text = '';
      this.newEntry = !this.newEntry;
    });
    scrollController.animateTo(scrollController.position.maxScrollExtent,
        duration: Duration(milliseconds: 500), curve: Curves.easeOut);
  }

// ======================================
  @override
  void didUpdateWidget(old) {
    super.didUpdateWidget(old);
    print("Home updated");
  }

  Widget build(BuildContext context) {
    return GestureDetector(
        onTap: () {
          FocusScopeNode currentFocus = FocusScope.of(context);
          if (!currentFocus.hasPrimaryFocus) {
            currentFocus.unfocus();
          }
          setState(() {
            this.newEntry = false;
          });
        },
        child: Scaffold(
          body: Column(
            children: [
              Navbar(this.changeDate, this.date, this.addEntry),
              EntriesList(this.date, this.newEntry, this.scrollController,
                  this.newEntryState),
            ],
          ),
          backgroundColor: Colors.black,
        ));
  }
}
