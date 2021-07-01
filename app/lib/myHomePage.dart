import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
// import 'package:app/firestore.dart';

class MyHomePage extends StatefulWidget {
  final FirebaseUser user;

  MyHomePage(this.user);

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  // List<Entry> entries = [];
  @override
  void initState() {
    super.initState();
    // updatePosts();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text('Polus'),
        ),
        body: Column(
          children: [Text("Hello World")],
        ));
  }
}
