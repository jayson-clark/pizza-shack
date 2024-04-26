import 'package:flutter/material.dart';
import 'package:pizza_shack/src/services/firestore/store.dart';
import 'package:pizza_shack/src/views/home/home_page.dart';

import 'package:provider/provider.dart';

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    final storeNotifier = StoreNotifier();

    return MaterialApp(
      title: 'Pizza Shack',
      theme: ThemeData(primarySwatch: Colors.red),
      home: MultiProvider(
        providers: [ChangeNotifierProvider(create: (_) => storeNotifier)],
        child: const RootScaffold(),
      ),
    );
  }
}

class RootScaffold extends StatelessWidget {
  const RootScaffold({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(backgroundColor: Colors.red),
      body: Navigator(
        onGenerateRoute: (settings) => MaterialPageRoute(
          builder: (context) => const HomePage(),
        ),
      ),
    );
  }
}
