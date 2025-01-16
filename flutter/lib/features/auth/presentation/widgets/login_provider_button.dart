import 'package:flutter/material.dart';

class LoginProviderButton extends StatelessWidget {
  final Widget icon;
  final String text;
  final VoidCallback onPressed;
  final Color? backgroundColor;
  final Color? textColor;

  const LoginProviderButton({
    super.key,
    required this.icon,
    required this.text,
    required this.onPressed,
    this.backgroundColor,
    this.textColor,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          foregroundColor: textColor ?? Colors.black,
          backgroundColor:
              backgroundColor ?? Colors.white, // Default to black text
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(30.0), // Circular sides
          ),
          elevation: 2.0, // Optional: Add some shadow
        ),
        onPressed: onPressed,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            icon,
            const SizedBox(width: 8.0), // Space between icon and text
            Text(
              text,
              style: const TextStyle(
                fontSize: 16.0,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
