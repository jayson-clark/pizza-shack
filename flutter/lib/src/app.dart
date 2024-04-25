import 'package:flutter/material.dart';
import 'package:pizza_shack/src/views/home/home_page.dart';

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Pizza Shack',
      theme: ThemeData(
        primarySwatch: Colors.red,
      ),
      home: Scaffold(
        appBar: AppBar(
          backgroundColor: Colors.red,
        ),
        body: Navigator(
          onGenerateRoute: (settings) => MaterialPageRoute(
            builder: (context) => const HomePage(),
          ),
        ),
      ),
    );
  }
}
