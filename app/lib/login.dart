import 'package:flutter/material.dart';
import 'auth.dart';

class Login extends StatefulWidget {
  // final Function setPage;
  Login();

  @override
  _LoginState createState() => _LoginState();
}

class _LoginState extends State<Login> {
  final GlobalKey<FormState> _loginKey = GlobalKey<FormState>();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  String email = '';
  String password = '';
  bool _obscure = true;

  void toggleObscure() {
    setState(() {
      _obscure = !_obscure;
    });
  }

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
    // Make this a Material App that has an appbar
    return Scaffold(
        appBar: AppBar(
          title: Text("Login", style: Theme.of(context).textTheme.headline5),
          elevation: 0,
          backgroundColor: Theme.of(context).primaryColorDark,
        ),
        backgroundColor: Theme.of(context).primaryColorDark,
        body: SingleChildScrollView(
            child: Container(
                padding: EdgeInsets.fromLTRB(35.0, 50.0, 35.0, 5.0),
                child: Column(children: [
                  Form(
                      key: _loginKey,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          TextFormField(
                            controller: emailController,
                            style: Theme.of(context).textTheme.bodyText1,
                            decoration: InputDecoration(
                              focusedErrorBorder: OutlineInputBorder(
                                  borderSide: BorderSide(
                                      color: Theme.of(context).errorColor)),
                              errorBorder: OutlineInputBorder(
                                  borderSide: BorderSide(
                                      color: Theme.of(context).errorColor)),
                              focusedBorder: OutlineInputBorder(
                                  borderSide: BorderSide(
                                      color:
                                          Theme.of(context).primaryColorLight)),
                              enabledBorder: OutlineInputBorder(
                                  borderSide: BorderSide(
                                      color:
                                          Theme.of(context).primaryColorLight)),
                              labelText: 'Email',
                              labelStyle: TextStyle(color: Colors.white),
                            ),
                            validator: (String value) {
                              if (value == null || value.isEmpty) {
                                return "Please Enter Some Text";
                              }
                              return null;
                            },
                          ),
                          SizedBox(height: 10),
                          TextFormField(
                            obscureText: _obscure,
                            controller: passwordController,
                            style: Theme.of(context).textTheme.bodyText1,
                            decoration: InputDecoration(
                              suffixIcon: IconButton(
                                  onPressed: toggleObscure,
                                  icon: (this._obscure
                                      ? Icon(Icons.visibility)
                                      : Icon(Icons.visibility_off))),
                              focusedErrorBorder: OutlineInputBorder(
                                  borderSide: BorderSide(
                                      color: Theme.of(context).errorColor)),
                              errorBorder: OutlineInputBorder(
                                  borderSide: BorderSide(
                                      color: Theme.of(context).errorColor)),
                              focusedBorder: OutlineInputBorder(
                                  borderSide: BorderSide(
                                      color:
                                          Theme.of(context).primaryColorLight)),
                              enabledBorder: OutlineInputBorder(
                                  borderSide: BorderSide(
                                      color:
                                          Theme.of(context).primaryColorLight)),
                              labelText: 'Password',
                              labelStyle: TextStyle(color: Colors.white),
                            ),
                            validator: (String value) {
                              if (value == null || value.isEmpty) {
                                return 'Please enter your password.';
                              }
                              return null;
                            },
                          ),
                        ],
                      )),

                  ElevatedButton(
                      style: ElevatedButton.styleFrom(
                          padding: EdgeInsets.fromLTRB(80.0, 0, 80.0, 0),
                          primary: Theme.of(context).primaryColorLight),
                          
                      onPressed: () async {
                        final form = _loginKey.currentState;
                        if (form.validate()) {
                          String error = await signInWithEmailAndPassword(
                              emailController.text.trim(),
                              passwordController.text.trim());
                          if (error != null) {
                            ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                                backgroundColor:
                                    Theme.of(context).primaryColorLight,
                                content: Text(error)));
                          }
                        }
                      },
                      child: const Text("Submit")),
                ]))));
  }
}
