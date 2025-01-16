import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:pizza_shack/features/auth/data/auth_service.dart';

class AuthViewModel extends ChangeNotifier {
  User? _user;
  User? get user => _user;

  AuthViewModel() {
    // Initialize emulators if needed
    // AuthService.initializeEmulators();

    // Listen to auth state changes
    FirebaseAuth.instance.authStateChanges().listen((user) {
      _user = user;
      notifyListeners();
    });
  }

  Future<void> signInWithGoogle(BuildContext context) async {
    await AuthService.signInWithGoogle(context);
  }

  Future<void> signInWithApple(BuildContext context) async {
    await AuthService.signInWithApple(context);
  }

  Future<void> signInWithEmailAndPassword(
      BuildContext context, String email, String password) async {
    await AuthService.signInWithEmailAndPassword(context, email, password);
  }

  Future<void> registerWithEmailAndPassword(
      BuildContext context, String email, String password) async {
    await AuthService.registerWithEmailAndPassword(context, email, password);
  }

  Future<void> signOut() async {
    await AuthService.signOut();
  }
}
