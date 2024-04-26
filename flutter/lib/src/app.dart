import 'package:flutter/material.dart';
import 'package:pizza_shack/src/services/firestore/menu.dart';
import 'package:pizza_shack/src/services/firestore/store.dart';
import 'package:pizza_shack/src/views/home/home_page.dart';

import 'package:provider/provider.dart';

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Pizza Shack',
      theme: ThemeData(primarySwatch: Colors.red),
      home: MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => StoreNotifier()),
          ChangeNotifierProvider(create: (_) => MenuNotifier())
        ],
        child: Navigator(
          onGenerateRoute: (settings) => MaterialPageRoute(
            builder: (context) => const HomePage(),
          ),
        ),
      ),
    );
  }
}
