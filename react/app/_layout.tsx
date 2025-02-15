import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Slot } from 'expo-router';
import { ShoppingBagProvider } from '../core/context/ShoppingBagContext';

export default function RootLayout() {
    return (
        <ShoppingBagProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <Slot />
                </View>
            </SafeAreaView>
        </ShoppingBagProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
});
