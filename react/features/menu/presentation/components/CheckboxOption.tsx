// pizza-shack/react/core/components/CheckboxOption.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Checkbox from 'expo-checkbox';

interface CheckboxOptionProps {
    label: string;
}

export default function CheckboxOption({ label }: CheckboxOptionProps) {
    const [checked, setChecked] = useState(false);

    return (
        <View style={styles.optionRow}>
            <Checkbox value={checked} onValueChange={setChecked} style={styles.checkbox} />
            <Text style={styles.label}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    checkbox: {
        marginRight: 10,
    },
    label: {
        fontSize: 18,
    },
});
