// pizza-shack/react/app/_layout.tsx
import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Slot } from 'expo-router';

export default function RootLayout() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Slot />
            </View>
        </SafeAreaView>
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
