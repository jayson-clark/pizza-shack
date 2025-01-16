import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' show kIsWeb;

import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:sign_in_with_apple/sign_in_with_apple.dart';

import 'dart:io' show Platform;

class AuthService {
  static final FirebaseAuth _auth = FirebaseAuth.instance;

  // Initialize Emulators (Call this once in main)
  static void initializeEmulators() {
    _auth.useAuthEmulator('localhost', 9099);
  }

  // Google Sign-In
  static Future<void> signInWithGoogle(BuildContext context) async {
    try {
      if (kIsWeb) {
        // Web implementation
        GoogleAuthProvider googleProvider = GoogleAuthProvider();
        await _auth.signInWithPopup(googleProvider);
      } else if (Platform.isIOS || Platform.isAndroid) {
        // Mobile implementation
        final GoogleSignInAccount? googleUser = await GoogleSignIn().signIn();

        if (googleUser == null) {
          // User canceled the sign-in
          return;
        }

        final GoogleSignInAuthentication googleAuth =
            await googleUser.authentication;

        final credential = GoogleAuthProvider.credential(
          accessToken: googleAuth.accessToken,
          idToken: googleAuth.idToken,
        );

        await _auth.signInWithCredential(credential);
      } else {
        // Fallback for other platforms
        _showErrorDialog(
            context, "Google Sign-In is not supported on this platform.");
      }
    } catch (e) {
      _showErrorDialog(context, e.toString());
    }
  }

  // Apple Sign-In
  static Future<void> signInWithApple(BuildContext context) async {
    try {
      if (kIsWeb) {
        _showErrorDialog(context, "Apple Sign-In is not supported on the web.");
        return;
      }

      if (Platform.isIOS) {
        final appleCredential = await SignInWithApple.getAppleIDCredential(
          scopes: [
            AppleIDAuthorizationScopes.email,
            AppleIDAuthorizationScopes.fullName,
          ],
        );

        final oauthCredential = OAuthProvider("apple.com").credential(
          idToken: appleCredential.identityToken,
          accessToken: appleCredential.authorizationCode,
        );

        await _auth.signInWithCredential(oauthCredential);
      } else {
        _showErrorDialog(
            context, "Apple Sign-In is only available on iOS devices.");
      }
    } catch (e) {
      _showErrorDialog(context, e.toString());
    }
  }

  // Email & Password Sign-In
  static Future<void> signInWithEmailAndPassword(
      BuildContext context, String email, String password) async {
    try {
      await _auth.signInWithEmailAndPassword(email: email, password: password);
    } on FirebaseAuthException catch (e) {
      _showErrorDialog(context, e.message ?? 'An error occurred.');
    }
  }

  // Email & Password Registration
  static Future<void> registerWithEmailAndPassword(
      BuildContext context, String email, String password) async {
    try {
      await _auth.createUserWithEmailAndPassword(
          email: email, password: password);
    } on FirebaseAuthException catch (e) {
      _showErrorDialog(context, e.message ?? 'An error occurred.');
    }
  }

  // Sign Out
  static Future<void> signOut() async {
    await _auth.signOut();
    await GoogleSignIn().signOut();
  }

  // Show Error Dialog
  static void _showErrorDialog(BuildContext context, String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Error'),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('OK'),
          ),
        ],
      ),
    );
  }
}
