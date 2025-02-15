// pizza-shack/react/features/home/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import globalStyles from '../../core/styles/globalStyles';

export default function HomeScreen() {
    return (
        <View style={[styles.container, globalStyles.container]}>
            <Image
                source={require('../../assets/logo_text.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <View style={styles.statusSection}>
                <Text style={styles.statusText}>Store is Open</Text>
                <Text style={styles.hoursText}>Hours: 10 AM - 10 PM</Text>
            </View>
            <TouchableOpacity style={styles.menuButton}>
                <Link href="/menu" style={styles.menuButtonText}>
                    View Menu
                </Link>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bagButton}>
                <Link href="/bag" style={styles.bagButtonText}>
                    View Bag
                </Link>
            </TouchableOpacity>
            {/* New button for Menu Editor */}
            <TouchableOpacity style={styles.editorButton}>
                <Link href="/menu-editor" style={styles.editorButtonText}>
                    Menu Editor
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
        backgroundColor: '#f7f7f7',
    },
    logo: {
        width: '100%',
        height: 200,
        marginBottom: 20,
    },
    statusSection: {
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        width: '90%',
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
    menuButton: {
        backgroundColor: '#ff6347',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        width: '90%',
        alignItems: 'center',
        marginBottom: 10,
    },
    menuButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
        textDecorationLine: 'none',
    },
    bagButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        width: '90%',
        alignItems: 'center',
        marginBottom: 10,
    },
    bagButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
        textDecorationLine: 'none',
    },
    editorButton: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        width: '90%',
        alignItems: 'center',
        marginBottom: 10,
    },
    editorButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
        textDecorationLine: 'none',
    },
});
