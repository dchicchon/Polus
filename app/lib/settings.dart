import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

class Settings extends StatefulWidget {
  const Settings();

  @override
  _SettingsState createState() => _SettingsState();
}

class _SettingsState extends State<Settings> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Theme.of(context).primaryColorDark,
        appBar: AppBar(
            backgroundColor: Theme.of(context).primaryColorDark,
            elevation: 0,
            title:
                Text("Settings", style: Theme.of(context).textTheme.headline5)),
        body: SingleChildScrollView(
          child: Container(
              width: double.infinity,
              padding: EdgeInsets.fromLTRB(35.0, 50.0, 35.0, 5.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // options
                  // let user change email
                  // let user change password
                  // let user see the list of their todo items today
                  // let user toggle different views in their entry list?
                  // let user select their colors?
                  // let user delete their account
                  Text('Adding more settings soon!',
                      style: Theme.of(context).textTheme.bodyText1),
                  SizedBox(height: 15.0),
                  ElevatedButton(
                      style: ElevatedButton.styleFrom(
                          primary: Theme.of(context).primaryColorLight),
                      onPressed: () {
                        showDialog(
                            context: context,
                            builder: (BuildContext context) {
                              return Dialog(
                                  backgroundColor: Colors.transparent,
                                  shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(4.0)),
                                  elevation: 5.0,
                                  child: Container(
                                    width: 400,
                                    decoration: BoxDecoration(
                                        color:
                                            Theme.of(context).primaryColorLight,
                                        border: Border.all(
                                          color: Colors.black,
                                        ),
                                        borderRadius: BorderRadius.all(
                                            Radius.circular(20))),
                                    padding: EdgeInsets.all(10.0),
                                    height: 200,
                                    child: Column(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        Text(
                                            "Are you sure you want to delete your account? All data will be lost.",
                                            textAlign: TextAlign.center,
                                            style: Theme.of(context)
                                                .textTheme
                                                .bodyText1),
                                        SizedBox(height: 10.0),
                                        Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.spaceAround,
                                          children: [
                                            ElevatedButton(
                                                style: ElevatedButton.styleFrom(
                                                    primary: Theme.of(context)
                                                        .primaryColorDark),
                                                onPressed: () async {
                                                  print("Delete Account");
                                                  await FirebaseFirestore
                                                      .instance
                                                      .collection('users')
                                                      .doc(FirebaseAuth.instance
                                                          .currentUser.uid)
                                                      .delete()
                                                      .then((result) {
                                                    FirebaseAuth
                                                        .instance.currentUser
                                                        .delete()
                                                        .then((result2) {
                                                      Navigator.pop(context);
                                                    });
                                                  });
                                                },
                                                child: Text("Yes")),
                                            ElevatedButton(
                                                style: ElevatedButton.styleFrom(
                                                    primary: Theme.of(context)
                                                        .primaryColorDark),
                                                onPressed: () {
                                                  Navigator.pop(context);
                                                },
                                                child: Text("No")),
                                          ],
                                        )
                                      ],
                                    ),
                                  ));
                            });
                      },
                      child: Text("Delete Account")),
                ],
              )),
        ));
  }
}
