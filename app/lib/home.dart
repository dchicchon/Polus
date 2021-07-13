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
          title: const Text("Polus"),
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
            EntriesList(this.date),
            Visibility(
                visible: this.newEntry,
                child: ListTile(
                    title: TextFormField(
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

// https://stackoverflow.com/questions/66074484/type-documentsnapshot-is-not-a-subtype-of-type-mapstring-dynamic
  List<Widget> getEntries(snapshot) {
    print("Get Entries");
    int month = widget.date.month;
    int day = widget.date.day;
    int year = widget.date.year;

    String dateString = '$month-$day-$year';

    // Our entry list based on datestamp
    print("Snapshot Data");
    print(snapshot.data);
    List entryList = snapshot.data.data()[dateString];
    print("EntryList");
    print(entryList);
    // Check if data is empty
    if (entryList == null) {
      List myList = entryList.map<Widget>((entry) {
        return ListTile(
          title: Text(
            '',
          ),
        );
      }).toList();

      return myList;
    } else {
      // If not empty, return a list of ListTiles widgets with the data we got
      List myList = entryList.map<Widget>((entry) {
        return ListTile(
          title: Text(
            entry['text'],
            style: TextStyle(color: Colors.white),
          ),
          // Tile Color will be based on entry['color']
          tileColor: Color.fromRGBO(21, 115, 170, 0.80),
        );
      }).toList();

      return myList;
    }
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

//  ListView.separated(
//     padding: EdgeInsets.all(8),
//     itemCount: entries.length,
//     itemBuilder: (BuildContext context, int index) {
//       return Container(
//           child: Center(child: Text('Entry ${entries[index]}')),
//           height: 50,
//           color: Colors.blue[colorCodes[index]]);
//     },
//     separatorBuilder: (BuildContext context, int index) => Divider(),
//   )
