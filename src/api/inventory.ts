import type { Product } from '../types/models';

const STORAGE_KEY = 'inventory_products';

// Initialize with some dummy data if empty
const initializeStorage = () => {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
        const dummyProducts: Product[] = [
            {
                id: '1',
                name: 'Classic White T-Shirt',
                category: 'T-Shirts',
                basePrice: 499,
                variants: [
                    { id: 'v1', size: 'M', color: 'White', sku: 'TS-WHT-M', stock: 15 },
                    { id: 'v2', size: 'L', color: 'White', sku: 'TS-WHT-L', stock: 8 },
                ]
            },
            {
                id: '2',
                name: 'Denim Jeans Regular Fit',
                category: 'Jeans',
                basePrice: 1299,
                variants: [
                    { id: 'v3', size: '32', color: 'Blue', sku: 'DNM-BLU-32', stock: 5 },
                    { id: 'v4', size: '34', color: 'Blue', sku: 'DNM-BLU-34', stock: 2 },
                ]
            }
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dummyProducts));
    }
};

initializeStorage();

export const getProducts = (): Product[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

export const saveProduct = (product: Product) => {
    const products = getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
        products[index] = product;
    } else {
        products.push(product);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const deleteProduct = (id: string) => {
    const products = getProducts().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const updateVariantStock = (productId: string, variantId: string, quantityChange: number) => {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    if (product) {
        const variant = product.variants.find(v => v.id === variantId);
        if (variant) {
            variant.stock += quantityChange;
        }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}
