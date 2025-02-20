// pizza-shack/react/features/menu-editor/EditItemScreen.tsx
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    ScrollView,
    FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import BackButtonHeader from '../../core/components/BackButtonHeader';
import { addItemToCategory, updateItemInCategory } from '../../core/services/menuService';
import useMenuData from '../../core/hooks/useMenuData';
import { MenuItem, ConfigSection } from '../models/menuData';

export default function EditItemScreen() {
    const { categoryId, itemId } = useLocalSearchParams<{ categoryId: string; itemId: string }>();
    const router = useRouter();
    const { menuData, loading, error } = useMenuData();
    const isNew = itemId === 'new';

    // Basic item fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [basePrice, setBasePrice] = useState('');
    // Local config sections state (we no longer edit these inline)
    const [configSections, setConfigSections] = useState<ConfigSection[]>([]);

    // When editing an existing item, load its data from Firestore
    useEffect(() => {
        if (!isNew && !loading && !error) {
            const category = menuData.find((cat) => cat.id === categoryId);
            if (category) {
                const item = category.items.find((it: MenuItem) => it.id === itemId);
                if (item) {
                    setTitle(item.title);
                    setDescription(item.description);
                    setImage(item.image);
                    setBasePrice(item.basePrice.toString());
                    setConfigSections(item.configSections || []);
                }
            }
        }
    }, [isNew, loading, error, categoryId, itemId, menuData]);

    const handleSave = async () => {
        if (!title || !description || !image || !basePrice) {
            Alert.alert('Please fill all item details.');
            return;
        }
        const newItem: MenuItem = {
            id: isNew ? Date.now().toString() : itemId,
            title,
            description,
            image,
            basePrice: parseFloat(basePrice),
            configSections,
        };
        try {
            if (isNew) {
                await addItemToCategory(categoryId, newItem);
                Alert.alert('Item created.');
            } else {
                await updateItemInCategory(categoryId, newItem);
                Alert.alert('Item updated.');
            }
            router.push(`/menu-editor/edit-category/${categoryId}`);
        } catch (err) {
            Alert.alert('Error saving item.');
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <BackButtonHeader to={`/menu-editor/edit-category/${categoryId}`} />
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }
    if (error) {
        return (
            <View style={styles.container}>
                <BackButtonHeader to={`/menu-editor/edit-category/${categoryId}`} />
                <Text>Error loading item.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <BackButtonHeader to={`/menu-editor/edit-category/${categoryId}`} />
            <Text style={styles.header}>{isNew ? 'Add New Item' : 'Edit Item'}</Text>
            <TextInput
                style={styles.input}
                placeholder="Item Title"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={styles.input}
                placeholder="Item Description"
                value={description}
                onChangeText={setDescription}
            />
            <TextInput
                style={styles.input}
                placeholder="Image URL"
                value={image}
                onChangeText={setImage}
            />
            <TextInput
                style={styles.input}
                placeholder="Base Price"
                value={basePrice}
                onChangeText={setBasePrice}
                keyboardType="numeric"
            />

            <Text style={styles.subHeader}>Config Sections</Text>
            {configSections.length === 0 ? (
                <Text style={styles.emptyText}>No config sections yet.</Text>
            ) : (
                <FlatList
                    data={configSections}
                    keyExtractor={(section) => section.id}
                    renderItem={({ item: section }) => (
                        <TouchableOpacity
                            style={styles.sectionCard}
                            onPress={() =>
                                router.push(
                                    `/menu-editor/edit-item/${categoryId}/${itemId}/edit-config-section/${section.id}`
                                )
                            }
                        >
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                            <Text style={styles.sectionDetails}>
                                Mode: {section.pricingMode} | Min: {section.minSelections ?? 0} | Max:{' '}
                                {section.maxSelections ?? '-'}{' '}
                                {section.pricingMode === 'flat' && section.flatPrice !== undefined
                                    ? `| Flat Price: $${section.flatPrice.toFixed(2)}`
                                    : ''}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            )}

            <TouchableOpacity
                style={styles.addButton}
                onPress={() =>
                    router.push(
                        `/menu-editor/edit-item/${categoryId}/${itemId}/edit-config-section/new`
                    )
                }
            >
                <Text style={styles.addButtonText}>Add New Config Section</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>{isNew ? 'Create Item' : 'Save Item'}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: '#f2f2f2' },
    header: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
    subHeader: { fontSize: 22, fontWeight: '600', marginVertical: 10 },
    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginVertical: 8,
    },
    emptyText: { textAlign: 'center', marginVertical: 10, fontSize: 16, color: '#888' },
    sectionCard: {
        backgroundColor: '#eaeaea',
        padding: 12,
        borderRadius: 8,
        marginVertical: 6,
    },
    sectionTitle: { fontSize: 20, fontWeight: '600' },
    sectionDetails: { fontSize: 16, color: '#555', marginTop: 4 },
    addButton: {
        backgroundColor: '#17a2b8',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    addButtonText: { color: '#fff', fontSize: 18 },
    saveButton: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 20,
    },
    saveButtonText: { color: '#fff', fontSize: 18 },
});
