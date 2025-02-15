// pizza-shack/react/features/menu/presentation/screens/MenuScreen.tsx
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import Card from '../components/Card';
import useMenuData from '../../../../core/hooks/useMenuData';
import BackButtonHeader from '../../../../core/components/BackButtonHeader';

export default function MenuScreen() {
    const { menuData, loading, error } = useMenuData();

    if (loading) {
        return (
            <View style={styles.container}>
                <BackButtonHeader to="/" />
                <Card image={require('../../../../assets/logo.png')} title="Loading..." description="Please wait" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <BackButtonHeader to="/" />
                <Card image={require('../../../../assets/logo.png')} title="Error" description="Failed to load menu" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <BackButtonHeader to="/" />
            <FlatList
                data={menuData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Link href={`/menu/category/${item.id}`} style={styles.cardLink}>
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
    cardLink: {
        textDecorationLine: 'none',
    },
});
