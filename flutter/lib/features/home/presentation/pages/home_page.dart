import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:pizza_shack/features/auth/view_models/auth_view_model.dart';
import 'package:pizza_shack/features/home/presentation/widgets/app_bar.dart';
import 'package:provider/provider.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    AuthViewModel auth = Provider.of<AuthViewModel>(context);
    User? user = auth.user;

    return Scaffold(
      appBar: HomeAppBar(),
      body: Center(
        child: Column(
          children: [
            Text(
              'Welcome, ${user?.displayName ?? user?.email ?? 'User'}!',
              style: TextStyle(fontSize: 24),
            ),
            TextButton(
              onPressed: () {
                auth.signOut();
              },
              child: Text('Sign Out'),
            ),
          ],
        ),
      ),
    );
  }
}
