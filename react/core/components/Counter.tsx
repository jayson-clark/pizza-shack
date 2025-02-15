// pizza-shack/react/core/components/Counter.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CounterProps {
    count: number;
    onChange: (newCount: number) => void;
}

export default function Counter({ count, onChange }: CounterProps) {
    return (
        <View style={styles.counterContainer}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => onChange(Math.max(0, count - 1))}
            >
                <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.countText}>{count}</Text>
            <TouchableOpacity style={styles.button} onPress={() => onChange(count + 1)}>
                <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#ddd',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 4,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
    },
    countText: {
        marginHorizontal: 10,
        fontSize: 18,
    },
});
