import 'package:flutter/material.dart';

class HomeAppBar extends StatelessWidget implements PreferredSizeWidget {
  const HomeAppBar({super.key});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      // leading: IconButton(
      //   icon: Icon(Icons.shopping_bag),
      //   onPressed: () {
      //     // Handle shopping cart/bag button press
      //     print('Shopping bag button pressed');
      //   },
      // ),
      actions: [
        Padding(
          padding: const EdgeInsets.only(right: 8.0),
          child: IconButton(
            icon: Icon(Icons.account_circle),
            iconSize: 30,
            onPressed: () => Navigator.pushNamed(context, '/account'),
          ),
        ),
      ],
    );
  }

  @override
  Size get preferredSize => Size.fromHeight(kToolbarHeight);
}
