import { db } from '../config/firebaseConfig';
import {
    collection,
    addDoc,
    doc,
    updateDoc,
    arrayUnion,
    getDoc,
} from 'firebase/firestore';
import { MenuItem } from '../../features/menu/models/menuData';

export async function addCategory(category: {
    title: string;
    description: string;
    image: string;
}) {
    try {
        const docRef = await addDoc(collection(db, 'menuCategories'), {
            title: category.title,
            description: category.description,
            image: category.image,
            items: [],
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding category:', error);
        throw error;
    }
}

export async function updateCategory(
    categoryId: string,
    data: { title: string; description: string; image: string }
) {
    try {
        const categoryRef = doc(db, 'menuCategories', categoryId);
        await updateDoc(categoryRef, {
            title: data.title,
            description: data.description,
            image: data.image,
        });
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
}

export async function addItemToCategory(categoryId: string, item: MenuItem) {
    try {
        // Ensure item has a unique id
        const newItem: MenuItem = {
            ...item,
            id: item.id && item.id.trim() !== '' ? item.id : Date.now().toString(),
        };
        const categoryRef = doc(db, 'menuCategories', categoryId);
        await updateDoc(categoryRef, {
            items: arrayUnion(newItem),
        });
    } catch (error) {
        console.error('Error adding item to category:', error);
        throw error;
    }
}

export async function updateItemInCategory(
    categoryId: string,
    updatedItem: MenuItem
) {
    try {
        const categoryRef = doc(db, 'menuCategories', categoryId);
        const categorySnap = await getDoc(categoryRef);
        if (categorySnap.exists()) {
            const data = categorySnap.data();
            const items: MenuItem[] = data.items || [];
            const newItems = items.map((item) =>
                item.id === updatedItem.id ? updatedItem : item
            );
            await updateDoc(categoryRef, { items: newItems });
        }
    } catch (error) {
        console.error('Error updating item in category:', error);
        throw error;
    }
}
