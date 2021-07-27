import 'package:app/nav.dart';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
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
  final TextEditingController entryTextController = TextEditingController();

  void addEntry() {
    setState(() {
      entryTextController.text = '';
      this.newEntry = !this.newEntry;
    });
    scrollController.animateTo(scrollController.position.maxScrollExtent,
        duration: Duration(milliseconds: 500), curve: Curves.easeOut);
  }

  void submitEntry() {
    print("Submit Entry");
    // final uuid = Uuid();

    if (entryTextController.text != '') {
      print("Entry not empty: Submit here");
      String dateString =
          '${this.date.month}-${this.date.day}-${this.date.year}';

      CollectionReference date = FirebaseFirestore.instance
          .collection('users')
          .doc(FirebaseAuth.instance.currentUser.uid)
          .collection(dateString);

      Map<String, dynamic> entry = {
        'text': entryTextController.text,
        'active': false,
        'color': 'blue',
      };

      date
          .add(entry)
          .then((value) => print("Entry List Updated"))
          .catchError((err) => print("Failed to update list $err"));
      setState(() {
        entryTextController.text = '';
        this.newEntry = !this.newEntry;
      });
    } else {
      // Delete Entry
      print("No text in input!");
      setState(() {
        this.newEntry = !this.newEntry;
      });
    }
  }

// ======================================
  @override
  void dispose() {
    entryTextController.dispose();
    super.dispose();
  }

  Widget build(BuildContext context) {
    return Scaffold(
        body: Column(
          children: [
            Navbar(this.changeDate, this.date),
            EntriesList(this.date, this.newEntry, this.entryTextController,
                this.scrollController),
          ],
        ),
        backgroundColor: Colors.black,
        floatingActionButton: Stack(
          children: [
            Visibility(
              visible: !this.newEntry,
              child: Align(
                  alignment: Alignment.bottomRight,
                  child: FloatingActionButton(
                      onPressed: addEntry, child: Icon(Icons.add))),
            ),
            Visibility(
                visible: this.newEntry,
                child: Align(
                    alignment: Alignment.bottomRight,
                    child: FloatingActionButton(
                        onPressed: submitEntry, child: Icon(Icons.save)))),
            Visibility(
                visible: this.newEntry,
                child: Align(
                    alignment: Alignment(1, 0.75),
                    child: FloatingActionButton(
                        onPressed: addEntry, child: Icon(Icons.cancel)))),
          ],
        ));
  }
}
