import 'package:flutter/material.dart';
import 'package:pizza_shack/src/views/home/home_widgets.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(backgroundColor: Colors.red),
      body: const Column(
        children: [
          Logo(),
          Spacer(flex: 1),
          ServicesSection(),
          Spacer(flex: 3),
          OrderButton(),
          SizedBox(height: 30),
        ],
      ),
    );
  }
}
