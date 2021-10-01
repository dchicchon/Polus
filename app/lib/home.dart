import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'entries.dart';
import 'nav.dart';
// https://stackoverflow.com/questions/53572110/flutter-push-notifications-even-if-the-app-is-closed Maybe for implementing this
import 'package:firebase_auth/firebase_auth.dart';
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

  Future<void> saveTokenToDatebase(String token) async {}

  /// adding a token to our 
  Future<void> saveToken([String newToken]) async {
    String token = await FirebaseMessaging.instance.getToken();
    String userId = FirebaseAuth.instance.currentUser.uid;
    await FirebaseFirestore.instance.collection('users').doc(userId).update({
      'tokens': FieldValue.arrayUnion([token])
    });
  }

// ======================================
  @override
  void initState() {
    super.initState();
    // Listen for any new messages
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      print('Got a message while in the foreground!');
      print('Message data: ${message.notification}');
      if (message.notification != null) {
        print(message.notification.title);
        print(message.notification.body);
      }
    });
    // Get the token each time the application loads
    saveToken();
    // Any time the token refreshes, store this in the database too.
    FirebaseMessaging.instance.onTokenRefresh.listen(saveToken);
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
