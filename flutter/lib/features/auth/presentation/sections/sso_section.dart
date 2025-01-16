import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:pizza_shack/features/auth/presentation/widgets/login_provider_button.dart';
import 'package:pizza_shack/features/auth/view_models/auth_view_model.dart';
import 'package:provider/provider.dart';

class SsoSection extends StatelessWidget {
  const SsoSection({super.key});

  @override
  Widget build(BuildContext context) {
    final authViewModel = Provider.of<AuthViewModel>(context, listen: false);

    return Column(
      children: [
        LoginProviderButton(
          icon: Text("GOOGLE LOGO"),
          text: "Continue with Google",
          onPressed: () async {
            await authViewModel.signInWithGoogle(context);
          },
        ),
        if (!kIsWeb)
          LoginProviderButton(
            textColor: Colors.white,
            backgroundColor: Colors.black,
            icon: Text("APPLE LOGO"),
            text: "Continue with Apple",
            onPressed: () async {
              await authViewModel.signInWithApple(context);
            },
          ),
      ],
    );
  }
}
