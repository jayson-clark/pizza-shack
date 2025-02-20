// pizza-shack/react/features/menu-editor/EditConfigSectionScreen.tsx
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    ScrollView,
    FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BackButtonHeader from '../../core/components/BackButtonHeader';
import { updateItemInCategory, addItemToCategory } from '../../core/services/menuService';
import useMenuData from '../../core/hooks/useMenuData';
import { MenuItem, ConfigSection, ConfigOption } from '../models/menuData';

interface OptionInputProps {
    option: ConfigOption;
    onUpdate: (field: keyof ConfigOption, value: any) => void;
    onRemove: () => void;
}

function OptionInput({ option, onUpdate, onRemove }: OptionInputProps) {
    return (
        <View style={styles.optionContainer}>
            <TextInput
                style={styles.optionInput}
                placeholder="Option Label"
                value={option.label}
                onChangeText={(text) => onUpdate('label', text)}
            />
            {option.price !== undefined && (
                <TextInput
                    style={styles.optionInput}
                    placeholder="Price"
                    value={option.price.toString()}
                    onChangeText={(text) => onUpdate('price', parseFloat(text) || 0)}
                    keyboardType="numeric"
                />
            )}
            <TextInput
                style={styles.optionInput}
                placeholder="Exclusive Group"
                value={option.exclusiveGroup || ''}
                onChangeText={(text) => onUpdate('exclusiveGroup', text)}
            />
            <View style={styles.row}>
                <Text style={styles.label}>Allow Multiple:</Text>
                <TouchableOpacity
                    style={[
                        styles.toggleButton,
                        option.allowMultiple && styles.toggleButtonActive,
                    ]}
                    onPress={() => onUpdate('allowMultiple', !option.allowMultiple)}
                >
                    <Text style={styles.toggleButtonText}>
                        {option.allowMultiple ? 'Yes' : 'No'}
                    </Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={onRemove}>
                <Text style={styles.removeButtonText}>Remove Option</Text>
            </TouchableOpacity>
        </View>
    );
}

