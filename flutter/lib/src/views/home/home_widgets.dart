import 'package:flutter/material.dart';
import 'package:pizza_shack/src/services/firestore/store.dart';
import 'package:pizza_shack/src/views/menu/menu_page.dart';
import 'package:provider/provider.dart';

class Logo extends StatelessWidget {
  const Logo({super.key});

  @override
  Widget build(BuildContext context) {
    return const Padding(
      padding: EdgeInsets.symmetric(vertical: 50, horizontal: 10),
      child: Image(image: AssetImage('assets/images/logo_text.png')),
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
    return Consumer<StoreNotifier>(
      builder: (_, settings, __) => FutureBuilder(
        future: settings.ready,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const CircularProgressIndicator(color: Colors.red);
          } else {
            return DefaultTextStyle.merge(
              style: const TextStyle(fontSize: 20),
              child: Column(
                children: [
                  OpenCloseRow(isOpen: settings.isOpen),
                  Text(
                    'Mobile Orders: ${settings.isAcceptingOrders ? 'Available' : 'Unavailable'}',
                  ),
                  Text(
                    'Delivery: ${settings.isDelivering ? 'Available' : 'Unavailable'}',
                  ),
                ],
              ),
            );
          }
        },
      ),
    );
  }
}

class OpenCloseRow extends StatelessWidget {
  final bool isOpen;

  const OpenCloseRow({super.key, required this.isOpen});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        const Spacer(),
        const Text(
          'We are currently ',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        Text(
          isOpen ? 'OPEN' : 'CLOSED',
          style: TextStyle(color: isOpen ? Colors.green : Colors.red),
        ),
        const Spacer(),
      ],
    );
  }
}
