import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';


// Starting FlutterFire through the suggestion found here
// https://firebase.flutter.dev/docs/overview
void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(MyApp());
}

class MyApp extends StatefulWidget {
  MyApp({Key key}) : super(key: key);

  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  bool _initialized = false;
  bool _error = false;

  void initializeFlutterFire() async {
    try {
      await Firebase.initializeApp();
      setState(() {
        _initialized = true;
      });
    } catch (e) {
      setState(() {
        _error = true;
      });
    }
  }

  @override
  void initState() {
    initializeFlutterFire();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    if (_error) {
      return MaterialApp(
          title: "Error",
          theme: ThemeData(primarySwatch: Colors.blue),
          home: SomethingWentWrong());
    }

    if (!_initialized) {
      return Loading();
    }

    return MaterialApp(
        title: "Polus",
        theme: ThemeData(primarySwatch: Colors.blue),
        home: MyAwesomeApp());
  }
}

class SomethingWentWrong extends StatelessWidget {
  const SomethingWentWrong({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Center(
        child: Text(
          "Error",
        ),
      ),
    );
  }
}

class Loading extends StatelessWidget {
  const Loading({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Center(
        child: Text("Loading"),
      ),
    );
  }
}

// This is where we will check if there is a user logged in or not

class MyAwesomeApp extends StatefulWidget {
  MyAwesomeApp({Key key}) : super(key: key);

  @override
  _MyAwesomeAppState createState() => _MyAwesomeAppState();
}

class _MyAwesomeAppState extends State<MyAwesomeApp> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Polus")),
      body: const Center(child: Text("Hello World")),
    );
  }
}
