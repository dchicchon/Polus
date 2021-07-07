import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key key}) : super(key: key);

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  bool newEntry = false;
  final TextEditingController entryTextController = TextEditingController();

  Future<void> submitEntry({String date = '7-6-2021'}) async {
    print("Adding Entry");

    // Document reference
    DocumentReference userRef = FirebaseFirestore.instance
        .collection('users')
        .doc(FirebaseAuth.instance.currentUser.uid);

    // get data

    // set date (will do in parameters later)

    // Get our list of entries
    // My problem is still the date unfortulately

    // This is fine since its rare someone would put the same thing twice anyways for a date
    List<Map<String, dynamic>> entry = [
      {'text': 'Hello World'}
    ];

    userRef
        .update({date: FieldValue.arrayUnion(entry)})
        .then((value) => print("Entry List Updated"))
        .catchError((error) => print("Failed to update list $error"));
  }

  void addEntry() {
    setState(() {
      entryTextController.text = '';
      this.newEntry = !this.newEntry;
    });
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
            IconButton(
                onPressed: FirebaseAuth.instance.signOut,
                icon: Icon(Icons.navigate_next)),
          ],
        ),
        body: Column(
          children: [
            EntriesList(),
            // If newEntry is true, show the List Tile
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
            Align(
                alignment: Alignment.bottomCenter,
                child: FloatingActionButton(
                    onPressed: () {
                      print("hello");
                    },
                    child: Icon(Icons.add))),
            Align(
                alignment: Alignment.bottomRight,
                child: FloatingActionButton(
                    onPressed: () {
                      print("hello");
                    },
                    child: Icon(Icons.add)))
          ],
        )
        // FloatingActionButton(
        //     onPressed: addEntry, tooltip: 'Increment', child: Icon(Icons.add)),
        );
  }
}

class EntriesList extends StatefulWidget {
  final Function addEntry;
  const EntriesList({Key key, this.addEntry}) : super(key: key);

  @override
  _EntriesListState createState() => _EntriesListState();
}

class _EntriesListState extends State<EntriesList> {
  final Stream _entryStream = FirebaseFirestore.instance
      .collection('users')
      .doc(FirebaseAuth.instance.currentUser.uid)
      .snapshots();

// https://stackoverflow.com/questions/66074484/type-documentsnapshot-is-not-a-subtype-of-type-mapstring-dynamic
  List<Widget> getEntries(snapshot, {String dateStamp = '7-6-2021'}) {
    print("Get Entries");

    // Our entry list based on datestamp
    List entryList = snapshot.data.data()[dateStamp];

    print(entryList);
    // Check if data is empty
    if (entryList == null) {
      return [];
    }

    // If not empty, return a list of ListTiles widgets with the data we got
    List myList = entryList.map<Widget>((entry) {
      return ListTile(
        title: Text(
          entry['text'],
          style: TextStyle(color: Colors.white),
        ),
        tileColor: Color.fromRGBO(21, 115, 170, 0.80),
      );
    }).toList();

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
