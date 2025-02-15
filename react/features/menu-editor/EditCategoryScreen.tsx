// pizza-shack/react/features/menu-editor/EditCategoryScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BackButtonHeader from '../../core/components/BackButtonHeader';
import Card from '../../features/menu/presentation/components/Card';
import useMenuData from '../../core/hooks/useMenuData';
import { addCategory, updateCategory } from '../../core/services/menuService';

export default function EditCategoryScreen() {
    const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
    const router = useRouter();
    const { menuData, loading, error } = useMenuData();

    const isNew = categoryId === 'new';
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        if (!isNew && !loading && !error) {
            const category = menuData.find((cat) => cat.id === categoryId);
            if (category) {
                setTitle(category.title);
                setDescription(category.description);
                setImage(category.image);
                setItems(category.items || []);
            }
        }
    }, [categoryId, isNew, menuData, loading, error]);

    const handleSave = async () => {
        if (!title || !description || !image) {
            Alert.alert('Please fill all category details.');
            return;
        }
        try {
            if (isNew) {
                const newCategoryId = await addCategory({ title, description, image });
                Alert.alert('Category created.');
                router.push(`/menu-editor/edit-category/${newCategoryId}`);
            } else {
                await updateCategory(categoryId, { title, description, image });
                Alert.alert('Category updated.');
            }
        } catch (err) {
            Alert.alert('Error saving category.');
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <BackButtonHeader to="/menu-editor" />
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }
    if (error) {
        return (
            <View style={styles.container}>
                <BackButtonHeader to="/menu-editor" />
                <Text>Error loading category.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <BackButtonHeader to="/menu-editor" />
            <Text style={styles.header}>Edit Category</Text>
            <TextInput
                style={styles.input}
                placeholder="Category Title"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={styles.input}
                placeholder="Category Description"
                value={description}
                onChangeText={setDescription}
            />
            <TextInput
                style={styles.input}
                placeholder="Image URL"
                value={image}
                onChangeText={setImage}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>{isNew ? 'Create Category' : 'Save Category'}</Text>
            </TouchableOpacity>
            <Text style={styles.subHeader}>Items in this Category</Text>
            <FlatList
                data={items}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => router.push(`/menu-editor/edit-item/${categoryId}/${item.id}`)}>
                        <Card image={item.image} title={item.title} description={item.description} />
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No items yet.</Text>}
            />
            <TouchableOpacity style={styles.addButton} onPress={() => router.push(`/menu-editor/edit-item/${categoryId}/new`)}>
                <Text style={styles.addButtonText}>Add New Item</Text>
            </TouchableOpacity>
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
    subHeader: {
        fontSize: 22,
        fontWeight: '600',
        marginVertical: 10,
    },
    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginVertical: 8,
    },
    saveButton: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    emptyText: {
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 16,
        color: '#888',
    },
    addButton: {
        backgroundColor: '#28a745',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});
