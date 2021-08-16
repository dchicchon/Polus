// Flutter
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

// Packages
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
// import 'package:flutter_local_notifications/flutter_local_notifications.dart';
// import 'package:cloud_functions/cloud_functions.dart';

// App Modules
import 'home.dart';
import 'auth.dart';
import 'settings.dart';

// For Background Notifications
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  // If you're going to use other Firebase services in the background, such as Firestore,
  // make sure you call `initializeApp` before using other Firebase services.
  await Firebase.initializeApp();
  print('Handling a background message ${message.messageId}');
  if (message.notification != null) {
    print(message.notification.title);
    print(message.notification.body);
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
  MyApp({Key key}) : super(key: key);

  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  User _user;
  FirebaseAnalytics analytics;
  bool _error = false;

  void _handleLogin(User user) {
    // print("Handle Login");
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
      print("user granted permission");
    } else if (settings.authorizationStatus ==
        AuthorizationStatus.provisional) {
      print('user granted provisional permission');
    } else {
      print('user declined or has not accepted permission');
    }
  }

  @override
  void initState() {
    super.initState();

    requestNotificationPermission();

    // if we opened the app through a notification, it will send us via this
    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      print('On Message Opened!');
      print(message);
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_error) {
      return MaterialApp(
          title: "Error",
          // navigatorObservers: [FirebaseAnalyticsObserver(analytics: analytics)],
          theme: ThemeData(
              primarySwatch: Colors.blue,
              scaffoldBackgroundColor: Colors.black,
              textTheme: Theme.of(context)
                  .textTheme
                  .apply(bodyColor: Colors.white, displayColor: Colors.white)),
          home: SomethingWentWrong());
    }

    return MaterialApp(
        title: "Polus",
        // https://api.flutter.dev/flutter/material/ThemeData-class.html
        theme: ThemeData(primarySwatch: Colors.blue),
        home: _user == null
            ? Navigator(
                // Pages are here, we only go to home page if a user exists
                pages: [
                  MaterialPage(
                      key: ValueKey("Auth Page"),
                      child: Auth(onLogin: _handleLogin)),
                  // if (_user != null)
                  //   MaterialPage(key: ValueKey("Home Page"), child: HomePage()),
                ],
                onPopPage: (route, result) => route.didPop(result),
              )
            : Navigator(
                pages: [
                  MaterialPage(
                      key: ValueKey("Settings"), child: SettingsPage()),
                  MaterialPage(key: ValueKey("Home Page"), child: HomePage()),
                ],
                onPopPage: (route, result) => route.didPop(result),
              ));
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

// This is where we will check  if there is a user logged in or not
class Auth extends StatefulWidget {
  final Function onLogin; // function passed in from parent

  Auth({Key key, this.onLogin}) : super(key: key);

  @override
  _AuthState createState() => _AuthState();
}

class _AuthState extends State<Auth> {
  final FirebaseAuth firebaseAuth = FirebaseAuth.instance;

  String authWidget = 'login';

  void setPage(page) {
    setState(() {
      authWidget = page;
    });
  }

  @override
  void initState() {
    super.initState();
    // Listen for changes in whether or not there is a user
    firebaseAuth.authStateChanges().listen((User user) {
      widget.onLogin(user); // this will change to logged out or logged in
    });
  }

  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.blueGrey[900],
      // appBar: AppBar(title: const Text("Polus")),
      body: Center(
          child: Container(
              // color: Colors.blue[100],
              width: 325,
              height: 275,
              padding: EdgeInsets.all(10),
              child: (this.authWidget == 'login'
                  ? Login(this.setPage)
                  : SignUp(this.setPage)))),
    );
  }
}

class Login extends StatefulWidget {
  final Function setPage;
  Login(this.setPage);

  @override
  _LoginState createState() => _LoginState();
}

