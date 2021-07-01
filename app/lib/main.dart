import 'package:flutter/material.dart';
import 'package:app/login.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "Polus",
      theme: ThemeData(
        primarySwatch: Colors.orange,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: LoginPage(),
    );
  }
}

// https://firebase.flutter.dev/docs/overview#initializing-flutterfire

// class App extends StatefulWidget {
//   @override
//   _AppState createState() => _AppState();
// }

// class _AppState extends State<App> {
//   final Future<FirebaseApp> _initialization = Firebase.initializeApp();
//   @override
//   Widget build(BuildContext context) {
//     return FutureBuilder(
//         future: _initialization,
//         builder: (context, snapshot) {
//           // Check for errors
//           if (snapshot.hasError) {
//             return MaterialApp(
//                 title: 'Something Went Wrong',
//                 theme: ThemeData(primarySwatch: Colors.blue),
//                 home: MyErrorPage(title: 'Error'));
//           }

//           // Once complete, show your application
//           if (snapshot.connectionState == ConnectionState.done) {
//             return MyMainApp(title: 'Polus');
//           }

// // Otherwise, show something while waiting for initialization to complete
//           return Loading(title: "Loading");
//         });
//   }
// }

// class MyErrorPage extends StatefulWidget {
//   MyErrorPage({Key key, this.title}) : super(key: key);

//   final String title;

//   @override
//   _MyErrorPageState createState() => _MyErrorPageState();
// }

// class _MyErrorPageState extends State<MyErrorPage> {
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//         appBar: AppBar(title: Text(widget.title)),
//         body: Center(
//           child: Column(
//               mainAxisAlignment: MainAxisAlignment.center,
//               children: [Text("Error Page")]),
//         ));
//   }
// }

// class MyMainApp extends StatefulWidget {
//   MyMainApp({Key key, this.title}) : super(key: key);

//   final String title;

//   @override
//   _MyMainAppState createState() => _MyMainAppState();
// }

// class _MyMainAppState extends State<MyMainApp> {
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//         appBar: AppBar(title: Text(widget.title)),
//         body: Center(
//           child: Column(
//             mainAxisAlignment: MainAxisAlignment.center,
//             children: [Text("My Main App")],
//           ),
//         )
//         );
//   }
// }

// class Loading extends StatefulWidget {
//   Loading({Key key, this.title}) : super(key: key);

//   final String title;

//   @override
//   _LoadingState createState() => _LoadingState();
// }

// class _LoadingState extends State<Loading> {
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(title: Text(widget.title)),
//       body: Center(
//           child: Column(
//         mainAxisAlignment: MainAxisAlignment.center,
//         children: [Text("Loading")],
//       )),
//     );
//   }
// }
