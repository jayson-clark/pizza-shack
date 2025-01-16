import 'package:flutter/material.dart';

class Logo extends StatelessWidget {
  const Logo({super.key});

  @override
  Widget build(BuildContext context) {
    return Image(
      image: AssetImage('assets/images/logo_text.png'),
    );
  }
}
