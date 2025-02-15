export interface ConfigOption {
    id: string;
    label: string;
    price?: number; // used in individual pricing mode
    exclusiveGroup?: string;
    allowMultiple?: boolean; // if true, user can select a quantity (counter); otherwise it's just a checkbox
}

export interface ConfigSection {
    id: string;
    title: string;
    pricingMode: "flat" | "individual";
    flatPrice?: number;      // used in flat pricing mode
    maxSelections?: number;  // optional maximum number of selections allowed
    minSelections?: number;  // optional minimum number of selections required
    options: ConfigOption[];
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
