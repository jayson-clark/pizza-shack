// pizza-shack/react/core/components/Card.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface CardProps {
    image: any;
    title: string;
    description: string;
}

export default function Card({ image, title, description }: CardProps) {
    return (
        <View style={styles.card}>
            <Image source={image} style={styles.cardImage} />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardDescription}>{description}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        marginVertical: 10,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Make card nearly full-width with a bit of horizontal margin
        marginHorizontal: 10,
        width: '95%',
        alignSelf: 'center',
    },
    cardImage: {
        width: 120,
        height: 120,
    },
    cardContent: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 5,
    },
    cardDescription: {
        fontSize: 14,
        color: '#666',
    },
});
