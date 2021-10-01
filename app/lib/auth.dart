import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
// import 'package:google_sign_in/google_sign_in.dart';

// Future<void> signInWithGoogle() async {
//   // Trigger auth flow
//   final GoogleSignInAccount googleUser = await GoogleSignIn().signIn();

//   // obtain auth details from the request
//   final GoogleSignInAuthentication googleAuth = await googleUser.authentication;

//   // create a new credential
//   final credential = GoogleAuthProvider.credential(
//       accessToken: googleAuth.accessToken, idToken: googleAuth.idToken);

//   // once signed in, return the user credential
//   await FirebaseAuth.instance.signInWithCredential(credential);

//   // Create user in our firestore with their user id
//   FirebaseFirestore.instance
//       .collection('users')
//       .doc(FirebaseAuth.instance.currentUser.uid)
//       .set({
//     'userSettings': {
//       'changePhoto': true,
//       'indexOpen': false,
//       'newTab': true,
//       'notifications': false,
//       'notificationTime': "0",
//       'pmode': false,
//       'view': "week",
//     }
//   });
// }

// When we create a user in our database, we must give them an initial data
Future<String> createWithEmailAndPassword(email, password) async {
  String errorText;
  await FirebaseAuth.instance
      .createUserWithEmailAndPassword(email: email, password: password)
      .catchError((error) {
    if (error.code == 'weak-password') {
      errorText = 'Password is too weak, must be at least 6 characters';
    } else if (error.code == 'email-already-in-use') {
      errorText = 'Email is already in use';
    }
  });
  if (errorText != null) return errorText;
// Create user in our firestore with their user id
  await FirebaseFirestore.instance
      .collection('users')
      .doc(FirebaseAuth.instance.currentUser.uid)
      .set({'update': [], 'hasExtension': false, 'tokens': []});
  return errorText; 

  // setUpNotifications();
}

Future<String> signInWithEmailAndPassword(email, password) async {
  String errorText;
  await FirebaseAuth.instance
      .signInWithEmailAndPassword(email: email, password: password)
      .catchError((error) {
    // print(error.code);
    if (error.code == 'user-not-found') {
      errorText = 'User Not Found';
    } else if (error.code == 'wrong-password') {
      errorText = 'Incorrect Password';
    } else if (error.code == 'invalid-email') {
      errorText = 'Invalid Email';
    }
  });
  print("Done with sign in");
  return errorText;
}