class _LoginState extends State<Login> {
  final GlobalKey<FormState> _loginKey = GlobalKey<FormState>();

  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  String email = '';
  String password = '';

  @override
  void initState() {
    super.initState();
  }

  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  Widget build(BuildContext context) {
    return Column(children: [
      Text(
        'Login',
        style: TextStyle(fontSize: 25),
      ),
      Form(
          key: _loginKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TextFormField(
                controller: emailController,
                decoration: const InputDecoration(hintText: 'Enter your email'),
                validator: (String value) {
                  if (value == null || value.isEmpty) {
                    return "Please Enter Some Text";
                  }
                  return null;
                },
              ),
              TextFormField(
                controller: passwordController,
                decoration:
                    const InputDecoration(hintText: 'Enter your password'),
                validator: (String value) {
                  if (value == null || value.isEmpty) {
                    return 'Please Enter a valid password';
                  }
                  return null;
                },
              ),
              Row(
                children: [
                  Column(
                    children: [
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 16.0),
                        child: ElevatedButton(
                            onPressed: () {
                              final form = _loginKey.currentState;
                              if (form.validate()) {
                                signInWithEmailAndPassword(
                                    emailController.text.trim(),
                                    passwordController.text.trim());
                              } else {
                                print("Form not valid");
                              }
                            },
                            child: const Text("Submit")),
                      )
                    ],
                  ),
                  SizedBox(width: 25),
                  Column(
                    children: [
                      Padding(
                        padding: EdgeInsets.symmetric(vertical: 15),
                        child: ElevatedButton(
                          onPressed: () {
                            print("Login w/ Google");
                          },
                          child: Text("Google"),
                        ),
                      )
                    ],
                  )
                ],
              )
            ],
          )),
      ElevatedButton(
          onPressed: () {
            widget.setPage('signup');
          },
          child: Text('Dont have an account? Sign up here'))
    ]);
  }
}

class SignUp extends StatefulWidget {
  final Function setPage;
  SignUp(this.setPage);

  @override
  _SignUpState createState() => _SignUpState();
}

class _SignUpState extends State<SignUp> {
  final GlobalKey<FormState> _signUpKey = GlobalKey<FormState>();

  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  String email = '';
  String password = '';

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  Widget build(BuildContext context) {
    return Column(children: [
      Text('Sign Up', style: TextStyle(fontSize: 25, color: Colors.white)),
      Form(
          key: _signUpKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TextFormField(
                controller: emailController,
                decoration: const InputDecoration(hintText: 'Enter your email'),
                validator: (String value) {
                  if (value == null || value.isEmpty) {
                    return "Please Enter Some Text";
                  }
                  return null;
                },
              ),
              TextFormField(
                controller: passwordController,
                decoration:
                    const InputDecoration(hintText: 'Enter your password'),
                validator: (String value) {
                  if (value == null || value.isEmpty) {
                    return 'Please Enter a valid password';
                  }
                  return null;
                },
              ),
              Row(
                children: [
                  Column(
                    children: [
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 16.0),
                        child: ElevatedButton(
                            onPressed: () {
                              final form = _signUpKey.currentState;
                              // Do work here
                              if (form.validate()) {
                                createWithEmailAndPassword(
                                    emailController.text.trim(),
                                    passwordController.text.trim());
                              } else {
                                print("Form not valid");
                              }
                            },
                            child: const Text("Submit")),
                      )
                    ],
                  ),
                  SizedBox(width: 25),
                  Column(
                    children: [
                      Padding(
                        padding: EdgeInsets.symmetric(vertical: 15),
                        child: ElevatedButton(
                          onPressed: () {
                            print("SignUp w/ Google");
                          },
                          child: Text("Google"),
                        ),
                      )
                    ],
                  )
                ],
              )
            ],
          )),
      ElevatedButton(
          onPressed: () {
            widget.setPage('login');
          },
          child: Text('Already have an account? Click here'))
    ]);
  }
}
