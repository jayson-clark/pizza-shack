import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import BackButtonHeader from '../../core/components/BackButtonHeader';
import Counter from '../../core/components/Counter';
import { useShoppingBag } from '../../core/context/ShoppingBagContext';
import { useRouter } from 'expo-router';
import { ConfigState } from '../../core/context/ShoppingBagContext';

export default function BagScreen() {
    const { bagItems, removeItem, updateQuantity } = useShoppingBag();
    const router = useRouter();

    // Helper function to render a summary of the configuration.
    // You might later enhance this to show option labels instead of IDs.
    const renderConfig = (config: ConfigState) => {
        let summary = '';
        Object.keys(config).forEach((sectionId) => {
            const options = config[sectionId];
            const selectedOptions = Object.entries(options)
                .filter(([key, value]) => value === true || (typeof value === 'number' && value > 0))
                .map(([key, value]) => `${key}${typeof value === 'number' ? ` x${value}` : ''}`);
            if (selectedOptions.length > 0) {
                summary += `${sectionId}: ${selectedOptions.join(', ')}; `;
            }
        });
        return summary;
    };

    const handleRemove = (id: string) => {
        Alert.alert('Remove Item', 'Are you sure you want to remove this item?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Remove', onPress: () => removeItem(id) },
        ]);
    };

    const handleEdit = (bagItem: any) => {
        // For editing, navigate back to the item's config screen.
        // You could implement pre-filled configuration if desired.
        router.push(`/menu/item/${bagItem.item.id}`);
        // Optionally remove the item from the bag so the user can reconfigure.
        removeItem(bagItem.id);
    };

    return (
        <View style={styles.container}>
            <BackButtonHeader />
            <Text style={styles.header}>Your Shopping Bag</Text>
            {bagItems.length === 0 ? (
                <Text style={styles.emptyText}>Your bag is empty.</Text>
            ) : (
                <FlatList
                    data={bagItems}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Image source={item.item.image} style={styles.cardImage} />
                            <View style={styles.cardContent}>
                                <Text style={styles.itemTitle}>{item.item.title}</Text>
                                <Text style={styles.configText}>{renderConfig(item.config)}</Text>
                                <View style={styles.quantityRow}>
                                    <Text style={styles.quantityLabel}>Quantity:</Text>
                                    <Counter
                                        count={item.quantity}
                                        onChange={(newQty) => updateQuantity(item.id, newQty)}
                                    />
                                </View>
                                <Text style={styles.priceText}>Total: ${item.totalPrice.toFixed(2)}</Text>
                                <View style={styles.buttonRow}>
                                    <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
                                        <Text style={styles.buttonText}>Edit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.removeButton} onPress={() => handleRemove(item.id)}>
                                        <Text style={styles.buttonText}>Remove</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f2f2f2',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    emptyText: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 20,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        marginVertical: 10,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginHorizontal: 10,
        width: '95%',
        alignSelf: 'center',
    },
    cardImage: {
        width: 100,
        height: 100,
    },
    cardContent: {
        flex: 1,
        padding: 10,
    },
    itemTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 5,
    },
    configText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    quantityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    quantityLabel: {
        fontSize: 16,
        marginRight: 10,
    },
    priceText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    editButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 6,
    },
    removeButton: {
        backgroundColor: '#FF6347',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});
