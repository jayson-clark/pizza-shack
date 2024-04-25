import 'package:flutter/material.dart';

import 'package:pizza_shack/src/views/menu/menu_page.dart';

class Logo extends StatelessWidget {
  const Logo({super.key});

  @override
  Widget build(BuildContext context) {
    return const Padding(
      padding: EdgeInsets.only(left: 10, right: 10, top: 50, bottom: 10),
      child: Image(
        image: AssetImage('assets/images/logo_text.png'),
      ),
    );
  }
}

class OrderButton extends StatelessWidget {
  const OrderButton({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(15.0),
      child: OutlinedButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const MenuPage()),
          );
        },
        style: buttonStyle,
        child: const Text('Start New Order'),
      ),
    );
  }

  static final ButtonStyle buttonStyle = OutlinedButton.styleFrom(
    padding: const EdgeInsets.symmetric(vertical: 19.0, horizontal: 40.0),
    textStyle: const TextStyle(fontSize: 20),
    backgroundColor: Colors.red,
    foregroundColor: Colors.white,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(30.0),
    ),
  );
}

class ServicesSection extends StatelessWidget {
  const ServicesSection({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTextStyle.merge(
      style: const TextStyle(fontSize: 20),
      child: const Column(
        children: [
          OpenCloseRow(),
          Text('Mobile Orders: Available'),
          Text('Delivery: Available'),
        ],
      ),
    );
  }
}

class OpenCloseRow extends StatelessWidget {
  const OpenCloseRow({super.key});

  @override
  Widget build(BuildContext context) {
    return const Row(
      children: [
        Spacer(),
        Text('We are currently ',
            style: TextStyle(fontWeight: FontWeight.bold)),
        Text('OPEN', style: TextStyle(color: Colors.green)),
        Spacer(),
      ],
    );
  }
}
