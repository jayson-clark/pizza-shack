// pizza-shack/react/features/menu-editor/EditItemScreen.tsx
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
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BackButtonHeader from '../../core/components/BackButtonHeader';
import { addItemToCategory, updateItemInCategory } from '../../core/services/menuService';
import useMenuData from '../../core/hooks/useMenuData';
import { MenuItem, ConfigSection, ConfigOption } from '../../features/menu/models/menuData';

export default function EditItemScreen() {
    const { categoryId, itemId } = useLocalSearchParams<{ categoryId: string; itemId: string }>();
    const router = useRouter();
    const { menuData, loading, error } = useMenuData();
    const isNew = itemId === 'new';

    // Basic item fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [basePrice, setBasePrice] = useState('');

    // Use a state object for config sections.
    const [configSections, setConfigSections] = useState<ConfigSection[]>([]);

    // When editing an existing item, load its data from Firestore
    useEffect(() => {
        if (!isNew && !loading && !error) {
            const category = menuData.find((cat) => cat.id === categoryId);
            if (category) {
                const item = category.items.find((it: MenuItem) => it.id === itemId);
                if (item) {
                    setTitle(item.title);
                    setDescription(item.description);
                    setImage(item.image);
                    setBasePrice(item.basePrice.toString());
                    setConfigSections(item.configSections || []);
                }
            }
        }
    }, [isNew, loading, error, categoryId, itemId, menuData]);

    // ---------- Config Sections UI Helpers ----------
    const addConfigSection = () => {
        const newSection: ConfigSection = {
            id: Date.now().toString(),
            title: 'New Section',
            pricingMode: 'flat',
            flatPrice: 0,
            maxSelections: 1,
            minSelections: 0,
            options: [],
        };
        setConfigSections([...configSections, newSection]);
    };

    const updateConfigSectionField = (
        sectionId: string,
        field: keyof ConfigSection,
        value: any
    ) => {
        setConfigSections(
            configSections.map((section) =>
                section.id === sectionId ? { ...section, [field]: value } : section
            )
        );
    };

    const removeConfigSection = (sectionId: string) => {
        setConfigSections(configSections.filter((section) => section.id !== sectionId));
    };

    const addOptionToSection = (sectionId: string) => {
        const newOption: ConfigOption = {
            id: Date.now().toString(),
            label: 'New Option',
            price: 0,
            exclusiveGroup: '',
            allowMultiple: false,
        };
        setConfigSections(
            configSections.map((section) =>
                section.id === sectionId
                    ? { ...section, options: [...section.options, newOption] }
                    : section
            )
        );
    };

    const updateOptionField = (
        sectionId: string,
        optionId: string,
        field: keyof ConfigOption,
        value: any
    ) => {
        setConfigSections(
            configSections.map((section) => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        options: section.options.map((option) =>
                            option.id === optionId ? { ...option, [field]: value } : option
                        ),
                    };
                }
                return section;
            })
        );
    };

    const removeOptionFromSection = (sectionId: string, optionId: string) => {
        setConfigSections(
            configSections.map((section) => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        options: section.options.filter((option) => option.id !== optionId),
                    };
                }
                return section;
            })
        );
    };

    // ---------- Save Handler ----------
    const handleSave = async () => {
        if (!title || !description || !image || !basePrice) {
            Alert.alert('Please fill all item details.');
            return;
        }
        const newItem: MenuItem = {
            id: isNew ? Date.now().toString() : itemId,
            title,
            description,
            image,
            basePrice: parseFloat(basePrice),
            configSections,
        };
        try {
            if (isNew) {
                await addItemToCategory(categoryId, newItem);
                Alert.alert('Item created.');
            } else {
                await updateItemInCategory(categoryId, newItem);
                Alert.alert('Item updated.');
            }
            router.push(`/menu-editor/edit-category/${categoryId}`);
        } catch (err) {
            Alert.alert('Error saving item.');
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <BackButtonHeader to={`/menu-editor/edit-category/${categoryId}`} />
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }
    if (error) {
        return (
            <View style={styles.container}>
                <BackButtonHeader to={`/menu-editor/edit-category/${categoryId}`} />
                <Text>Error loading item.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <BackButtonHeader to={`/menu-editor/edit-category/${categoryId}`} />
            <Text style={styles.header}>{isNew ? 'Add New Item' : 'Edit Item'}</Text>
            <TextInput
                style={styles.input}
                placeholder="Item Title"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={styles.input}
                placeholder="Item Description"
                value={description}
                onChangeText={setDescription}
            />
            <TextInput
                style={styles.input}
                placeholder="Image URL"
                value={image}
                onChangeText={setImage}
            />
            <TextInput
                style={styles.input}
                placeholder="Base Price"
                value={basePrice}
                onChangeText={setBasePrice}
                keyboardType="numeric"
            />

            <Text style={styles.subHeader}>Config Sections</Text>
            {configSections.map((section) => (
                <View key={section.id} style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <TextInput
                            style={styles.sectionTitleInput}
                            value={section.title}
                            onChangeText={(text) => updateConfigSectionField(section.id, 'title', text)}
                        />
                        <TouchableOpacity onPress={() => removeConfigSection(section.id)}>
                            <Text style={styles.removeButtonText}>Remove Section</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Pricing Mode:</Text>
                        <TouchableOpacity
                            style={[styles.modeButton, section.pricingMode === 'flat' && styles.modeButtonActive]}
                            onPress={() => updateConfigSectionField(section.id, 'pricingMode', 'flat')}
                        >
                            <Text style={styles.modeButtonText}>Flat</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.modeButton,
                                section.pricingMode === 'individual' && styles.modeButtonActive,
                            ]}
                            onPress={() => updateConfigSectionField(section.id, 'pricingMode', 'individual')}
                        >
                            <Text style={styles.modeButtonText}>Individual</Text>
                        </TouchableOpacity>
                    </View>
                    {section.pricingMode === 'flat' && (
                        <TextInput
                            style={styles.input}
                            placeholder="Flat Price"
                            value={section.flatPrice?.toString()}
                            onChangeText={(text) =>
                                updateConfigSectionField(section.id, 'flatPrice', parseFloat(text) || 0)
                            }
                            keyboardType="numeric"
                        />
                    )}
                    <Text style={styles.label}>Max Selections (maximum allowed):</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Max Selections"
                        value={section.maxSelections?.toString()}
                        onChangeText={(text) =>
                            updateConfigSectionField(section.id, 'maxSelections', text === '' ? 0 : parseInt(text))
                        }
                        keyboardType="numeric"
                    />
                    <Text style={styles.label}>Min Selections (required):</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Min Selections"
                        value={section.minSelections?.toString()}
                        onChangeText={(text) =>
                            updateConfigSectionField(section.id, 'minSelections', text === '' ? 0 : parseInt(text))
                        }
                        keyboardType="numeric"
                    />
                    <Text style={styles.label}>Options:</Text>
                    {section.options.map((option) => (
                        <View key={option.id} style={styles.optionContainer}>
                            <TextInput
                                style={styles.optionInput}
                                placeholder="Option Label"
                                value={option.label}
                                onChangeText={(text) => updateOptionField(section.id, option.id, 'label', text)}
                            />
                            {section.pricingMode === 'individual' && (
                                <TextInput
                                    style={styles.optionInput}
                                    placeholder="Price"
                                    value={option.price?.toString()}
                                    onChangeText={(text) =>
                                        updateOptionField(section.id, option.id, 'price', parseFloat(text) || 0)
                                    }
                                    keyboardType="numeric"
                                />
                            )}
                            <TextInput
                                style={styles.optionInput}
                                placeholder="Exclusive Group"
                                value={option.exclusiveGroup || ''}
                                onChangeText={(text) =>
                                    updateOptionField(section.id, option.id, 'exclusiveGroup', text)
                                }
                            />
                            <View style={styles.row}>
                                <Text style={styles.label}>Allow Multiple:</Text>
                                <TouchableOpacity
                                    style={[
                                        styles.toggleButton,
                                        option.allowMultiple && styles.toggleButtonActive,
                                    ]}
                                    onPress={() =>
                                        updateOptionField(
                                            section.id,
                                            option.id,
                                            'allowMultiple',
                                            !option.allowMultiple
                                        )
                                    }
                                >
                                    <Text style={styles.toggleButtonText}>
                                        {option.allowMultiple ? 'Yes' : 'No'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => removeOptionFromSection(section.id, option.id)}>
                                <Text style={styles.removeButtonText}>Remove Option</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                    <TouchableOpacity
                        style={styles.addOptionButton}
                        onPress={() => addOptionToSection(section.id)}
                    >
                        <Text style={styles.addOptionButtonText}>Add Option</Text>
                    </TouchableOpacity>
                </View>
            ))}
            <TouchableOpacity style={styles.addSectionButton} onPress={addConfigSection}>
                <Text style={styles.addSectionButtonText}>Add Config Section</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>{isNew ? 'Create Item' : 'Save Item'}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: '#f2f2f2' },
    header: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
    subHeader: { fontSize: 22, fontWeight: '600', marginVertical: 10 },
    input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginVertical: 8 },
    sectionContainer: { backgroundColor: '#eaeaea', padding: 10, borderRadius: 8, marginVertical: 10 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    sectionTitleInput: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 4,
    },
    removeButtonText: { color: 'red', marginLeft: 10 },
    row: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
    label: { fontSize: 16, marginVertical: 4 },
    modeButton: { backgroundColor: '#ddd', padding: 8, borderRadius: 4, marginRight: 10 },
    modeButtonActive: { backgroundColor: '#007bff' },
    modeButtonText: { color: '#fff' },
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
    addOptionButton: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 5,
    },
    addOptionButtonText: { color: '#fff', fontSize: 16 },
    addSectionButton: {
        backgroundColor: '#17a2b8',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    addSectionButtonText: { color: '#fff', fontSize: 18 },
    saveButton: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 20,
    },
    saveButtonText: { color: '#fff', fontSize: 18 },
});
