import 'dart:async';
import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class FirestoreCollection extends ChangeNotifier {
  final String collectionPath;
  Map<String, FirestoreDocument> documents = {};

  bool isReady = false;
  final Completer<void> _readyCompleter = Completer<void>();
  Future<void> get ready => _readyCompleter.future;

  FirestoreDocument? doc(String docId) => documents[docId];

  FirestoreCollection(this.collectionPath) {
    listenToUpdates();
  }

  void listenToUpdates() {
    FirebaseFirestore.instance.collection(collectionPath).snapshots().listen(
      (snapshot) {
        for (var change in snapshot.docChanges) {
          final docId = change.doc.id;

          switch (change.type) {
            case DocumentChangeType.added:
            case DocumentChangeType.modified:
              if (!documents.containsKey(docId)) {
                documents[docId] = FirestoreDocument(change.doc.reference.path);
              }
              documents[docId]?.updateSnapshot(change.doc);
              break;
            case DocumentChangeType.removed:
              documents[docId]?.dispose();
              documents.remove(docId);
              break;
          }
        }

        if (!isReady) _readyCompleter.complete();
        isReady = true;

        notifyListeners();
      },
      onError: (error) =>
          debugPrint('Error listening to Firestore updates: $error'),
    );
  }

  Future<void> setDocument(String docId, Map<String, dynamic> data) async {
    await FirebaseFirestore.instance
        .collection(collectionPath)
        .doc(docId)
        .set(data);

    if (!documents.containsKey(docId)) {
      documents[docId] = FirestoreDocument(FirebaseFirestore.instance
          .collection(collectionPath)
          .doc(docId)
          .path);
    }
  }

  @override
  void dispose() {
    for (var doc in documents.values) {
      doc.dispose();
    }
    super.dispose();
  }
}

class FirestoreDocument extends ChangeNotifier {
  final String documentPath;
  DocumentSnapshot<Map<String, dynamic>>? document;

  dynamic get(String field) => document?.data()?[field];

  bool isReady = false;
  final Completer<void> _readyCompleter = Completer<void>();
  Future<void> get ready => _readyCompleter.future;

  FirestoreDocument(this.documentPath) {
    listenToUpdates();
  }

  void listenToUpdates() {
    FirebaseFirestore.instance.doc(documentPath).snapshots().listen(
      (snapshot) {
        if (snapshot.exists) {
          updateSnapshot(snapshot);
        } else {
          document = null;
        }
      },
      onError: (error) =>
          debugPrint('Error listening to Firestore updates: $error'),
    );
  }

  void updateSnapshot(DocumentSnapshot<Map<String, dynamic>> newSnapshot) {
    document = newSnapshot;

    if (!isReady) _readyCompleter.complete();
    isReady = true;

    notifyListeners();
  }

  Future<void> updateFields(Map<String, dynamic> fieldUpdates) async {
    try {
      await FirebaseFirestore.instance.doc(documentPath).update(fieldUpdates);
    } catch (e) {
      debugPrint('Error updating specific fields: $e');
    }
  }

  Future<void> setData(Map<String, dynamic> data) async {
    try {
      await FirebaseFirestore.instance.doc(documentPath).set(data);
    } catch (e) {
      debugPrint('Error setting document data: $e');
    }
  }
}
