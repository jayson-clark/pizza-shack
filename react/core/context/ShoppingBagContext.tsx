// pizza-shack/react/core/context/ShoppingBagContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MenuItem } from '../../features/menu/models/menuData';

export interface ConfigState {
    // Same structure as used in item configuration screens
    [sectionId: string]: {
        [optionId: string]: boolean | number;
    };
}

export interface ShoppingBagItem {
    id: string;
    item: MenuItem;
    config: ConfigState;
    quantity: number;
    totalPrice: number;
}

interface ShoppingBagContextType {
    bagItems: ShoppingBagItem[];
    addItem: (item: ShoppingBagItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
}

const ShoppingBagContext = createContext<ShoppingBagContextType | undefined>(undefined);

export const ShoppingBagProvider = ({ children }: { children: ReactNode }) => {
    const [bagItems, setBagItems] = useState<ShoppingBagItem[]>([]);

    const addItem = (newItem: ShoppingBagItem) => {
        setBagItems((prev) => [...prev, newItem]);
    };

    const removeItem = (id: string) => {
        setBagItems((prev) => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        setBagItems((prev) =>
            prev.map(item =>
                item.id === id
                    ? {
                        ...item,
                        quantity,
                        totalPrice: (item.totalPrice / item.quantity) * quantity,
                    }
                    : item
            )
        );
    };

    return (
        <ShoppingBagContext.Provider value={{ bagItems, addItem, removeItem, updateQuantity }}>
            {children}
        </ShoppingBagContext.Provider>
    );
};

export const useShoppingBag = () => {
    const context = useContext(ShoppingBagContext);
    if (!context) {
        throw new Error('useShoppingBag must be used within a ShoppingBagProvider');
    }
    return context;
};
