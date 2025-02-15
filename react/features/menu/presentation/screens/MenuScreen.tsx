// pizza-shack/react/features/menu/presentation/screens/MenuScreen.tsx
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import Card from '../components/Card';
import { categories } from '../../models/menuData';
import BackButtonHeader from '../components/BackButtonHeader';

export default function MenuScreen() {
    return (
        <View style={styles.container}>
            <BackButtonHeader />
            <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Link href={`/menu/category/${item.id}`} style={styles.cardLink}>
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
    cardLink: {
        textDecorationLine: 'none',
    },
});
