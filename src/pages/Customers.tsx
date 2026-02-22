import { useState, useEffect } from 'react';
import { getTransactions } from '../api/sales';
import { Users, Search, ShoppingBag, Award } from 'lucide-react';

interface CustomerStats {
    phone: string;
    name: string;
    totalVisits: number;
    lifetimeSpent: number;
    lastVisit: string;
}

export const Customers = () => {
    const [customers, setCustomers] = useState<CustomerStats[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const transactions = getTransactions();

        // Aggregate transactions by phone number
        const customerMap = transactions.reduce((acc, txn) => {
            // Treat transactions without phone as "Walk-in" instances (don't track them as unique profiles)
            if (!txn.customerPhone || txn.customerPhone === 'N/A') return acc;

            const phone = txn.customerPhone;
            if (!acc[phone]) {
                acc[phone] = {
                    phone: phone,
                    name: txn.customerName || 'Unknown',
                    totalVisits: 0,
                    lifetimeSpent: 0,
                    lastVisit: txn.date,
                };
            }

            acc[phone].totalVisits += 1;
            acc[phone].lifetimeSpent += txn.total;

            // Keep the most recent visit date
            if (new Date(txn.date) > new Date(acc[phone].lastVisit)) {
                acc[phone].lastVisit = txn.date;
            }

            return acc;
        }, {} as Record<string, CustomerStats>);

        // Convert map to array and sort by lifetime spend (descending)
        const sortedCustomers = Object.values(customerMap).sort((a, b) => b.lifetimeSpent - a.lifetimeSpent);
        setCustomers(sortedCustomers);
    }, []);

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery)
    );

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto h-full flex flex-col">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Customer Directory</h1>
                    <p className="text-gray-500 mt-1">Manage and view your top customers</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-80 pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100 mb-0 bg-gray-50/50 hidden md:grid grid-cols-12 gap-4 font-semibold text-gray-600 text-sm">
                    <div className="col-span-4">Customer Details</div>
                    <div className="col-span-2 text-center">Visits</div>
                    <div className="col-span-3 text-right">Lifetime Spend</div>
                    <div className="col-span-3 text-right">Last Visit</div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {customers.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-500">
                                <Users size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">No Customers Yet</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">
                                Record transactions with a registered phone number in the POS screen to start building your customer directory.
                            </p>
                        </div>
                    ) : filteredCustomers.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            No customers found matching "{searchQuery}"
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredCustomers.map((customer, idx) => (
                                <div key={customer.phone} className="p-4 hover:bg-gray-50 transition-colors grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                    <div className="col-span-1 md:col-span-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-sm flex-shrink-0">
                                            {customer.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 flex items-center gap-2">
                                                {customer.name}
                                                {idx < 3 && <span title="Top Customer"><Award size={16} className="text-yellow-500" /></span>}
                                            </p>
                                            <p className="text-sm text-gray-500">{customer.phone}</p>
                                        </div>
                                    </div>

                                    <div className="col-span-1 md:col-span-2 flex justify-between md:justify-center items-center">
                                        <span className="md:hidden text-sm text-gray-500">Visits:</span>
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                            <ShoppingBag size={14} />
                                            {customer.totalVisits}
                                        </span>
                                    </div>

                                    <div className="col-span-1 md:col-span-3 flex justify-between md:justify-end items-center">
                                        <span className="md:hidden text-sm text-gray-500">Total Spend:</span>
                                        <div className="text-right">
                                            <p className="font-bold text-green-600 flex items-center gap-1 justify-end">
                                                ₹{customer.lifetimeSpent.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-span-1 md:col-span-3 flex justify-between md:justify-end items-center">
                                        <span className="md:hidden text-sm text-gray-500">Last seen:</span>
                                        <p className="text-sm text-gray-500 text-right">
                                            {new Date(customer.lastVisit).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
