import 'package:flutter/material.dart';
import 'package:pizza_shack/src/services/firestore/menu.dart';
import 'package:pizza_shack/src/views/menu/menu_widgets.dart';
import 'package:provider/provider.dart';

class MenuPage extends StatelessWidget {
  const MenuPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.red,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios),
          color: Colors.white,
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: Consumer<MenuNotifier>(
        builder: (_, menu, __) => FutureBuilder(
          future: menu.ready,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            } else if (snapshot.hasError) {
              return const Center(child: Text('Error loading data'));
            } else {
              return Padding(
                padding: const EdgeInsets.all(6.0),
                child: GridView.builder(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 1.0, // Adjust as needed\
                    crossAxisSpacing: 6,
                    mainAxisSpacing: 6,
                  ),
                  itemCount: menu.menuImages.length,
                  itemBuilder: (context, index) {
                    final entry = menu.menuImages.entries.elementAt(index);

                    return MenuItem(
                      itemName: entry.key,
                      imageURL: entry.value,
                    );
                  },
                ),
              );
            }
          },
        ),
      ),
    );
  }
}
