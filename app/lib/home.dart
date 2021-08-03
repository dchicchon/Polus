import 'package:flutter/material.dart';
import 'entries.dart';
import 'nav.dart';
// https://stackoverflow.com/questions/53572110/flutter-push-notifications-even-if-the-app-is-closed Maybe for implementing this
import 'package:firebase_messaging/firebase_messaging.dart';

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
  void initState() {
    super.initState();

    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      print('Got a message while in the foreground!');
      print('Message data: ${message.data}');

      if (message.notification != null) {
        print('Message also contained a notification: ${message.notification}');
      }
    });
  }

  void didUpdateWidget(old) {
    super.didUpdateWidget(old);
    print("Home updated");
  }

  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Navbar(this.changeDate, this.date, this.addEntry),
          EntriesList(this.date, this.newEntry, this.scrollController,
              this.newEntryState),
        ],
      ),
      backgroundColor: Colors.black,
    );
  }
}
