import 'package:pizza_shack/src/services/firestore/firestore.dart';

class StoreNotifier extends FirestoreDocument {
  StoreNotifier() : super('settings/store');

  bool get isOpen => get('open') ?? false;
  bool get isDelivering => get('delivering') ?? false;
  bool get isAcceptingOrders => get('accepting_orders') ?? false;
}
