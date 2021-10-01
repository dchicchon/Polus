import 'dart:async';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_slidable/flutter_slidable.dart';
import 'package:cloud_functions/cloud_functions.dart';

// =================================================================
// ENTRY
class Entry extends StatefulWidget {
  final Map entry;
  final DateTime date;
  final Function deleteEntry;
  final Function updateEntry;
  final String id;

  Entry(this.entry, this.date, this.id, this.deleteEntry, this.updateEntry);

  @override
  _EntryState createState() => _EntryState();
}

class _EntryState extends State<Entry> {
// For picking time
// https://www.youtube.com/watch?v=aPaFalC2a28&ab_channel=JohannesMilke
  bool editing = false;
  TextEditingController _controller;
  FirebaseFunctions functions = FirebaseFunctions.instance;

  Color getColor(String color) {
    Color newColor;
    switch (color) {
      case 'blue':
        newColor = Color.fromRGBO(1, 115, 170, 1.0);
        break;
      case 'green':
        newColor = Color.fromRGBO(7, 128, 7, 1.0);
        break;
      case 'purple':
        newColor = Color.fromRGBO(122, 39, 138, 1.0);
        break;
      case 'gold':
        newColor = Color.fromRGBO(185, 174, 8, 1.0);
        break;
      case 'orange':
        newColor = Color.fromRGBO(251, 119, 5, 0.9);
        break;
      case 'red':
        newColor = Color.fromRGBO(220, 5, 5, 0.85);
        break;
    }

    return newColor;
  }

  DateTime getTimeFromString(String timeStr) {
    var time = timeStr.split(':');
    DateTime timeToReturn = DateTime(widget.date.year, widget.date.month,
        widget.date.day, int.parse(time[0]), int.parse(time[1]));
    return timeToReturn;
  }

  void deleteEntry(BuildContext context) async {
    // If Entry has time, make sure to delete this notification
    if (widget.entry.containsKey('expirationTask')) {
      // Delete the time here
      await deleteNotification(widget.entry['expirationTask']);
    }
    widget.deleteEntry(widget.entry, widget.id);
  }

  void archiveEntry(BuildContext context) async {
    Map<String, dynamic> entry = Map<String, dynamic>.from(widget.entry);
    entry['active'] = !entry['active'];
    widget.updateEntry(entry, widget.id);
  }

  void updateText(string) {
    if (string != widget.entry['text']) {
      Map<String, dynamic> entry = Map<String, dynamic>.from(widget.entry);
      entry['text'] = string;
      widget.updateEntry(entry, widget.id);
    }
    setState(() {
      editing = false;
    });
    // Find this entry on our db and update the text on there
  }

  void editEntry(BuildContext context) {
    print("Editing!");
    setState(() {
      editing = true;
    });
  }

  void updateColor(BuildContext context) async {
    print("Change Color");

    // Eventually, get a sheet of predetermined colors by user
    List colorSheet = ['blue', 'green', 'red', 'orange', 'purple'];
    int index = colorSheet.indexOf(widget.entry['color']);

    // https://stackoverflow.com/questions/49874771/flutter-cupertinopicker-bottomsheet-listener-for-onclose
    await showModalBottomSheet(
        context: context,
        builder: (BuildContext context) {
          return Container(
              height: 200,
              color: Colors.white,
              child: Center(
                  child: CupertinoPicker(
                scrollController:
                    // https://stackoverflow.com/questions/52385149/set-selected-initial-cupertinopicker-chosen-index
                    FixedExtentScrollController(initialItem: index),
                backgroundColor: Colors.white,
                onSelectedItemChanged: (value) {
                  Map<String, dynamic> entry =
                      Map<String, dynamic>.from(widget.entry);
                  entry['color'] = colorSheet[value];
                  widget.updateEntry(entry, widget.id);
                },
                itemExtent: 50.0,
                children: [
                  Text("Blue", style: TextStyle(height: 2)),
                  Text("Green", style: TextStyle(height: 2)),
                  Text("Red", style: TextStyle(height: 2)),
                  Text('Orange', style: TextStyle(height: 2)),
                  Text('Purple', style: TextStyle(height: 2)),
                ],
              )));
        });
  }

