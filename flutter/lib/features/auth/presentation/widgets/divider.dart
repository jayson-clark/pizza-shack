import 'package:flutter/material.dart';

class AuthDivider extends StatelessWidget {
  const AuthDivider({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 10.0, bottom: 10.0),
      child: Row(
        children: [
          Expanded(
            child: Divider(
              color: Colors.grey, // Line color
              thickness: 1, // Line thickness
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8.0),
            child: Text(
              'or', // Text in the middle
              style: TextStyle(
                color: Colors.black, // Text color
                fontSize: 16, // Text size
              ),
            ),
          ),
          Expanded(
            child: Divider(
              color: Colors.grey, // Line color
              thickness: 1, // Line thickness
            ),
          ),
        ],
      ),
    );
  }
}
