import { useState, useEffect } from 'react';
import type { Transaction } from '../types/sales';
import { getTransactions } from '../api/sales';
import { BarChart3, TrendingUp, ShoppingBag, CreditCard } from 'lucide-react';

export const Reports = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        setTransactions(getTransactions());
    }, []);

    const totalRevenue = transactions.reduce((sum, txn) => sum + txn.total, 0);
    const totalItemsSold = transactions.reduce((sum, txn) =>
        sum + txn.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    // Basic grouping by payment method
    const revenueByMethod = transactions.reduce((acc, txn) => {
        acc[txn.paymentMethod] = (acc[txn.paymentMethod] || 0) + txn.total;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Sales Dashboard</h1>
                <p className="text-gray-500 mt-1">Overview of today's store performance</p>
            </div>

            {transactions.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-xl border border-gray-100 shadow-sm">
                    <BarChart3 className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Sales Data Yet</h3>
                    <p className="text-gray-500">Go to the Point of Sale screen to record your first transaction.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                                <ShoppingBag size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Items Sold</p>
                                <p className="text-2xl font-bold text-gray-900">{totalItemsSold}</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                <CreditCard size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Transactions</p>
                                <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="font-bold text-gray-900">Recent Transactions</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
                                            <th className="py-3 px-4 font-medium">Txn ID</th>
                                            <th className="py-3 px-4 font-medium">Date</th>
                                            <th className="py-3 px-4 font-medium">Method</th>
                                            <th className="py-3 px-4 font-medium">Items</th>
                                            <th className="py-3 px-4 font-medium text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {transactions.slice(0, 10).map(txn => (
                                            <tr key={txn.id} className="hover:bg-gray-50/50">
                                                <td className="py-3 px-4 text-sm font-medium text-gray-900">{txn.id}</td>
                                                <td className="py-3 px-4 text-sm text-gray-500">{new Date(txn.date).toLocaleString()}</td>
                                                <td className="py-3 px-4 text-sm">
                                                    <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                                                        {txn.paymentMethod}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-600">{txn.items.reduce((sum, item) => sum + item.quantity, 0)} items</td>
                                                <td className="py-3 px-4 text-sm font-bold text-gray-900 text-right">₹{txn.total.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="font-bold text-gray-900">Revenue by Method</h2>
                            </div>
                            <div className="p-4 space-y-4">
                                {Object.entries(revenueByMethod).map(([method, amount]) => (
                                    <div key={method}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600 font-medium">{method}</span>
                                            <span className="text-gray-900 font-bold">₹{amount.toFixed(2)}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full"
                                                style={{ width: `${(amount / totalRevenue) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