  Future<void> deleteNotification(taskName) async {
    print("Deleting Notification");
    try {
      HttpsCallable callable = functions.httpsCallable('deleteTask');
      var data = {'task': taskName};
      HttpsCallableResult result = await callable.call(data);
      print(result.data);
    } catch (e) {
      print(e);
    }
  }

// In this case here, make sure to create a flutter_local_notification for the new timeEntered
  Future<void> createNotification(Map data) async {
    print("Creating Notification");
    try {
      HttpsCallable callable = functions.httpsCallable('createTask');
      HttpsCallableResult result = await callable.call(data);
      print(result.data);
    } on FirebaseFunctionsException catch (e) {
      print('An error occurred while calling createNotification');
      print(
          'Error Details: ${e.details}\nMessage: ${e.message}\nPlugin: ${e.plugin}\nStacktrace: ${e.stackTrace}');
    } catch (e) {
      print("Uncaught error");
      print(e);
    }
  }

// Here we are updating the entry, but maybe we can create a cloud function that will create a notification with this entry that will
// execute at a certain time/date/etc.
  void timeEntry(BuildContext context) async {
    print("Change Time");
    DateTime newTime = DateTime.now();
    await showModalBottomSheet(
        context: context,
        builder: (BuildContext context) {
          return Container(
              height: 200,
              color: Colors.white,
              child: Center(
                  child: CupertinoDatePicker(
                      onDateTimeChanged: (DateTime time) {
                        newTime = time;
                      },
                      initialDateTime: widget.entry.containsKey('time')
                          ? getTimeFromString(widget.entry['time'])
                          : widget.date,
                      mode: CupertinoDatePickerMode.time)));
        });
    Map<String, dynamic> entry = Map<String, dynamic>.from(widget.entry);
    String timeString = "${newTime.hour}:${newTime.minute}";

    // Only run this if time actually changes
    if (widget.entry['time'] != timeString) {
      final diff = newTime.difference(new DateTime.now()).inSeconds;
      if (diff > 0) {
        String dateString =
            '${widget.date.month}-${widget.date.day}-${widget.date.year}';
        var notification = {
          'difference': diff,
          'date': dateString,
          'uid': FirebaseAuth.instance.currentUser.uid,
          'id': widget.id,
        };
        createNotification(notification);
      }
      widget.updateEntry(entry, widget.id);
    }
  }

  @override
  void initState() {
    super.initState();
    _controller = new TextEditingController(text: widget.entry['text']);
  }

  void dispose() {
    super.dispose();
  }

  Widget build(BuildContext context) {
    // For each entry, I want to be able to swipe left and be able to peform
    // certain actions
    // https://pub.dev/packages/flutter_slidable/versions/1.0.0-dev.8/example
    return (Slidable(
        key: ValueKey<String>(widget.id),
        startActionPane: ActionPane(
          motion: ScrollMotion(),
          children: [
            SlidableAction(
              onPressed: archiveEntry,
              backgroundColor: Colors.green,
              foregroundColor: Colors.white,
              icon: Icons.archive,
              // label: 'Archive',
            ),
            SlidableAction(
              onPressed: deleteEntry,
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
              icon: Icons.delete,
              // label: 'Delete',
            ),
            // Recurring?
            //             SlidableAction(
            //   onPressed: this.updateColor,
            //   backgroundColor: Colors.orange,
            //   foregroundColor: Colors.white,
            //   icon: Icons.palette,
            // ),
          ],
        ),
        endActionPane: ActionPane(
          motion: ScrollMotion(),
          children: [
            SlidableAction(
              onPressed: editEntry,
              backgroundColor: Colors.yellow[700],
              foregroundColor: Colors.white,
              icon: Icons.edit,
            ),
            SlidableAction(
              onPressed: timeEntry,
              backgroundColor: Colors.purple,
              foregroundColor: Colors.white,
              icon: Icons.timer,
            ),
            SlidableAction(
              onPressed: this.updateColor,
              backgroundColor: Colors.blue,
              foregroundColor: Colors.white,
              icon: Icons.palette,
            ),
          ],
        ),
        child: Card(
            child: ListTile(
          title: this.editing
              ? TextFormField(
                  autofocus: true,
                  style: Theme.of(context).textTheme.bodyText1,
                  onFieldSubmitted: (this.updateText),
                  textInputAction: TextInputAction.done,
                  controller: this._controller,
                )
              : Text(widget.entry['text'],
                  textAlign: TextAlign.center,
                  style: widget.entry['active']
                      ? TextStyle(
                          fontSize: 16.0,
                          color: Colors.white,
                          decoration: TextDecoration.lineThrough)
                      : Theme.of(context).textTheme.bodyText1),
          tileColor: getColor(widget.entry['color']),
        ))));
  }
}
// =================================================================
