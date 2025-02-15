// pizza-shack/react/features/menu/presentation/screens/ItemConfigScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { categories, MenuItem, ConfigSection, ConfigOption } from '../../models/menuData';
import BackButtonHeader from '../components/BackButtonHeader';
import Counter from '../components/Counter';
import Checkbox from 'expo-checkbox';

interface ConfigState {
    // For each section, we store a mapping from option id to either:
    // - boolean (for flat mode)
    // - number (for individual mode)
    [sectionId: string]: {
        [optionId: string]: boolean | number;
    };
}

export default function ItemConfigScreen() {
    const { itemId } = useLocalSearchParams<{ itemId: string }>();

    // Flatten all items from all categories
    const allItems: MenuItem[] = categories.flatMap((cat) => cat.items);
    const item = allItems.find((it) => it.id === itemId);

    // State to hold the user's configuration choices
    const [configState, setConfigState] = useState<ConfigState>({});
    // State to hold the quantity of the item
    const [quantity, setQuantity] = useState<number>(1);

    // Initialize config state based on the item's configSections
    useEffect(() => {
        if (item?.configSections) {
            const initialState: ConfigState = {};
            item.configSections.forEach((section) => {
                initialState[section.id] = {};
                section.options.forEach((option) => {
                    initialState[section.id][option.id] =
                        section.pricingMode === 'flat' ? false : 0;
                });
            });
            setConfigState(initialState);
        }
    }, [item]);

    if (!item) {
        return (
            <View style={styles.container}>
                <Text>Item not found</Text>
            </View>
        );
    }

    // Calculate the total price based on the selections and quantity
    const calculateTotalPrice = () => {
        let singlePrice = item.basePrice;
        if (item.configSections) {
            item.configSections.forEach((section) => {
                const sectionState = configState[section.id];
                if (sectionState) {
                    if (section.pricingMode === 'flat' && section.flatPrice) {
                        // Count how many options are selected
                        const selectedCount = Object.values(sectionState).filter(
                            (val) => val === true
                        ).length;
                        singlePrice += selectedCount * section.flatPrice;
                    } else if (section.pricingMode === 'individual') {
                        // Sum the counters multiplied by each option's price
                        section.options.forEach((option) => {
                            const count = sectionState[option.id] as number;
                            if (option.price) {
                                singlePrice += count * option.price;
                            }
                        });
                    }
                }
            });
        }
        return (quantity * singlePrice).toFixed(2);
    };

    // Handler for flat mode (checkbox) option changes
    const handleFlatOptionChange = (
        section: ConfigSection,
        option: ConfigOption,
        newValue: boolean
    ) => {
        setConfigState((prev) => {
            const sectionState = prev[section.id] ? { ...prev[section.id] } : {};

            // If maxSelections is defined, count current selections excluding the one being toggled off.
            if (section.maxSelections && newValue === true) {
                const currentSelections = Object.entries(sectionState).filter(
                    ([key, val]) => val === true && key !== option.id
                ).length;
                if (currentSelections >= section.maxSelections) {
                    Alert.alert(
                        'Selection Limit Reached',
                        `You can select up to ${section.maxSelections} options in ${section.title}.`
                    );
                    return prev;
                }
            }

            // If the option belongs to an exclusive group and is being set to true, unselect others in the same group.
            if (newValue === true && option.exclusiveGroup) {
                section.options.forEach((opt) => {
                    if (opt.exclusiveGroup === option.exclusiveGroup && opt.id !== option.id) {
                        sectionState[opt.id] = false;
                    }
                });
            }

            return {
                ...prev,
                [section.id]: {
                    ...sectionState,
                    [option.id]: newValue,
                },
            };
        });
    };

    // Handler for individual mode (counter) option changes
    const handleIndividualOptionChange = (
        section: ConfigSection,
        option: ConfigOption,
        newCount: number
    ) => {
        setConfigState((prev) => {
            const sectionState = prev[section.id] ? { ...prev[section.id] } : {};

            // If maxSelections is defined, calculate total count in this section excluding current option.
            if (section.maxSelections) {
                const currentTotal = Object.entries(sectionState).reduce(
                    (sum, [key, value]) =>
                        key === option.id ? sum : sum + (value as number),
                    0
                );
                if (currentTotal + newCount > section.maxSelections) {
                    Alert.alert(
                        'Selection Limit Exceeded',
                        `You can select up to ${section.maxSelections} options in ${section.title}.`
                    );
                    return prev;
                }
            }

            // For exclusive groups in individual mode, if newCount > 0, reset others in the same group.
            if (newCount > 0 && option.exclusiveGroup) {
                section.options.forEach((opt) => {
                    if (opt.exclusiveGroup === option.exclusiveGroup && opt.id !== option.id) {
                        sectionState[opt.id] = 0;
                    }
                });
            }

            return {
                ...prev,
                [section.id]: {
                    ...sectionState,
                    [option.id]: newCount,
                },
            };
        });
    };

    return (
        <View style={styles.container}>
            <BackButtonHeader />
            <Image source={item.image} style={styles.itemImage} resizeMode="cover" />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.basePrice}>Base Price: ${item.basePrice.toFixed(2)}</Text>
            <View style={styles.quantityContainer}>
                <Text style={styles.quantityLabel}>Quantity:</Text>
                <Counter count={quantity} onChange={setQuantity} />
            </View>
            {item.configSections && item.configSections.length > 0 && (
                <FlatList
                    data={item.configSections}
                    keyExtractor={(section) => section.id}
                    renderItem={({ item: section }) => (
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                            {section.pricingMode === 'flat'
                                ? section.options.map((option) => {
                                    const isSelected =
                                        configState[section.id] && configState[section.id][option.id]
                                            ? (configState[section.id][option.id] as boolean)
                                            : false;
                                    return (
                                        <View key={option.id} style={styles.optionRow}>
                                            <Checkbox
                                                value={isSelected}
                                                onValueChange={(newValue) =>
                                                    handleFlatOptionChange(section, option, newValue)
                                                }
                                                style={styles.checkbox}
                                            />
                                            <Text style={styles.optionLabel}>
                                                {option.label} (+${section.flatPrice?.toFixed(2)})
                                            </Text>
                                        </View>
                                    );
                                })
                                : section.options.map((option) => {
                                    const count =
                                        configState[section.id] && configState[section.id][option.id]
                                            ? (configState[section.id][option.id] as number)
                                            : 0;
                                    return (
                                        <View key={option.id} style={styles.optionRow}>
                                            <Text style={styles.optionLabel}>
                                                {option.label} (+${option.price?.toFixed(2)})
                                            </Text>
                                            <Counter
                                                count={count}
                                                onChange={(newCount) =>
                                                    handleIndividualOptionChange(section, option, newCount)
                                                }
                                            />
                                        </View>
                                    );
                                })}
                        </View>
                    )}
                />
            )}
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Total Price: ${calculateTotalPrice()}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f2f2f2',
    },
    itemImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginVertical: 10,
        textAlign: 'center',
    },
    basePrice: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    quantityLabel: {
        fontSize: 18,
        marginRight: 10,
    },
    sectionContainer: {
        marginVertical: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 5,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    checkbox: {
        marginRight: 10,
    },
    optionLabel: {
        fontSize: 18,
        flex: 1,
    },
    totalContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    totalText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});
