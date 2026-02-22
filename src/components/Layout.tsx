import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Package, ShoppingCart, Users, BarChart3, Settings, Menu, X } from 'lucide-react';
import { Inventory } from '../pages/Inventory';
import { POS } from '../pages/POS';
import { Reports } from '../pages/Reports';
import { Customers } from '../pages/Customers';

const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (v: boolean) => void }) => {
    const location = useLocation();

    const menuItems = [
        { path: '/', icon: <BarChart3 size={20} />, label: 'Dashboard' },
        { path: '/pos', icon: <ShoppingCart size={20} />, label: 'Point of Sale' },
        { path: '/inventory', icon: <Package size={20} />, label: 'Inventory' },
        { path: '/customers', icon: <Users size={20} />, label: 'Customers' },
        { path: '/reports', icon: <BarChart3 size={20} />, label: 'Reports' },
        { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
    ];

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 flex flex-col z-50 transition-transform duration-300 ease-in-out print:hidden
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-wider">LUNA<span className="text-blue-500">POS</span></h1>
                        <p className="text-xs text-gray-400 mt-1">Clothing Retail</p>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                <nav className="flex-1 py-6">
                    <ul>
                        {menuItems.map((item) => (
                            <li key={item.path} className="mb-2 px-4">
                                <Link
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                        }`}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="p-6 border-t border-gray-800">
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                            A
                        </div>
                        <div>
                            <p className="font-medium">Admin User</p>
                            <p className="text-xs text-gray-500">Store Manager</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <BrowserRouter>
            <div className="flex bg-gray-50 min-h-screen w-full font-sans text-gray-800 print:bg-white overflow-x-hidden">
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                <main className="flex-1 lg:ml-64 w-full min-h-screen flex flex-col print:ml-0 print:overflow-visible bg-white transition-all duration-300">
                    {/* Mobile Header */}
                    <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center gap-4 sticky top-0 z-30 print:hidden">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="text-xl font-bold tracking-wider text-gray-900">LUNA<span className="text-blue-600">POS</span></h1>
                    </header>

                    <div className="flex-1 relative">
                        <Routes>
                            <Route path="/" element={<Reports />} />
                            <Route path="/pos" element={<POS />} />
                            <Route path="/inventory" element={<Inventory />} />
                            <Route path="/customers" element={<Customers />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/settings" element={<div className="p-8">Settings <span className="text-sm text-gray-500">(Coming Soon in v2)</span></div>} />
                        </Routes>
                    </div>
                </main>
            </div>
        </BrowserRouter>
    );
};
