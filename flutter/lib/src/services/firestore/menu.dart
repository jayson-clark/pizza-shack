import 'package:pizza_shack/src/services/firestore/firestore.dart';

class MenuNotifier extends FirestoreCollection {
  MenuNotifier() : super('menu');

  Map<String, String> get menuImages => documents.map((_, doc) =>
      MapEntry((doc.get('name') ?? ''), doc.get('image_url') ?? ''));
}
