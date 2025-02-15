// pizza-shack/react/features/menu/models/menuData.ts

export interface ConfigOption {
    id: string;
    label: string;
    price?: number; // Used for individual pricing
    exclusiveGroup?: string; // Options with the same exclusiveGroup are mutually exclusive within a section.
}

export interface ConfigSection {
    id: string;
    title: string;
    options: ConfigOption[];
    pricingMode: "flat" | "individual";
    flatPrice?: number; // If pricingMode is "flat"
    maxSelections?: number; // Optional maximum number of selections
}

export interface MenuItem {
    id: string;
    title: string;
    description: string;
    image: any;
    basePrice: number;
    configSections?: ConfigSection[];
}

export interface Category {
    id: string;
    title: string;
    description: string;
    image: any;
    items: MenuItem[];
}

export const categories: Category[] = [
    {
        id: '1',
        title: 'Pizzas',
        description: 'Delicious pizzas made fresh',
        image: require('../../../assets/pizza.jpg'),
        items: [
            {
                id: '101',
                title: 'Margherita',
                description: 'Classic cheese pizza',
                image: require('../../../assets/pizza.jpg'),
                basePrice: 8.99,
                configSections: [
                    {
                        id: 'crust',
                        title: 'Crust Options',
                        pricingMode: 'flat',
                        flatPrice: 0.5,
                        // Mutually exclusive crust options: only one can be selected.
                        options: [
                            { id: 'thin', label: 'Thin Crust', exclusiveGroup: 'crustType' },
                            { id: 'thick', label: 'Thick Crust', exclusiveGroup: 'crustType' },
                        ],
                    },
                    {
                        id: 'toppings',
                        title: 'Extra Toppings',
                        pricingMode: 'individual',
                        maxSelections: 3,
                        options: [
                            { id: 'pepperoni', label: 'Pepperoni', price: 1.0 },
                            { id: 'mushrooms', label: 'Mushrooms', price: 0.75 },
                            { id: 'olives', label: 'Olives', price: 0.5 },
                        ],
                    },
                ],
            },
            {
                id: '102',
                title: 'Pepperoni',
                description: 'Pepperoni pizza loaded with flavor',
                image: require('../../../assets/pizza.jpg'),
                basePrice: 9.99,
                configSections: [
                    {
                        id: 'crust',
                        title: 'Crust Options',
                        pricingMode: 'flat',
                        flatPrice: 0.5,
                        options: [
                            { id: 'thin', label: 'Thin Crust', exclusiveGroup: 'crustType' },
                            { id: 'thick', label: 'Thick Crust', exclusiveGroup: 'crustType' },
                        ],
                    },
                    {
                        id: 'cheese',
                        title: 'Extra Cheese',
                        pricingMode: 'flat',
                        flatPrice: 1.0,
                        options: [
                            { id: 'yes', label: 'Add Extra Cheese', exclusiveGroup: 'cheese' },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: '2',
        title: 'Sides',
        description: 'Tasty sides to complement your meal',
        image: require('../../../assets/pizza.jpg'),
        items: [
            {
                id: '201',
                title: 'Garlic Bread',
                description: 'Crunchy and delicious garlic bread',
                image: require('../../../assets/pizza.jpg'),
                basePrice: 4.99,
            },
            {
                id: '202',
                title: 'Cheesy Breadsticks',
                description: 'Breadsticks loaded with cheese',
                image: require('../../../assets/pizza.jpg'),
                basePrice: 5.99,
                configSections: [
                    {
                        id: 'dipping',
                        title: 'Dipping Sauces',
                        pricingMode: 'individual',
                        options: [
                            { id: 'marinara', label: 'Marinara', price: 0.75, exclusiveGroup: 'sauce' },
                            { id: 'ranch', label: 'Ranch', price: 0.75, exclusiveGroup: 'sauce' },
                        ],
                    },
                ],
            },
        ],
    },
];
