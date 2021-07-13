// import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';

Future<void> signInWithGoogle() async {
  // Trigger auth flow
  final GoogleSignInAccount googleUser = await GoogleSignIn().signIn();

  // obtain auth details from the request
  final GoogleSignInAuthentication googleAuth = await googleUser.authentication;

  // create a new credential
  final credential = GoogleAuthProvider.credential(
      accessToken: googleAuth.accessToken, idToken: googleAuth.idToken);

  // once signed in, return the user credential
  await FirebaseAuth.instance.signInWithCredential(credential);

  // Create user in our firestore with their user id
  FirebaseFirestore.instance
      .collection('users')
      .doc(FirebaseAuth.instance.currentUser.uid)
      .set({
    'userSettings': {
      'changePhoto': true,
      'indexOpen': false,
      'newTab': true,
      'notifications': false,
      'notificationTime': "0",
      'pmode': false,
      'view': "week",
    }
  });
}

// When we create a user in our database, we must give them an initial data
Future<void> createWithEmailAndPassword(email, password) async {
  UserCredential userCredential;
  try {
    userCredential = await FirebaseAuth.instance
        .createUserWithEmailAndPassword(email: email, password: password);

// Create user in our firestore with their user id
    FirebaseFirestore.instance
        .collection('users')
        .doc(FirebaseAuth.instance.currentUser.uid)
        .set({
      'userSettings': {
        'changePhoto': true,
        'indexOpen': false,
        'newTab': true,
        'notifications': false,
        'notificationTime': "0",
        'pmode': false,
        'view': "week",
      }
    });

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
