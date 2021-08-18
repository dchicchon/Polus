// Flutter
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

// Packages
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

// App Modules
import 'home.dart';
import 'settings.dart';
import 'signup.dart';
import 'login.dart';

// For Background Notifications
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  // If you're going to use other Firebase services in the background, such as Firestore,
  // make sure you call `initializeApp` before using other Firebase services.
  await Firebase.initializeApp();
  // print('Handling a background message ${message.messageId}');
  if (message.notification != null) {
    // print(message.notification.title);
    // print(message.notification.body);
  }

  // Create a notification for this
}

// Starting FlutterFire through the suggestion found here
// https://firebase.flutter.dev/docs/overview
Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  // Background Message Handler
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  runApp(MyApp());
}

class MyApp extends StatefulWidget {
  MyApp();

  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  User _user;

  void _handleLogin(User user) {
    setState(() {
      _user = user;
    });
  }

  void requestNotificationPermission() async {
    NotificationSettings settings = await FirebaseMessaging.instance
        .requestPermission(
            alert: true,
            announcement: true,
            badge: true,
            carPlay: false,
            criticalAlert: false,
            provisional: false,
            sound: true);

    if (settings.authorizationStatus == AuthorizationStatus.authorized) {
      // print("user granted permission");
    } else if (settings.authorizationStatus ==
        AuthorizationStatus.provisional) {
      // print('user granted provisional permission');
    } else {
      // print('user declined or has not accepted permission');
    }
  }

  @override
  void initState() {
    super.initState();
    requestNotificationPermission();
    FirebaseAuth.instance.authStateChanges().listen((User user) {
      _handleLogin(user);
    });

    // if we opened the app through a notification, it will send us via this
    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      // print('On Message Opened!');
      // print(message);
    });
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(builder: (context, AsyncSnapshot snapshot) {
      return MaterialApp(
          title: "Polus",
          // https://api.flutter.dev/flutter/material/ThemeData-class.html
          theme: ThemeData(
              errorColor: Colors.white,
              primaryColorLight: Color.fromRGBO(20, 70, 107, 1.0),
              primaryColorDark: Color.fromRGBO(0, 28, 43, 1.0),
              textTheme: TextTheme(
                  headline5: TextStyle(
                      fontSize: 20.0,
                      color: Colors.white,
                      fontWeight: FontWeight.w300),
                  headline6: TextStyle(
                      fontSize: 25.0,
                      color: Colors.white,
                      fontWeight: FontWeight.w300),
                  bodyText1: TextStyle(fontSize: 16.0, color: Colors.white))),
          home: _user == null
              ? Navigator(
                  pages: [
                    MaterialPage(key: ValueKey("Login"), child: Login()),
                    MaterialPage(key: ValueKey("SignUp"), child: SignUp()),
                    MaterialPage(key: ValueKey('Welcome'), child: Welcome()),
                  ],
                  onPopPage: (route, result) => route.didPop(result),
                )
              : Navigator(
                  pages: [
                    MaterialPage(key: ValueKey("Settings"), child: Settings()),
                    MaterialPage(key: ValueKey("Home Page"), child: HomePage()),
                  ],
                  onPopPage: (route, result) => route.didPop(result),
                ));
    });
  }
}

class Welcome extends StatelessWidget {
  const Welcome();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Theme.of(context).primaryColorDark,
        body: Center(
          child: Container(
              height: 320,
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Padding(
                          padding: EdgeInsets.only(bottom: 15.0, top: 30.0),
                          child: Image.asset('assets/polus_icon48.png')),
                      Padding(
                        padding: EdgeInsets.only(left: 10.0, top: 15.0),
                        child: Text("Polus",
                            style: TextStyle(
                                fontSize: 25,
                                color: Colors.white,
                                fontWeight: FontWeight.w300)),
                      ),
                    ],
                  ),
                  ElevatedButton(
                      style: ElevatedButton.styleFrom(
                          primary: Color.fromARGB(255, 24, 71, 107),
                          padding: EdgeInsets.fromLTRB(80.0, 0, 80.0, 0)),
                      onPressed: () {
                        Navigator.push(context,
                            MaterialPageRoute(builder: (context) => Login()));
                      },
                      child: Text("Log In")),
                  ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        primary: Color.fromARGB(255, 24, 71, 107),
                        padding: EdgeInsets.fromLTRB(75.0, 0, 75.0, 0),
                      ),
                      onPressed: () {
                        Navigator.push(context,
                            MaterialPageRoute(builder: (context) => SignUp()));
                      },
                      child: Text("Sign Up"))
                ],
              )),
        ));
  }
}
