import { useState, useEffect } from 'react';
import { categories } from '../../features/menu/models/menuData';

export default function useMenuData() {
    const [menuData, setMenuData] = useState(categories);

    useEffect(() => {
        // fetch and update menu data here if needed
    }, []);

    return menuData;
}
