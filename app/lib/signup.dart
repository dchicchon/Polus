import 'package:flutter/material.dart';
import 'auth.dart';

class SignUp extends StatefulWidget {
  SignUp();

  @override
  _SignUpState createState() => _SignUpState();
}

class _SignUpState extends State<SignUp> {
  final GlobalKey<FormState> _signUpKey = GlobalKey<FormState>();

  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final confirmPasswordController = TextEditingController();

  String email = '';
  String password = '';
  bool _obscure = true;

  void toggleObscure() {
    setState(() {
      _obscure = !_obscure;
    });
  }

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text("Sign Up", style: Theme.of(context).textTheme.headline5),
          elevation: 0,
          backgroundColor: Theme.of(context).primaryColorDark,
        ),
        backgroundColor: Theme.of(context).primaryColorDark,
        body: SingleChildScrollView(
            child: Container(
                padding: EdgeInsets.fromLTRB(35.0, 50.0, 35.0, 5.0),
                child: Column(children: [
                  Form(
                      key: _signUpKey,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          TextFormField(
                            style: Theme.of(context).textTheme.bodyText1,
                            controller: emailController,
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
                                return "Email must not be empty";
                              }
                              return null;
                            },
                          ),
                          SizedBox(height: 10),
                          TextFormField(
                            obscureText: _obscure,
                            style: Theme.of(context).textTheme.bodyText1,
                            controller: passwordController,
                            decoration: InputDecoration(
                                focusedErrorBorder: OutlineInputBorder(
                                    borderSide: BorderSide(
                                        color: Theme.of(context).errorColor)),
                                errorBorder: OutlineInputBorder(
                                    borderSide: BorderSide(
                                        color: Theme.of(context).errorColor)),
                                suffixIcon: IconButton(
                                    onPressed: toggleObscure,
                                    icon: (this._obscure
                                        ? Icon(Icons.visibility)
                                        : Icon(Icons.visibility_off))),
                                focusedBorder: OutlineInputBorder(
                                    borderSide: BorderSide(
                                        color: Theme.of(context)
                                            .primaryColorLight)),
                                enabledBorder: OutlineInputBorder(
                                    borderSide: BorderSide(
                                        color: Theme.of(context)
                                            .primaryColorLight)),
                                labelText: 'Password',
                                labelStyle: TextStyle(color: Colors.white)),
                            validator: (String value) {
                              if (value.isEmpty) {
                                return 'Please enter a valid password';
                              }
                              return null;
                            },
                          ),
                          SizedBox(height: 10),
                          TextFormField(
                            style: Theme.of(context).textTheme.bodyText1,
                            obscureText: _obscure,
                            controller: confirmPasswordController,
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
                                        color: Theme.of(context)
                                            .primaryColorLight)),
                                enabledBorder: OutlineInputBorder(
                                    borderSide: BorderSide(
                                        color: Theme.of(context)
                                            .primaryColorLight)),
                                labelText: 'Confirm Password',
                                labelStyle: TextStyle(color: Colors.white)),
                            validator: (String value) {
                              if (value.isEmpty) {
                                return 'Please confirm password';
                              }
                              if (value != passwordController.text) {
                                return "Passwords do not match";
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
                        final form = _signUpKey.currentState;
                        // Do work here
                        if (form.validate()) {
                          String error = await createWithEmailAndPassword(
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
                      child: Text("Submit")),
                ]))));
  }
}
