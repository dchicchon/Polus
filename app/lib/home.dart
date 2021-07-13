import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:uuid/uuid.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key key}) : super(key: key);

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  bool newEntry = false;
  DateTime date = new DateTime.now();

  // This date will change based on which date that we choose. For now, choose todays date

  final TextEditingController entryTextController = TextEditingController();

// Add an additonal entry to our database
  void addEntry() {
    setState(() {
      entryTextController.text = '';
      this.newEntry = !this.newEntry;
    });
  }

  void submitEntry() {
    print("Submit Entry");
    final uuid = Uuid();

    if (entryTextController.text != '') {
      CollectionReference users =
          FirebaseFirestore.instance.collection('users');

      List<Map<String, dynamic>> entry = [
        {
          'text': entryTextController.text,
          'active': false,
          'color': 'blue',
          'key': uuid.v4().substring(0, 9)
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
      print("No text in input!");
    }
  }

  void handleMenuClick(String value) {
    // https://stackoverflow.com/questions/58144948/easiest-way-to-add-3-dot-pop-up-menu-appbar-in-flutter
    switch (value) {
      case 'Logout':
        FirebaseAuth.instance.signOut();
        break;
      case 'Settings':
        print("Settings");
        break;
    }
  }

  @override
  void dispose() {
    entryTextController.dispose();
    super.dispose();
  }

  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          automaticallyImplyLeading: false,
          title: Text("Polus"),
          actions: [
            PopupMenuButton<String>(
                onSelected: handleMenuClick,
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
        body: Column(
          children: [
            // ListView(
            //   children: [
            //     Container(
            //         height: 80,
            //         child: ListView(
            //           scrollDirection: Axis.horizontal,
            //           children: List.generate(3, (int index) {
            //             return Card(
            //               color: Colors.blue,
            //               child: Container(
            //                 width: 50,
            //                 height: 50,
            //                 child: Text("$index"),
            //               ),
            //             );
            //           }),
            //         ))
            //   ],
            // ),
            EntriesList(this.date),
            Visibility(
                visible: this.newEntry,
                child: ListTile(
                    title: TextFormField(
                  autofocus: true,
                  controller: entryTextController,
                  decoration: InputDecoration(hintText: "Go for a walk..."),
                  validator: (String value) {
                    if (value == null || value.isEmpty) {
                      // Turn new entry off if no value is detected on submit
                      return 'Please Enter Some text';
                    }
                    return '';
                  },
                )))
          ],
        ),
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
        )
        // FloatingActionButton(
        //     onPressed: addEntry, tooltip: 'Increment', child: Icon(Icons.add)),
        );
  }
}

class EntriesList extends StatefulWidget {
  final DateTime date;

  const EntriesList(this.date);

  @override
  _EntriesListState createState() => _EntriesListState();
}

class _EntriesListState extends State<EntriesList> {
  final Stream _entryStream = FirebaseFirestore.instance
      .collection('users')
      .doc(FirebaseAuth.instance.currentUser.uid)
      .snapshots();

  // List currentEntries = [];

  void handleEntryMenuClick(List selected) {
    print(selected);
    switch (selected[0]) {
      case 'Delete':
        int month = widget.date.month;
        int day = widget.date.day;
        int year = widget.date.year;
        String dateString = '$month-$day-$year';

        FirebaseFirestore.instance
            .collection('users')
            .doc(FirebaseAuth.instance.currentUser.uid)
            .update({dateString: FieldValue.arrayRemove(selected[1])});

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
    int month = widget.date.month;
    int day = widget.date.day;
    int year = widget.date.year;
    String dateString = '$month-$day-$year';

    Map<String, dynamic> myMap =
        Map<String, dynamic>.from(snapshot.data.data());
    // Our entry list based on datestamp
    print("EntryList");
    // Check if data is empty
    List<Widget> myList;

    if (myMap.containsKey(dateString)) {
      List entryList = snapshot.data.data()[dateString];
      // If not empty, return a list of ListTiles widgets with the data we got
      myList = entryList.map<Widget>((entry) {
        return Card(
            child: ListTile(
          title: Text(
            entry['text'],
            style: TextStyle(color: Colors.white),
          ),
          // Tile Color will be based on entry['color']
          trailing: PopupMenuButton(
            onSelected: handleEntryMenuClick,
            itemBuilder: (BuildContext context) {
              // Also pass in item id here too
              return {'Edit', 'Delete', 'Check', 'Color'}.map((String choice) {
                return PopupMenuItem(
                  child: Text(choice),
                  value: [choice, entry['text']],
                );
              }).toList();
            },
          ),
          tileColor: Color.fromRGBO(21, 115, 170, 0.80),
        ));
      }).toList();
    } else {
      print("Snapshot data null, make up own list");
      myList = [Placeholder()];
    }
    return myList;
  }

  @override
  Widget build(BuildContext context) {
    return StreamBuilder(
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
          shrinkWrap: true,
        );
      },
    );
  }
}
