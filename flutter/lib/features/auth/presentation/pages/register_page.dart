import 'package:flutter/material.dart';
import 'package:pizza_shack/features/auth/presentation/sections/email_password_section.dart';
import 'package:pizza_shack/features/auth/presentation/sections/sso_section.dart';
import 'package:pizza_shack/features/auth/presentation/widgets/divider.dart';

class RegisterPage extends StatelessWidget {
  const RegisterPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          onPressed: () => Navigator.pushNamedAndRemoveUntil(
            context,
            '/',
            (route) => false,
          ),
          icon: Icon(Icons.arrow_back),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Expanded(child: SizedBox()),
            SsoSection(),
            AuthDivider(),
            EmailPasswordSection(),
            Expanded(child: SizedBox()),
          ],
        ),
      ),
    );
  }
}
