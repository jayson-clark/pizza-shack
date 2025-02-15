// pizza-shack/react/core/components/BackButtonHeader.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface BackButtonHeaderProps {
    to?: string;
}

export default function BackButtonHeader({ to }: BackButtonHeaderProps) {
    const router = useRouter();

    const handlePress = () => {
        if (to) {
            router.push(to);
        } else {
            router.back();
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handlePress} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        marginBottom: 10,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
