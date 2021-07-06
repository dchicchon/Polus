import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key key}) : super(key: key);

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  // List<String> entries = <String>['A', 'B', 'C'];
  // List<int> colorCodes = <int>[600, 500, 100];

  // By default, look at todays date
  // show loading symbol while getting entries

  // Get a list of entries from our database

  // List<Map> getEntries() {}
  Future<void> addEntry({String date = '7/6/2021'}) async {
    print("Adding Entry");

    // Document reference
    DocumentReference userRef = FirebaseFirestore.instance
        .collection('users')
        .doc(FirebaseAuth.instance.currentUser.uid);

    // get data
    dynamic data = await userRef.get();

    // set date (will do in parameters later)

    // Get our list of entries
    List entryList = data.data()[date];

    Map<String, dynamic> entry = {'text': 'Hello World'};

    entryList.add(entry);

    print(entryList);

    // userRef
    //     .set({'text': "Hello"})
    //     .then((value) => print('success'))
    //     .catchError((err) => print(err));
    // Fieldpath field = FieldPath.of(date);
    // userRef
    //     .update()
    //     .then((value) => print("Entry List Updated"))
    //     .catchError((error) => print("Failed to update list $error"));
  }

  @override
  void initState() {
    // getEntries();
    super.initState();
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
      body: Container(child: Center(child: EntriesList())),
      floatingActionButton: FloatingActionButton(
          onPressed: addEntry, tooltip: 'Increment', child: Icon(Icons.add)),
    );
  }
}

class EntriesList extends StatefulWidget {
  const EntriesList({Key key}) : super(key: key);

  @override
  _EntriesListState createState() => _EntriesListState();
}

class _EntriesListState extends State<EntriesList> {
  final Stream _entryStream = FirebaseFirestore.instance
      .collection('users')
      .doc(FirebaseAuth.instance.currentUser.uid)
      .snapshots();

// https://stackoverflow.com/questions/66074484/type-documentsnapshot-is-not-a-subtype-of-type-mapstring-dynamic
  List<Widget> getEntries(snapshot, {String dateStamp = '7/6/2021'}) {
    print("Get Entries");

    // Our entry list based on datestamp
    List entryList = snapshot.data.data()[dateStamp];

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
        return ListView(children: getEntries(snapshot));
      },
    );
  }
}

// snapshot.data.map((DocumentSnapshot document) {
//             Map<String, dynamic> data = document.data() as Map<String, dynamic>;
//             return ListTile(
//               title: Text(data['text']),
//               subtitle: Text(data['color']),
//             );
//           }).toList(),

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
