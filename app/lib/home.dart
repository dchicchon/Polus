import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key key}) : super(key: key);

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  List<String> entries = <String>['A', 'B', 'C'];
  List<int> colorCodes = <int>[600, 500, 100];

  // By default, look at todays date
  // show loading symbol while getting entries

  // Get a list of entries from our database

  // List<Map> getEntries() {}

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
        body: Container(child: Center(child: EntriesList())));
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

  Widget checkEntries(snapshot) {
    dynamic jsonDocument = snapshot.data;
    print(jsonDocument['text']);

    return ListTile(title: Text("Hello"));
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

        // return ListView(children: [Text('${snapshot.data}')]);
        return ListView(
            children: snapshot.data['7-6-2021'].map(
              (Map entry) {
                  return ListTile(
                    title: entry['text'],
                    subtitle: entry['color'],
                  );
              }
        ).toList()
        
        );
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