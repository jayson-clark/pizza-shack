// pizza-shack/react/features/menu/presentation/screens/CategoryScreen.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import Card from '../components/Card';
import BackButtonHeader from '../../../../core/components/BackButtonHeader';
import useMenuData from '../../../../core/hooks/useMenuData';
import { Category } from '../../models/menuData';

export default function CategoryScreen() {
    const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
    const { menuData, loading, error } = useMenuData();

    if (loading) {
        return (
            <View style={styles.container}>
                <BackButtonHeader to='/menu' />
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <BackButtonHeader to='/menu' />
                <Text>Error loading categories.</Text>
            </View>
        );
    }

    const category: Category | undefined = menuData.find((cat) => cat.id === categoryId);

    if (!category) {
        return (
            <View style={styles.container}>
                <BackButtonHeader to='/menu' />
                <Text>Category not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <BackButtonHeader to='/menu' />
            <Text style={styles.title}>{category.title}</Text>
            <Text style={styles.description}>{category.description}</Text>
            <FlatList
                data={category.items}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Link href={`/menu/item/${item.id}`} style={styles.cardLink}>
                        <Card image={item.image} title={item.title} description={item.description} />
                    </Link>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    description: {
        fontSize: 16,
        marginBottom: 20,
    },
    cardLink: {
        textDecorationLine: 'none',
    },
});
