import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'auth.dart';

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
  User _user;
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

// change this to its own thing late
    if (!_initialized) {
      return MaterialApp(
          title: "loading",
          theme: ThemeData(primarySwatch: Colors.blue),
          home: Loading());
    }

    return MaterialApp(
        title: "Polus",
        theme: ThemeData(primarySwatch: Colors.blue),
        home: Navigator(
          pages: [
            MaterialPage(
                key: ValueKey("Auth Page"), child: Auth(onLogin: _handleLogin)),
            if (_user != null)
              MaterialPage(key: ValueKey("Home Page"), child: HomePage())
          ],
          onPopPage: (route, result) => route.didPop(result),
        ));
  }

  void _handleLogin(User user) {
    print("Handle Login");
    setState(() {
      _user = user;
    });
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
class Auth extends StatefulWidget {
  final Function onLogin;

  Auth({Key key, this.onLogin}) : super(key: key);

  @override
  _AuthState createState() => _AuthState();
}

class _AuthState extends State<Auth> {
  final FirebaseAuth firebaseAuth = FirebaseAuth.instance;

  // Only show this if user is not signedin
  String authWidget = 'login';

  Widget whichWidget() {
    if (this.authWidget == 'login') {
      return Login();
    } else {
      return SignUp();
    }
  }

  @override
  void initState() {
    firebaseAuth.authStateChanges().listen((User user) {
      widget.onLogin(user);
      // if (user == null) {
      //   print("User is signed out");
      //   widget.onLogin(user)
      // } else {
      //   // Maybe navigate to homePage?
      //   print("User is signed in, changing login state");
      //   widget.onLogin(user);
      // }
    });
    super.initState();
  }

  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Polus")),
      body: Center(
          child: Container(
              color: Colors.blue[100],
              width: 325,
              height: 275,
              padding: EdgeInsets.all(10),
              child: Column(
                children: [
                  Text(
                    (this.authWidget == 'login' ? "Login" : "Sign Up"),
                    style: TextStyle(fontSize: 25),
                  ),
                  whichWidget(),
                  ElevatedButton(
                      onPressed: () {
                        if (this.authWidget == 'login') {
                          this.setState(() {
                            this.authWidget = 'signup';
                          });
                        } else {
                          this.setState(() {
                            this.authWidget = 'login';
                          });
                        }
                      },
                      child: Text((this.authWidget == 'login'
                          ? 'Dont have an account? Sign up here'
                          : 'Already have an account? Click here')))
                ],
              ))),
    );
  }
}

class Login extends StatefulWidget {
  Login({Key key}) : super(key: key);

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
    print("Starting Login");
    super.initState();
  }

  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  Widget build(BuildContext context) {
    return Form(
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
                            print("Submitting Credentials");
                            if (_loginKey.currentState.validate()) {
                              print("Valid form");
                              // Do work here
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
        ));
  }
}

class SignUp extends StatefulWidget {
  SignUp({Key key}) : super(key: key);

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
    return Form(
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
                              print(emailController.text);
                              print(passwordController.text);
                              createWithEmailAndPassword(emailController.text,
                                  passwordController.text);
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
        ));
  }
}

class HomePage extends StatefulWidget {
  const HomePage({Key key}) : super(key: key);

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  Widget build(BuildContext context) {
    return Material(
        child: Center(
            child: Container(
                child: Column(
      children: [
        Text('You are logged in!'),
        ElevatedButton(
            onPressed: () {
              FirebaseAuth.instance.signOut();
            },
            child: Text("Logout")),
      ],
    ))));
  }
}
