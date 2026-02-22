import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Package, ShoppingCart, Users, BarChart3, Settings } from 'lucide-react';
import { Inventory } from '../pages/Inventory';
import { POS } from '../pages/POS';
import { Reports } from '../pages/Reports';

const Sidebar = () => {
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
        <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 flex flex-col print:hidden">
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-2xl font-bold tracking-wider">LUNA<span className="text-blue-500">POS</span></h1>
                <p className="text-xs text-gray-400 mt-1">Clothing Retail</p>
            </div>
            <nav className="flex-1 py-6">
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.path} className="mb-2 px-4">
                            <Link
                                to={item.path}
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
    );
};

export const Layout = () => {
    return (
        <BrowserRouter>
            <div className="flex bg-gray-50 min-h-screen font-sans text-gray-800 print:bg-white">
                <Sidebar />
                <main className="flex-1 ml-64 overflow-x-hidden print:ml-0 print:overflow-visible bg-white">
                    <Routes>
                        <Route path="/" element={<Reports />} />
                        <Route path="/pos" element={<POS />} />
                        <Route path="/inventory" element={<Inventory />} />
                        <Route path="/customers" element={<div className="p-8">Customers <span className="text-sm text-gray-500">(Coming Soon in v2)</span></div>} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/settings" element={<div className="p-8">Settings <span className="text-sm text-gray-500">(Coming Soon in v2)</span></div>} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
};
