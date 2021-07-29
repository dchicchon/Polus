import 'dart:async';
import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/cupertino.dart';

// =================================================================
// ENTRY LIST
class EntriesList extends StatefulWidget {
  final DateTime date;
  final bool newEntry;
  final ScrollController scrollController;
  final Function newEntryState;
  // final TextEditingController entryTextController;
  // final Function submitEntry;
  const EntriesList(
      this.date, this.newEntry, this.scrollController, this.newEntryState);

  @override
  _EntriesListState createState() => _EntriesListState();
}

// Include Add Button in this widget somehow
class _EntriesListState extends State<EntriesList> {
  Stream<QuerySnapshot> _entryStream;
  final TextEditingController entryTextController = TextEditingController();

  void submitEntry(String fieldString) {
    print("Submit Entry");

    if (entryTextController.text != '') {
      String dateString =
          '${widget.date.month}-${widget.date.day}-${widget.date.year}';

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
      });
      widget.newEntryState(false);
    } else {
      print("No text in input!");
      widget.newEntryState(false);
    }
  }

  void handleEntryMenuClick(List selected) {
    var type = selected[0];
    var entry = selected[1];
    var id = selected[2];

    switch (type) {
      case 'Delete':
        deleteEntry(entry, id);
        break;
      case 'Edit':
        editEntry(entry, id);
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

  void editEntry(entry, id) {
    print("Editing Entry");
  }

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

  List<Widget> getEntries(snapshot) {
// https://stackoverflow.com/questions/66074484/type-documentsnapshot-is-not-a-subtype-of-type-mapstring-dynamic
    print("Getting Entries");
    List<Widget> myList = []; // initalize list
    // Add items to our list if we have data. If I don't add the `toList()` method it does not work. Not sure why
    if (snapshot.data.docs.length != 0) {
      snapshot.data.docs.map((DocumentSnapshot document) {
        Map<String, dynamic> data = document.data() as Map<String, dynamic>;
        myList.add(
            Entry(data, handleEntryMenuClick, document.id, this.deleteEntry));
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
                onFieldSubmitted: this.submitEntry,
                textInputAction: TextInputAction.done,
                controller: this.entryTextController, // comes from parent
                decoration: InputDecoration(hintText: "Go for a walk..."),
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
    entryTextController.dispose();
  }

  Widget build(BuildContext context) {
    return Flexible(
        child: Container(
            child: StreamBuilder<QuerySnapshot>(
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
          physics:
              BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
        );
      },
    )));
  }
}
// =================================================================

// =================================================================
// ENTRY
class Entry extends StatefulWidget {
  final Map entry;
  final Function handleEntryMenuClick;
  final Function deleteEntry;
  final String id;

  Entry(this.entry, this.handleEntryMenuClick, this.id, this.deleteEntry);

  @override
  _EntryState createState() => _EntryState();
}

class _EntryState extends State<Entry> {
  AnimationController animation;
  Animation<double> _fadeInFadeOut;
// For picking time
// https://www.youtube.com/watch?v=aPaFalC2a28&ab_channel=JohannesMilke

  Color getColor(String color) {
    Color newColor;
    switch (color) {
      case 'blue':
        newColor = Color.fromRGBO(21, 115, 170, 0.80);
        break;
      case 'green':
        newColor = Color.fromRGBO(7, 128, 7, 0.80);
        break;
      case 'purple':
        newColor = Color.fromRGBO(122, 39, 138, 0.80);
        break;
      case 'gold':
        newColor = Color.fromRGBO(185, 174, 8, 0.80);
        break;
      case 'orange':
        newColor = Color.fromRGBO(251, 119, 5, 0.80);
        break;
      case 'red':
        newColor = Color.fromRGBO(220, 5, 5, 0.75);
        break;
    }

    return newColor;
  }

  @override
  void initState() {
    super.initState();
    animation = AnimationController(
      vsync: this,
      duration: Duration(seconds: 3),
    );
    _fadeInFadeOut = Tween<double>(begin: 0.0, end: 0.1).animate(animation);

    animation.addListener(() {
      if (animation.isCompleted) {
        animation.reverse();
      } else {
        animation.forward();
      }
    });
    animation.repeat();
  }

  void dispose() {
    super.dispose();
  }

  Widget build(BuildContext context) {
    // For each entry, I want to be able to swipe left and be able to peform
    // certain actions
    return FadeTransition(
        opacity: animation,
        child: Dismissible(
            key: ValueKey<String>(widget.id),
            onDismissed: (DismissDirection direction) {
              if (direction == DismissDirection.startToEnd) {
                // TODO swipe right to complete item
                // Function to archive checked items
              } else {
                // TODO swipe left to delete item
                widget.deleteEntry(widget.entry, widget.id);
              }
              // What to do based on direction
            },
            background: Container(
              color: Colors.green,
              child: Icon(Icons.archive, color: Colors.white, size: 30.0),
              alignment: Alignment.centerLeft,
              padding: EdgeInsets.only(left: 15.0),
            ),
            secondaryBackground: Container(
              color: Colors.red,
              child: Icon(Icons.delete, color: Colors.white, size: 30.0),
              alignment: Alignment.centerRight,
              padding: EdgeInsets.only(right: 15.0),
            ),
            child: Card(
                child: ListTile(
              title: Text(
                widget.entry['text'],
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.white,
                ),
              ),
              tileColor: getColor(widget.entry['color']),
            ))));
  }
}
// =================================================================
