import 'package:flutter/material.dart';
import 'package:pizza_shack/src/app.dart';

import 'package:firebase_core/firebase_core.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import 'firebase_options.dart';

bool shouldUseFirestoreEmulator = true;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  //
  // Firebase initialization
  //
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);

  FirebaseFirestore.instance.settings = Settings(
    persistenceEnabled: !shouldUseFirestoreEmulator,
  );

  if (shouldUseFirestoreEmulator) {
    FirebaseFirestore.instance.useFirestoreEmulator('localhost', 8080);
  }

  runApp(const App());
}