export default function EditConfigSectionScreen() {
    const { categoryId, itemId, sectionId } = useLocalSearchParams<{
        categoryId: string;
        itemId: string;
        sectionId: string;
    }>();
    const router = useRouter();
    const { menuData, loading, error } = useMenuData();
    const isNewSection = sectionId === 'new';

    // Local state for the config section fields
    const [sectionTitle, setSectionTitle] = useState('');
    const [pricingMode, setPricingMode] = useState<'flat' | 'individual'>('flat');
    const [flatPrice, setFlatPrice] = useState(0);
    const [minSelections, setMinSelections] = useState(0);
    const [maxSelections, setMaxSelections] = useState(0);
    const [options, setOptions] = useState<ConfigOption[]>([]);

    // Load the current item's config section if editing an existing section
    useEffect(() => {
        if (!loading && !error) {
            const category = menuData.find((cat) => cat.id === categoryId);
            if (category) {
                const item: MenuItem | undefined = category.items.find((it: MenuItem) => it.id === itemId);
                if (item) {
                    if (!isNewSection && item.configSections) {
                        const existingSection = item.configSections.find((sec) => sec.id === sectionId);
                        if (existingSection) {
                            setSectionTitle(existingSection.title);
                            setPricingMode(existingSection.pricingMode);
                            setFlatPrice(existingSection.flatPrice || 0);
                            setMinSelections(existingSection.minSelections || 0);
                            setMaxSelections(existingSection.maxSelections || 0);
                            setOptions(existingSection.options || []);
                        }
                    }
                }
            }
        }
    }, [loading, error, categoryId, itemId, sectionId, isNewSection, menuData]);

    const addOption = () => {
        const newOption: ConfigOption = {
            id: Date.now().toString(),
            label: 'New Option',
            price: pricingMode === 'individual' ? 0 : undefined,
            exclusiveGroup: '',
            allowMultiple: false,
        };
        setOptions([...options, newOption]);
    };

    const updateOption = (optionId: string, field: keyof ConfigOption, value: any) => {
        setOptions((prev) =>
            prev.map((opt) => (opt.id === optionId ? { ...opt, [field]: value } : opt))
        );
    };

    const removeOption = (optionId: string) => {
        setOptions((prev) => prev.filter((opt) => opt.id !== optionId));
    };

    const handleSave = async () => {
        if (!sectionTitle) {
            Alert.alert('Please enter a section title.');
            return;
        }
        // Build the updated config section object
        const updatedSection: ConfigSection = {
            id: isNewSection ? Date.now().toString() : sectionId,
            title: sectionTitle,
            pricingMode,
            flatPrice: pricingMode === 'flat' ? flatPrice : undefined,
            minSelections,
            maxSelections,
            options,
        };

        // Retrieve the current item from the menu data
        const category = menuData.find((cat) => cat.id === categoryId);
        if (!category) {
            Alert.alert('Category not found.');
            return;
        }
        const itemIndex = category.items.findIndex((it: MenuItem) => it.id === itemId);
        if (itemIndex === -1) {
            Alert.alert('Item not found.');
            return;
        }
        const item = category.items[itemIndex];

        // Update the item's configSections array
        let updatedConfigSections: ConfigSection[] = item.configSections ? [...item.configSections] : [];
        if (isNewSection) {
            updatedConfigSections.push(updatedSection);
        } else {
            updatedConfigSections = updatedConfigSections.map((sec) =>
                sec.id === sectionId ? updatedSection : sec
            );
        }

        // Create the updated item
        const updatedItem: MenuItem = {
            ...item,
            configSections: updatedConfigSections,
        };

        try {
            await updateItemInCategory(categoryId, updatedItem);
            Alert.alert('Config section saved.');
            router.back();
        } catch (err) {
            Alert.alert('Error saving config section.');
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <BackButtonHeader to={`/menu-editor/edit-item/${categoryId}/${itemId}`} />
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }
    if (error) {
        return (
            <View style={styles.container}>
                <BackButtonHeader to={`/menu-editor/edit-item/${categoryId}/${itemId}`} />
                <Text>Error loading data.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <BackButtonHeader to={`/menu-editor/edit-item/${categoryId}/${itemId}`} />
            <Text style={styles.header}>
                {isNewSection ? 'Add New Config Section' : 'Edit Config Section'}
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Section Title"
                value={sectionTitle}
                onChangeText={setSectionTitle}
            />
            <View style={styles.row}>
                <Text style={styles.label}>Pricing Mode:</Text>
                <TouchableOpacity
                    style={[styles.modeButton, pricingMode === 'flat' && styles.modeButtonActive]}
                    onPress={() => setPricingMode('flat')}
                >
                    <Text style={styles.modeButtonText}>Flat</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.modeButton,
                        pricingMode === 'individual' && styles.modeButtonActive,
                    ]}
                    onPress={() => setPricingMode('individual')}
                >
                    <Text style={styles.modeButtonText}>Individual</Text>
                </TouchableOpacity>
            </View>
            {pricingMode === 'flat' && (
                <TextInput
                    style={styles.input}
                    placeholder="Flat Price"
                    value={flatPrice.toString()}
                    onChangeText={(text) => setFlatPrice(parseFloat(text) || 0)}
                    keyboardType="numeric"
                />
            )}
            <TextInput
                style={styles.input}
                placeholder="Min Selections"
                value={minSelections.toString()}
                onChangeText={(text) => setMinSelections(parseInt(text) || 0)}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Max Selections"
                value={maxSelections.toString()}
                onChangeText={(text) => setMaxSelections(parseInt(text) || 0)}
                keyboardType="numeric"
            />

            <Text style={styles.subHeader}>Options</Text>
            {options.length === 0 ? (
                <Text style={styles.emptyText}>No options added yet.</Text>
            ) : (
                <FlatList
                    data={options}
                    keyExtractor={(opt) => opt.id}
                    renderItem={({ item: opt }) => (
                        <OptionInput
                            option={opt}
                            onUpdate={(field, value) => updateOption(opt.id, field, value)}
                            onRemove={() => removeOption(opt.id)}
                        />
                    )}
                />
            )}
            <TouchableOpacity style={styles.addButton} onPress={addOption}>
                <Text style={styles.addButtonText}>Add Option</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Config Section</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: '#f2f2f2' },
    header: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
    subHeader: { fontSize: 22, fontWeight: '600', marginVertical: 10 },
    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginVertical: 8,
    },
    row: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
    label: { fontSize: 16, marginRight: 10 },
    modeButton: {
        backgroundColor: '#ddd',
        padding: 8,
        borderRadius: 4,
        marginRight: 10,
    },
    modeButtonActive: { backgroundColor: '#007bff' },
    modeButtonText: { color: '#fff' },
    addButton: {
        backgroundColor: '#17a2b8',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    addButtonText: { color: '#fff', fontSize: 18 },
    saveButton: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 20,
    },
    saveButtonText: { color: '#fff', fontSize: 18 },
    optionContainer: {
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 4,
        marginVertical: 5,
    },
    optionInput: {
        backgroundColor: '#f9f9f9',
        padding: 8,
        borderRadius: 4,
        marginVertical: 4,
    },
    toggleButton: {
        backgroundColor: '#ddd',
        padding: 8,
        borderRadius: 4,
        marginLeft: 10,
    },
    toggleButtonActive: { backgroundColor: '#007bff' },
    toggleButtonText: { color: '#fff' },
    removeButtonText: { color: 'red', marginTop: 4 },
});
