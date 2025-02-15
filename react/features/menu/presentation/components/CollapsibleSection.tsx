// pizza-shack/react/core/components/CollapsibleSection.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CollapsibleSectionProps {
    title: string;
    children: React.ReactNode;
}

export default function CollapsibleSection({ title, children }: CollapsibleSectionProps) {
    const [expanded, setExpanded] = useState(false);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                <Text style={styles.title}>{title}</Text>
            </TouchableOpacity>
            {expanded && <View style={styles.content}>{children}</View>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        paddingVertical: 10,
    },
    content: {
        paddingLeft: 10,
    },
});
