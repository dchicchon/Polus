import 'dart:async';
import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/cupertino.dart';
import 'entry.dart';
import 'types/types.dart';

// =================================================================
// ENTRY LIST
class EntriesList extends StatefulWidget {
  final DateTime date;
  final bool newEntry;
  final ScrollController scrollController;
  final Function newEntryState;
  const EntriesList(
      this.date, this.newEntry, this.scrollController, this.newEntryState);

  @override
  _EntriesListState createState() => _EntriesListState();
}

// Include Add Button in this widget somehow
class _EntriesListState extends State<EntriesList> {
  Stream<QuerySnapshot> _entryStream;
  final TextEditingController entryTextController = TextEditingController();

// Any CRUD function should trigger the update function
// Only finish this function if we know that the user is currently using the desktop version
  void triggerUpdateForDesktop(date) async {
    // here, check if the update property is true, if not. set it to true
    DocumentReference userRef = FirebaseFirestore.instance
        .collection('users')
        .doc(FirebaseAuth.instance.currentUser.uid);

    var updateValue = await userRef.get();
    // print("Getting Update Value here");
    // print(updateValue.data());
    UserDocument userData = UserDocument.fromJson(updateValue.data());
    // if false, make this into something else
    // if date already in userData.update then skip over it

// If it doesnt contain it, then lets check
    if (!(userData.update.contains(date))) {
      userData.update.add(date);
      userRef
          .update({'update': FieldValue.arrayUnion(userData.update)})
          .then((result) => print("Update List updated"))
          .catchError((error) => print("An error happened: $error"));
    }
  }

  /// Submits a new entry to add to our EntryList list.
  void submitEntry(String fieldString) {
    if (entryTextController.text != '') {
      String dateString =
          '${widget.date.month}-${widget.date.day}-${widget.date.year}';
      // this might not work? idk we should change it for the extension version

      CollectionReference dateCollection = FirebaseFirestore.instance
          .collection('users')
          .doc(FirebaseAuth.instance.currentUser.uid)
          .collection(dateString);

      Map<String, dynamic> entry = {
        'text': entryTextController.text,
        'active': false,
        'color': 'blue',
      };
      dateCollection.add(entry).then((value) {
        print("Entry List Updated");
        this.triggerUpdateForDesktop(dateString);
      }).catchError((err) => print("Failed to update list $err"));

      setState(() {
        entryTextController.text = '';
      });
      widget.newEntryState(false);
    } else {
      print("No text in input!");
      widget.newEntryState(false);
    }
  }

  void deleteEntry(entry, id) {
    print("Delete Entry By Id");
    String date = '${widget.date.month}-${widget.date.day}-${widget.date.year}';
    CollectionReference dateRef = FirebaseFirestore.instance
        .collection('users')
        .doc(FirebaseAuth.instance.currentUser.uid)
        .collection(date);
    dateRef.doc(id).delete().then((value) {
      print("Entry Deleted");
      this.triggerUpdateForDesktop(date);
    }).catchError((error) => print("Failed to Delete Entry: $error"));
  }

  void updateEntry(entry, id) {
    String date = '${widget.date.month}-${widget.date.day}-${widget.date.year}';
    CollectionReference dateRef = FirebaseFirestore.instance
        .collection('users')
        .doc(FirebaseAuth.instance.currentUser.uid)
        .collection(date);
    dateRef.doc(id).update(entry).then((value) {
      print("Entry Updated");
      this.triggerUpdateForDesktop(date);
    }).catchError((error) => print("Failed to Delete Entry: $error"));
  }

  List<Widget> getEntries(snapshot) {
// https://stackoverflow.com/questions/66074484/type-documentsnapshot-is-not-a-subtype-of-type-mapstring-dynamic
    print("Getting Entries");
    List<Widget> myList = []; // initalize list
    // Add items to our list if we have data. If I don't add the `toList()` method it does not work. Not sure why
    if (snapshot.data.docs.length != 0) {
      snapshot.data.docs.map((DocumentSnapshot document) {
        Map<String, dynamic> data = document.data() as Map<String, dynamic>;
        myList.add(Entry(
          data,
          widget.date,
          document.id,
          this.deleteEntry,
          this.updateEntry,
        ));
      }).toList();
    }

    // Add in our Text Input Widget after adding all of the entries
    // https://stackoverflow.com/questions/59197602/keyboard-not-being-detected-mediaquery-ofcontext-viewinsets-bottom-always-ret

// Maybe in the future, when we add an entry, we can just make one automatically rather than this
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
                // decoration: InputDecoration(hintText: "Go for a walk..."),
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
