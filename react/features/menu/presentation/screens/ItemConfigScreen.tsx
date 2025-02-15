// pizza-shack/react/features/menu/presentation/screens/ItemConfigScreen.tsx
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    Alert,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MenuItem, ConfigSection, ConfigOption } from '../../models/menuData';
import BackButtonHeader from '../../../../core/components/BackButtonHeader';
import Counter from '../../../../core/components/Counter';
import Checkbox from 'expo-checkbox';
import { useShoppingBag } from '../../../../core/context/ShoppingBagContext';
import useMenuData from '../../../../core/hooks/useMenuData';

interface ConfigState {
    // For each section, store a mapping from option id to either:
    // - boolean (for flat mode or individual mode when allowMultiple is false)
    // - number (for individual mode when allowMultiple is true)
    [sectionId: string]: {
        [optionId: string]: boolean | number;
    };
}

export default function ItemConfigScreen() {
    const { itemId } = useLocalSearchParams<{ itemId: string }>();
    const router = useRouter();
    const { addItem } = useShoppingBag();
    const { menuData, loading, error } = useMenuData();

    // Flatten all items from all categories fetched from Firestore
    const allItems: MenuItem[] = menuData.flatMap((cat) => cat.items);
    const item = allItems.find((it) => it.id === itemId);

    // State to hold the user's configuration choices
    const [configState, setConfigState] = useState<ConfigState>({});
    // State to hold the quantity of the item
    const [quantity, setQuantity] = useState<number>(1);

    // Initialize config state based on the item's configSections,
    // taking into account option.allowMultiple.
    useEffect(() => {
        if (item?.configSections) {
            const initialState: ConfigState = {};
            item.configSections.forEach((section) => {
                initialState[section.id] = {};
                section.options.forEach((option) => {
                    let initialVal: boolean | number;
                    if (section.pricingMode === 'flat') {
                        initialVal = false;
                    } else {
                        // pricingMode "individual"
                        if (option.allowMultiple) {
                            initialVal = 0;
                        } else {
                            initialVal = false;
                        }
                    }
                    initialState[section.id][option.id] = initialVal;
                });
            });
            setConfigState(initialState);
        }
    }, [item]);

    if (loading) {
        return (
            <View style={styles.container}>
                <BackButtonHeader to="/menu" />
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <BackButtonHeader to="/menu" />
                <Text>Error loading item data.</Text>
            </View>
        );
    }

    if (!item) {
        return (
            <View style={styles.container}>
                <BackButtonHeader to="/menu" />
                <Text>Item not found</Text>
            </View>
        );
    }

    // Validate that each config section meets its minimum selections requirement.
    const validateMinSelections = (): boolean => {
        let valid = true;
        item.configSections?.forEach((section) => {
            const min = section.minSelections ?? 0;
            const sectionState = configState[section.id] || {};
            let count = 0;
            section.options.forEach((option) => {
                if (section.pricingMode === 'flat' || (!option.allowMultiple && section.pricingMode === 'individual')) {
                    // For checkbox types, count 1 if true.
                    if (sectionState[option.id] === true) {
                        count += 1;
                    }
                } else if (option.allowMultiple && section.pricingMode === 'individual') {
                    // For counter types, count the number.
                    const num = typeof sectionState[option.id] === 'number' ? sectionState[option.id] as number : 0;
                    count += num;
                }
            });
            if (count < min) {
                valid = false;
            }
        });
        return valid;
    };

    // Calculate the single item price based on the selections
    const calculateSinglePrice = () => {
        let price = item.basePrice;
        if (item.configSections) {
            item.configSections.forEach((section) => {
                const sectionState = configState[section.id];
                if (sectionState) {
                    if (section.pricingMode === 'flat' && section.flatPrice) {
                        const selectedCount = Object.values(sectionState).filter(
                            (val) => val === true
                        ).length;
                        price += selectedCount * section.flatPrice;
                    } else if (section.pricingMode === 'individual') {
                        section.options.forEach((option) => {
                            const val = sectionState[option.id];
                            if (option.allowMultiple) {
                                const count = val as number;
                                if (option.price) {
                                    price += count * option.price;
                                }
                            } else {
                                const isSelected = val as boolean;
                                if (isSelected && option.price) {
                                    price += option.price;
                                }
                            }
                        });
                    }
                }
            });
        }
        return price;
    };

    // Calculate total price based on quantity
    const calculateTotalPrice = () => {
        const singlePrice = calculateSinglePrice();
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

            if (newValue === true && option.exclusiveGroup) {
                section.options.forEach((opt) => {
                    if (
                        opt.exclusiveGroup === option.exclusiveGroup &&
                        opt.id !== option.id
                    ) {
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

    // Handler for individual mode options rendered as counters (when allowMultiple is true)
    const handleIndividualOptionCounterChange = (
        section: ConfigSection,
        option: ConfigOption,
        newCount: number
    ) => {
        setConfigState((prev) => {
            const sectionState = prev[section.id] ? { ...prev[section.id] } : {};

            if (section.maxSelections) {
                const currentTotal = Object.entries(sectionState).reduce(
                    (sum, [key, value]) => (typeof value === 'number' ? sum + value : sum),
                    0
                );
                const oldCount = (sectionState[option.id] as number) || 0;
                if (currentTotal - oldCount + newCount > section.maxSelections) {
                    Alert.alert(
                        'Selection Limit Exceeded',
                        `You can select up to ${section.maxSelections} options in ${section.title}.`
                    );
                    return prev;
                }
            }

            if (newCount > 0 && option.exclusiveGroup) {
                section.options.forEach((opt) => {
                    if (
                        opt.exclusiveGroup === option.exclusiveGroup &&
                        opt.id !== option.id &&
                        opt.allowMultiple
                    ) {
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

    // Handler for individual mode options rendered as checkboxes (when allowMultiple is false)
    const handleIndividualOptionCheckboxChange = (
        section: ConfigSection,
        option: ConfigOption,
        newValue: boolean
    ) => {
        setConfigState((prev) => {
            const sectionState = prev[section.id] ? { ...prev[section.id] } : {};

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

            if (newValue === true && option.exclusiveGroup) {
                section.options.forEach((opt) => {
                    if (
                        opt.exclusiveGroup === option.exclusiveGroup &&
                        opt.id !== option.id
                    ) {
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

    const handleAddToBag = () => {
        if (!validateMinSelections()) {
            Alert.alert('Minimum Selection Requirement Not Met', 'Please ensure you have selected the minimum required options for all sections.');
            return;
        }
        const singlePrice = calculateSinglePrice();
        const totalPrice = quantity * singlePrice;
        const bagItem = {
            id: `${item.id}-${Date.now()}`,
            item,
            config: configState,
            quantity,
            totalPrice,
        };
        addItem(bagItem);
        Alert.alert('Added to Bag', `${item.title} has been added to your bag.`);
        router.push('/menu');
    };

    return (
        <View style={styles.container}>
            <BackButtonHeader to="/menu" />
            <Image source={item.image} style={styles.itemImage} resizeMode="cover" />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.basePrice}>
                Base Price: ${item.basePrice.toFixed(2)}
            </Text>
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
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>
                                    {section.title}
                                </Text>
                                {(section.minSelections !== undefined || section.maxSelections !== undefined) && (
                                    <Text style={styles.selectionInfo}>
                                        {`(Min: ${section.minSelections ?? 0}, Max: ${section.maxSelections ?? '-'})`}
                                    </Text>
                                )}
                            </View>
                            {section.pricingMode === 'flat'
                                ? section.options.map((option) => {
                                    const isSelected =
                                        configState[section.id] &&
                                            configState[section.id][option.id]
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
                                                {option.label} (+$
                                                {section.flatPrice?.toFixed(2)})
                                            </Text>
                                        </View>
                                    );
                                })
                                : section.options.map((option) => {
                                    if (option.allowMultiple) {
                                        const count =
                                            configState[section.id] &&
                                                typeof configState[section.id][option.id] === 'number'
                                                ? (configState[section.id][option.id] as number)
                                                : 0;
                                        return (
                                            <View key={option.id} style={styles.optionRow}>
                                                <Text style={styles.optionLabel}>
                                                    {option.label} (+$
                                                    {option.price?.toFixed(2)})
                                                </Text>
                                                <Counter
                                                    count={count}
                                                    onChange={(newCount) =>
                                                        handleIndividualOptionCounterChange(section, option, newCount)
                                                    }
                                                />
                                            </View>
                                        );
                                    } else {
                                        const isSelected =
                                            configState[section.id] &&
                                                configState[section.id][option.id]
                                                ? (configState[section.id][option.id] as boolean)
                                                : false;
                                        return (
                                            <View key={option.id} style={styles.optionRow}>
                                                <Checkbox
                                                    value={isSelected}
                                                    onValueChange={(newValue) =>
                                                        handleIndividualOptionCheckboxChange(section, option, newValue)
                                                    }
                                                    style={styles.checkbox}
                                                />
                                                <Text style={styles.optionLabel}>
                                                    {option.label} (+$
                                                    {option.price?.toFixed(2)})
                                                </Text>
                                            </View>
                                        );
                                    }
                                })}
                        </View>
                    )}
                />
            )}
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>
                    Total Price: ${calculateTotalPrice()}
                </Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={handleAddToBag}>
                <Text style={styles.addButtonText}>Add to Bag</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: '#f2f2f2' },
    itemImage: { width: '100%', height: 200, borderRadius: 8, marginBottom: 10 },
    title: { fontSize: 28, fontWeight: 'bold', marginVertical: 10, textAlign: 'center' },
    basePrice: { fontSize: 18, marginBottom: 10, textAlign: 'center' },
    quantityContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
    quantityLabel: { fontSize: 18, marginRight: 10 },
    sectionContainer: { marginVertical: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', backgroundColor: '#fff', borderRadius: 8, padding: 10 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    sectionTitle: { fontSize: 22, fontWeight: '600' },
    selectionInfo: { fontSize: 14, color: '#555', marginLeft: 10 },
    optionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8 },
    checkbox: { marginRight: 10 },
    optionLabel: { fontSize: 18, flex: 1 },
    totalContainer: { marginTop: 20, alignItems: 'center' },
    totalText: { fontSize: 24, fontWeight: 'bold' },
    addButton: { backgroundColor: '#ff6347', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 8, marginVertical: 20, alignItems: 'center', alignSelf: 'center', width: '90%' },
    addButtonText: { color: '#fff', fontSize: 20, fontWeight: '600' },
});
