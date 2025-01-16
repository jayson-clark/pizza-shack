import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:pizza_shack/features/auth/view_models/auth_view_model.dart';

class EmailPasswordSection extends StatefulWidget {
  const EmailPasswordSection({super.key});

  @override
  _EmailPasswordSectionState createState() => _EmailPasswordSectionState();
}

class _EmailPasswordSectionState extends State<EmailPasswordSection> {
  final _formKey = GlobalKey<FormState>();
  String _email = '';
  String _password = '';

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          TextFormField(
            decoration: InputDecoration(labelText: 'Email'),
            keyboardType: TextInputType.emailAddress,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter your email';
              }
              if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value)) {
                return 'Please enter a valid email';
              }
              return null;
            },
            onSaved: (value) => _email = value!.trim(),
          ),
          TextFormField(
            decoration: InputDecoration(labelText: 'Password'),
            obscureText: true,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter your password';
              }
              if (value.length < 6) {
                return 'Password must be at least 6 characters';
              }
              return null;
            },
            onSaved: (value) => _password = value!.trim(),
          ),
          SizedBox(height: 20),
          ElevatedButton(
            onPressed: _submit,
            child: Text('Sign In'),
          ),
        ],
      ),
    );
  }

  void _submit() async {
    final authViewModel = Provider.of<AuthViewModel>(context, listen: false);

    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      try {
        // Attempt to sign in
        await authViewModel.signInWithEmailAndPassword(
            context, _email, _password);
      } catch (e) {
        // If sign in fails (e.g., user not found), show a dialog to register
        if (e.toString().contains('user-not-found')) {
          _showRegisterDialog();
        } else {
          // Handle other errors
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Error: ${e.toString()}')),
          );
        }
      }
    }
  }

  void _showRegisterDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Account Not Found'),
          content:
              Text('Would you like to register with this email and password?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () async {
                Navigator.of(context).pop(); // Close the dialog
                final authViewModel =
                    Provider.of<AuthViewModel>(context, listen: false);
                try {
                  await authViewModel.registerWithEmailAndPassword(
                      context, _email, _password);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                        content:
                            Text('Registration successful! Please sign in.')),
                  );
                } catch (e) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Error: ${e.toString()}')),
                  );
                }
              },
              child: Text('Register'),
            ),
          ],
        );
      },
    );
  }
}
