import type { Transaction } from '../types/sales';
import { updateVariantStock } from './inventory';

const STORAGE_KEY = 'sales_transactions';

export const getTransactions = (): Transaction[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

export const saveTransaction = (transaction: Transaction) => {
    // Save Transaction
    const transactions = getTransactions();
    transactions.unshift(transaction); // Add newest to top
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));

    // Deduct Stock
    transaction.items.forEach(item => {
        updateVariantStock(item.product.id, item.variant.id, -item.quantity);
    });
};
