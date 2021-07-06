// import 'package:flutter/material.dart';
// import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';

Future<UserCredential> signInWithGoogle() async {
  // Trigger auth flow
  final GoogleSignInAccount googleUser = await GoogleSignIn().signIn();

  // obtain auth details from the request
  final GoogleSignInAuthentication googleAuth = await googleUser.authentication;

  // create a new credential
  final credential = GoogleAuthProvider.credential(
      accessToken: googleAuth.accessToken, idToken: googleAuth.idToken);

  // once signed in, return the user credential
  return await FirebaseAuth.instance.signInWithCredential(credential);
}

Future<void> createWithEmailAndPassword(email, password) async {
  UserCredential userCredential;

  try {
    userCredential = await FirebaseAuth.instance
        .createUserWithEmailAndPassword(email: email, password: password);
    return userCredential;
  } on FirebaseAuthException catch (e) {
    if (e.code == 'weak-password') {
      print("The password provided is too weak");
    } else if (e.code == 'email-already-in-use') {
      print("The account already exists for that email");
    }
  } catch (e) {
    print(e);
  }
}

Future<void> signInWithEmailAndPassword(email, password) async {
  UserCredential userCredential;

  try {
    userCredential = await FirebaseAuth.instance
        .signInWithEmailAndPassword(email: email, password: password);
    return userCredential;
  } catch (e) {
    print(e);
  }
}
