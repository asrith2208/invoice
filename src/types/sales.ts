import type { Variant, Product } from './models';

export interface CartItem {
    product: Product;
    variant: Variant;
    quantity: number;
}

export interface Transaction {
    id: string;
    date: string;
    items: CartItem[];
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    paymentMethod: 'Cash' | 'Card' | 'UPI';
    customerName?: string;
    customerPhone?: string;
}
