import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import globalStyles from '../../core/styles/globalStyles';

export default function HomeScreen() {
    return (
        <View style={[styles.container, globalStyles.container]}>
            {/* Logo */}
            <Image
                source={require('../../assets/logo_text.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            {/* Store Status */}
            <View style={styles.statusSection}>
                <Text style={styles.statusText}>Store is Open</Text>
                <Text style={styles.hoursText}>Hours: 10 AM - 10 PM</Text>
            </View>

            {/* Button to open menu page */}
            <TouchableOpacity style={styles.menuButton}>
                <Link href="/menu" style={styles.menuButtonText}>
                    View Menu
                </Link>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    logo: {
        width: '100%',
        height: 200,
    },
    statusSection: {
        alignItems: 'center',
    },
    statusText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'green',
    },
    hoursText: {
        fontSize: 16,
        color: '#555',
    },
    menuButton: {
        backgroundColor: '#ff6347',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    menuButtonText: {
        color: '#fff',
        fontSize: 18,
        textDecorationLine: 'none',
    },
});
