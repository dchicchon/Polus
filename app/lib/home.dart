import 'package:app/settings.dart';
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter/cupertino.dart';
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
        body: Column(
          children: [
            Container(
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
            // Scrollable list of dates
            Flexible(
                child: Container(
              child: EntriesList(this.date, this.newEntry,
                  this.entryTextController, this.scrollController),
            ))
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
  Stream<QuerySnapshot> _entryStream;

  void handleEntryMenuClick(List selected) {
    var type = selected[0];
    var entry = selected[1];
    var id = selected[2];

    switch (type) {
      case 'Delete':
        deleteEntry(entry, id);
        break;
      case 'Edit':
        // user.update({});
        break;
      case 'Check':
        checkEntry(entry, id);
        break;
      case 'Color':
        colorEntry(entry, id);
        break;
    }

    // Maybe our switch statement will get what kind of edit that we are doing?
  }

  void editEntry() {}

  void updateEntries() {}

  void deleteEntry(entry, id) {
    print("Delete Entry By Id");
    String date = '${widget.date.month}-${widget.date.day}-${widget.date.year}';
    CollectionReference dateRef = FirebaseFirestore.instance
        .collection('users')
        .doc(FirebaseAuth.instance.currentUser.uid)
        .collection(date);
    dateRef
        .doc(id)
        .delete()
        .then((value) => print("Entry Deleted"))
        .catchError((error) => print("Failed to Delete Entry: $error"));
  }

  void colorEntry(entry, id) async {
    print("Change Color");

    List colorSheet = ['blue', 'green', 'red', 'orange', 'purple'];

    int index;
    // https://stackoverflow.com/questions/49874771/flutter-cupertinopicker-bottomsheet-listener-for-onclose
    await showModalBottomSheet(
        context: context,
        builder: (BuildContext context) {
          return Container(
              height: 200,
              color: Colors.white,
              child: Center(
                  child: CupertinoPicker(
                backgroundColor: Colors.white,
                onSelectedItemChanged: (value) {
                  index = value;
                },
                itemExtent: 50.0,
                children: [
                  Text("Blue", style: TextStyle(height: 2)),
                  Text("Green", style: TextStyle(height: 2)),
                  Text("Red", style: TextStyle(height: 2)),
                  Text('Orange', style: TextStyle(height: 2)),
                  Text('Purple', style: TextStyle(height: 2)),
                ],
              )));
        });

    if (entry['color'] != colorSheet[index]) {
      String date =
          '${widget.date.month}-${widget.date.day}-${widget.date.year}';
      CollectionReference dateRef = FirebaseFirestore.instance
          .collection('users')
          .doc(FirebaseAuth.instance.currentUser.uid)
          .collection(date);
      dateRef.doc(id).update({'color': colorSheet[index]});
    }
  }

  void checkEntry(entry, id) {
    String date = '${widget.date.month}-${widget.date.day}-${widget.date.year}';
    CollectionReference user = FirebaseFirestore.instance
        .collection('users')
        .doc(FirebaseAuth.instance.currentUser.uid)
        .collection(date);

    user
        .doc(id)
        .update({'active': !entry['active']})
        .then((value) => print("Entry Checked"))
        .catchError((error) => print("Failed to Check Entry: $error"));
  }

// Return List<Widget> to ListView in build
// https://stackoverflow.com/questions/66074484/type-documentsnapshot-is-not-a-subtype-of-type-mapstring-dynamic
  List<Widget> getEntries(snapshot) {
    print("Getting Entries");
    List<Widget> myList = []; // initalize list
    // Add items to our list if we have data. If I don't add the `toList()` method it does not work. Not sure why
    if (snapshot.data.docs.length != 0) {
      snapshot.data.docs.map((DocumentSnapshot document) {
        Map<String, dynamic> data = document.data() as Map<String, dynamic>;
        myList.add(Entry(data, handleEntryMenuClick, document.id));
      }).toList();
    }

    // Add in our Text Input Widget after adding all of the entries
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
                // validator: (String value) {
                //   if (value == null || value.isEmpty) {
                //     // Turn new entry off if no value is detected on submit
                //     return 'Please Enter Some text';
                //   }
                //   return '';
                // },
              ),
              tileColor: Color.fromRGBO(21, 115, 170, 0.80),
            ))));
    return myList;
  }

  void setStream() {
    print("Setting Stream");
    String dateString =
        '${widget.date.month}-${widget.date.day}-${widget.date.year}';
    _entryStream = FirebaseFirestore.instance
        .collection('users')
        .doc(FirebaseAuth.instance.currentUser.uid)
        .collection(dateString)
        .snapshots();
  }

  @override
  void initState() {
    super.initState();
    setStream();
  }

  void didUpdateWidget(old) {
    super.didUpdateWidget(old);
    // Only Set stream if EntryList Widget changed. If not, dont reset stream
    // This is important to ensure the list doesnt keep reloading. Looks bad
    // and it would create alot of get requests which we want to minimize
    if (old.date != widget.date) {
      setStream();
    }
  }

  void dispose() {
    super.dispose();
  }

  Widget build(BuildContext context) {
    return (StreamBuilder<QuerySnapshot>(
      stream: _entryStream,
      builder: (BuildContext context, AsyncSnapshot snapshot) {
        if (snapshot.hasError) {
          return Text("Something went wrong");
        }

        if (snapshot.connectionState == ConnectionState.waiting) {
          return CircularProgressIndicator();
        }
        return new ListView(
          children: getEntries(snapshot),
          padding: EdgeInsets.all(8.0),
          controller: widget.scrollController,
          shrinkWrap: true,
          physics:
              BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
        );
      },
    ));
  }
}

class Entry extends StatefulWidget {
  final Map entry;
  final Function handleEntryMenuClick;
  final String id;
  const Entry(this.entry, this.handleEntryMenuClick, this.id);

  @override
  _EntryState createState() => _EntryState();
}

class _EntryState extends State<Entry> {
// For picking time
// https://www.youtube.com/watch?v=aPaFalC2a28&ab_channel=JohannesMilke

  Color getColor(String color) {
    switch (color) {
      case 'blue':
        return Color.fromRGBO(21, 115, 170, 0.80);
      case 'green':
        return Color.fromRGBO(7, 128, 7, 0.80);
      case 'purple':
        return Color.fromRGBO(122, 39, 138, 0.80);
      case 'gold':
        return Color.fromRGBO(185, 174, 8, 0.80);
      case 'orange':
        return Color.fromRGBO(251, 119, 5, 0.80);
      case 'red':
        return Color.fromRGBO(220, 5, 5, 0.75);
    }
  }

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
            decoration: widget.entry['active']
                ? TextDecoration.lineThrough
                : TextDecoration.none),
      ),
      // Tile Color will be based on entry['color']
      trailing: PopupMenuButton(
        onSelected: widget.handleEntryMenuClick,
        itemBuilder: (BuildContext context) {
          // Also pass in item id here too
          return {'Edit', 'Delete', 'Check', 'Color'}.map((String choice) {
            return PopupMenuItem(
              child: Text(choice),
              value: [choice, widget.entry, widget.id],
            );
          }).toList();
        },
      ),
      tileColor: widget.entry['active']
          ? Colors.grey
          : getColor(widget.entry['color']),
    ));
  }
}
