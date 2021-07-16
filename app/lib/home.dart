import 'package:app/settings.dart';
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
// import 'package:uuid/uuid.dart';
import 'package:intl/intl.dart';
import 'settings.dart';

class HomePage extends StatefulWidget {
  const HomePage();

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  bool newEntry = false;
  DateTime date = new DateTime.now();
  ScrollController scrollController = ScrollController();

  // This date will change based on which date that we choose. For now, choose todays date

  final TextEditingController entryTextController = TextEditingController();

// Add an additonal entry to our database
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
      CollectionReference users =
          FirebaseFirestore.instance.collection('users');

      List<Map<String, dynamic>> entry = [
        {
          'text': entryTextController.text,
          'active': false,
          'color': 'blue',
        }
      ];

      int month = date.month;
      int day = date.day;
      int year = date.year;
      String dateString = '$month-$day-$year';

      users
          .doc(FirebaseAuth.instance.currentUser.uid)
          .update({dateString: FieldValue.arrayUnion(entry)})
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

  void changeDate(int num) {
    var newDate =
        new DateTime(this.date.year, this.date.month, this.date.day + num);
    setState(() {
      date = newDate;
    });
  }

  @override
  void dispose() {
    entryTextController.dispose();
    super.dispose();
  }

  Widget build(BuildContext context) {
    return Scaffold(
        body: Stack(children: [
          Container(
              height: 40.0,
              // Leave margin here for top bar
              color: Colors.grey[900],
              padding: EdgeInsets.fromLTRB(10.0, 20.0, 10.0, 5.0),
              child: (Column(children: [
                Row(
                  children: [
                    Image(
                        height: 30.0,
                        image: AssetImage('assets/polus_icon48.png')),
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
                Row(
                  children: [
                    ElevatedButton(
                        onPressed: () {
                          changeDate(-1);
                        },
                        style: ElevatedButton.styleFrom(
                          primary: Color.fromRGBO(21, 115, 170, 0.80),
                        ),
                        child: Icon(Icons.arrow_left)),
                    Spacer(),
                    ElevatedButton(
                        onPressed: () {
                          changeDate(1);
                        },
                        style: ElevatedButton.styleFrom(
                          primary: Color.fromRGBO(21, 115, 170, 0.80),
                        ),
                        child: Icon(Icons.arrow_right))
                  ],
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(DateFormat.yMMMMEEEEd().format(this.date),
                        style: TextStyle(color: Colors.white)),
                  ],
                )
              ]))),
          Container(
            child: EntriesList(this.date, this.newEntry,
                this.entryTextController, this.scrollController),
          )
        ]),
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

class EntriesList extends StatefulWidget {
  final DateTime date;
  final bool newEntry;
  final ScrollController scrollController;
  final TextEditingController entryTextController;
  const EntriesList(this.date, this.newEntry, this.entryTextController,
      this.scrollController);

  @override
  _EntriesListState createState() => _EntriesListState();
}

class _EntriesListState extends State<EntriesList> {
  final Stream _entryStream = FirebaseFirestore.instance
      .collection('users')
      .doc(FirebaseAuth.instance.currentUser.uid)
      .snapshots();

  void handleEntryMenuClick(List selected) {
    int month = widget.date.month;
    int day = widget.date.day;
    int year = widget.date.year;
    String dateString = '$month-$day-$year';
    DocumentReference user = FirebaseFirestore.instance
        .collection('users')
        .doc(FirebaseAuth.instance.currentUser.uid);
    switch (selected[0]) {
      case 'Delete':
        user.update({
          dateString: FieldValue.arrayRemove([selected[1]])
        });
        break;
      case 'Edit':
        break;
      case 'Check':
        break;
      case 'Color':
        break;
    }
  }

// https://stackoverflow.com/questions/66074484/type-documentsnapshot-is-not-a-subtype-of-type-mapstring-dynamic
  List<Widget> getEntries(snapshot) {
    print("Get Entries");

    String dateString =
        '${widget.date.month}-${widget.date.day}-${widget.date.year}';

    Map<String, dynamic> myMap =
        Map<String, dynamic>.from(snapshot.data.data());
    List<Widget> myList;

    if (myMap.containsKey(dateString)) {
      List entryList = snapshot.data.data()[dateString];
      // If not empty, return a list of ListTiles widgets with the data we got
      myList = entryList.map<Widget>((entry) {
        return Entry(entry, handleEntryMenuClick);
      }).toList();

      // What about if we add space additonally after the input?

// This might be a solution to the keyboard margin
// https://stackoverflow.com/questions/59197602/keyboard-not-being-detected-mediaquery-ofcontext-viewinsets-bottom-always-ret
      myList.add(Visibility(
          visible: widget.newEntry,
          child: Card(
              margin: widget.newEntry
                  ? EdgeInsets.fromLTRB(
                      0,
                      0,
                      0,
                      MediaQuery.of(context)
                          .viewInsets
                          .bottom) // maybe input the Height of Keyboard instead Here
                  : EdgeInsets.fromLTRB(0, 0, 0, 0),
              child: ListTile(
                title: TextFormField(
                  style: TextStyle(color: Colors.white),
                  autofocus: true,
                  controller: widget.entryTextController, // comes from parent
                  decoration: InputDecoration(hintText: "Go for a walk..."),
                  validator: (String value) {
                    if (value == null || value.isEmpty) {
                      // Turn new entry off if no value is detected on submit
                      return 'Please Enter Some text';
                    }
                    return '';
                  },
                ),
                tileColor: Color.fromRGBO(21, 115, 170, 0.80),
              ))));

// Instead of placeholder, use margin? not sure
      // myList.add(Visibility(
      //     visible: widget.newEntry,
      //     child: Opacity(
      //         opacity: 0.0,
      //         child: Placeholder(
      //           fallbackHeight: MediaQuery.of(context)
      //               .viewInsets
      //               .bottom, // height of keyboard
      //         ))));
    } else {
      print("Snapshot data null, make up own list");
      myList = [
        Visibility(
            visible: widget.newEntry,
            child: Card(
                child: ListTile(
              title: TextFormField(
                style: TextStyle(color: Colors.white),
                autofocus: true,
                controller: widget.entryTextController, // comes from parent
                decoration: InputDecoration(hintText: "Go for a walk..."),
                validator: (String value) {
                  if (value == null || value.isEmpty) {
                    // Turn new entry off if no value is detected on submit
                    return 'Please Enter Some text';
                  }
                  return '';
                },
              ),
              tileColor: Color.fromRGBO(21, 115, 170, 0.80),
            ))),
        Visibility(
            visible: widget.newEntry,
            child: Opacity(
                opacity: 0.0,
                child: Placeholder(
                  fallbackHeight: MediaQuery.of(context).viewInsets.bottom,
                )))
      ];
    }
    return myList;
  }

  @override
  Widget build(BuildContext context) {
    return (StreamBuilder(
      stream: _entryStream,
      builder: (BuildContext context, AsyncSnapshot snapshot) {
        if (snapshot.hasError) {
          return Text("Something went wrong");
        }

        if (snapshot.connectionState == ConnectionState.waiting) {
          return CircularProgressIndicator();
        }
        return ListView(
          children: getEntries(snapshot),
          padding: EdgeInsets.all(8.0),
          controller: widget.scrollController,
          shrinkWrap: true,
          // reverse: true,

          // physics:
          //     BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
        );
      },
    ));
  }
}

class Entry extends StatefulWidget {
  final Map entry;
  final Function handleEntryMenuClick;
  const Entry(this.entry, this.handleEntryMenuClick);

  @override
  _EntryState createState() => _EntryState();
}

class _EntryState extends State<Entry> {
// For picking time
// https://www.youtube.com/watch?v=aPaFalC2a28&ab_channel=JohannesMilke

  @override
  Widget build(BuildContext context) {
    // For each entry, I want to be able to swipe left and be able to peform
    // certain actions
    return Card(
        child: ListTile(
      title: Text(
        widget.entry['text'],
        style: TextStyle(
          color: Colors.white,
        ),
      ),
      // Tile Color will be based on entry['color']
      trailing: PopupMenuButton(
        onSelected: widget.handleEntryMenuClick,
        itemBuilder: (BuildContext context) {
          // Also pass in item id here too
          return {'Edit', 'Delete', 'Check', 'Color'}.map((String choice) {
            return PopupMenuItem(
              child: Text(choice),
              value: [choice, widget.entry],
            );
          }).toList();
        },
      ),
      tileColor: Color.fromRGBO(21, 115, 170, 0.80),
    ));
  }
}
