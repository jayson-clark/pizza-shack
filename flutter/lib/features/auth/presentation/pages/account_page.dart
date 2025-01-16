import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:pizza_shack/features/auth/view_models/auth_view_model.dart';
import 'package:provider/provider.dart';

class AccountPage extends StatelessWidget {
  const AccountPage({super.key});

  @override
  Widget build(BuildContext context) {
    AuthViewModel auth = Provider.of<AuthViewModel>(context);
    User? user = auth.user;

    if (user == null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        print("WOW");
        Navigator.pushNamed(context, '/register');
      });
    }

    return Scaffold(
      body: Center(
        child: user == null
            ? CircularProgressIndicator() // Show a loading indicator temporarily
            : Column(
                children: [
                  Text(
                    'Hello, ${user.displayName ?? user.email ?? 'User'}!',
                    style: TextStyle(fontSize: 24),
                  ),
                  TextButton(
                    onPressed: () => auth.signOut(),
                    child: Text("Sign Out"),
                  ),
                ],
              ),
      ),
    );
  }
}
