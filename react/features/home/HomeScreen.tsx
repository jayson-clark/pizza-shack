import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import globalStyles from '../../core/styles/globalStyles';
import { useShoppingBag } from '../../core/context/ShoppingBagContext';

export default function HomeScreen() {
    const router = useRouter();
    const { bagItems } = useShoppingBag();
    const buttonText = bagItems.length === 0 ? "Start new order" : "Continue order";

    return (
        <SafeAreaView style={[styles.safeContainer, globalStyles.container]}>
            <View style={styles.header}>
                <View style={{ width: 28 }} /> {/* Placeholder for symmetry on the left */}
                <TouchableOpacity onPress={() => router.push('/account')}>
                    <Ionicons name="person-circle-outline" size={28} color="#333" />
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <Image
                    source={require('../../assets/logo_text.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <View style={styles.statusSection}>
                    <Text style={styles.statusText}>Store is Open</Text>
                    <Text style={styles.hoursText}>Hours: 10 AM - 10 PM</Text>
                </View>
                <TouchableOpacity style={styles.orderButton} onPress={() => router.push('/menu')}>
                    <Text style={styles.orderButtonText}>{buttonText}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: '#fff',
        elevation: 3,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    logo: {
        width: '100%',
        height: 150,
        marginBottom: 20,
    },
    statusSection: {
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        width: '100%',
        marginBottom: 20,
    },
    statusText: {
        fontSize: 26,
        fontWeight: '700',
        color: 'green',
        marginBottom: 5,
    },
    hoursText: {
        fontSize: 18,
        color: '#555',
    },
    orderButton: {
        backgroundColor: '#ff6347',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        width: '100%',
        alignItems: 'center',
    },
    orderButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
    },
});
