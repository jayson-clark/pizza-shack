// pizza-shack/react/core/hooks/useMenuData.ts
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { Category } from '../../features/menu/models/menuData';

interface UseMenuDataResult {
    menuData: Category[];
    loading: boolean;
    error: any;
}

export default function useMenuData(): UseMenuDataResult {
    const [menuData, setMenuData] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'menuCategories'));
                const categories: Category[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    categories.push({
                        id: doc.id,
                        title: data.title,
                        description: data.description,
                        image: data.image,
                        items: data.items || [],
                    });
                });
                setMenuData(categories);
            } catch (err) {
                console.error("Error fetching menu data:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { menuData, loading, error };
}
