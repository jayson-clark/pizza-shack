import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Card from '../components/Card';
import useMenuData from '../../../../core/hooks/useMenuData';
import BackButtonHeader from '../../../../core/components/BackButtonHeader';
import { Ionicons } from '@expo/vector-icons';

export default function MenuScreen() {
    const { menuData, loading, error } = useMenuData();
    const router = useRouter();

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
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => router.push(`/menu/category/${item.id}`)} style={styles.cardLink}>
                        <Card image={item.image} title={item.title} description={item.description} />
                    </TouchableOpacity>
                )}
            />
            <TouchableOpacity style={styles.fab} onPress={() => router.push('/bag')}>
                <Ionicons name="bag-handle-outline" size={28} color="#fff" />
            </TouchableOpacity>
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
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#ff6347',
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
});
