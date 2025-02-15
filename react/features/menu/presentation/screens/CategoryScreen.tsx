import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import Card from '../components/Card';
import { categories } from '../../models/menuData';
import BackButtonHeader from '../../../../core/components/BackButtonHeader';

export default function CategoryScreen() {
    const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
    const category = categories.find((cat) => cat.id === categoryId);

    if (!category) {
        return (
            <View style={styles.container}>
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
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Link href={`/menu/item/${item.id}`} style={styles.cardLink}>
                        <Card
                            image={item.image}
                            title={item.title}
                            description={item.description}
                        />
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
