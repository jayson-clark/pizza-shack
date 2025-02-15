// pizza-shack/react/features/menu-editor/MenuEditorScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import BackButtonHeader from '../../core/components/BackButtonHeader';
import Card from '../../features/menu/presentation/components/Card';
import useMenuData from '../../core/hooks/useMenuData';

export default function MenuEditorScreen() {
    const { menuData, loading, error } = useMenuData();
    const router = useRouter();

    if (loading) {
        return (
            <View style={styles.container}>
                <BackButtonHeader to="/" />
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }
    if (error) {
        return (
            <View style={styles.container}>
                <BackButtonHeader to="/" />
                <Text>Error loading menu data.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <BackButtonHeader to="/" />
            <Text style={styles.header}>Menu Editor</Text>
            <FlatList
                data={menuData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => router.push(`/menu-editor/edit-category/${item.id}`)}>
                        <Card image={item.image} title={item.title} description={item.description} />
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No categories available.</Text>}
            />
            <TouchableOpacity style={styles.addButton} onPress={() => router.push('/menu-editor/edit-category/new')}>
                <Text style={styles.addButtonText}>Add New Category</Text>
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
