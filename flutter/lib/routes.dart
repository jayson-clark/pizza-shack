import 'package:flutter/material.dart';
import 'package:pizza_shack/features/auth/presentation/pages/account_page.dart';
import 'package:pizza_shack/features/auth/presentation/pages/register_page.dart';
import 'package:pizza_shack/features/home/presentation/pages/home_page.dart';

class AppRoutes {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case "/":
        return MaterialPageRoute(builder: (_) => HomePage());
      case "/register":
        return MaterialPageRoute(builder: (_) => RegisterPage());
      case "/account":
        return MaterialPageRoute(builder: (_) => AccountPage());
      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(child: Text('No route defined for ${settings.name}')),
          ),
        );
    }
  }
}
