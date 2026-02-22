import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Minus, Plus as PlusIcon, Trash2, Tag, CreditCard } from 'lucide-react';
import type { Product, Variant } from '../types/models';
import type { CartItem } from '../types/sales';
import { getProducts } from '../api/inventory';
import { CheckoutModal } from '../components/CheckoutModal';

export const POS = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [discountAmount, setDiscountAmount] = useState<number>(0);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

    useEffect(() => {
        setProducts(getProducts());
    }, []);

    const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

    const filteredProducts = products.filter(p =>
        (selectedCategory === 'All' || p.category === selectedCategory) &&
        (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.variants.some(v => v.sku.toLowerCase().includes(searchQuery.toLowerCase())))
    );

    const addToCart = (product: Product, variant: Variant) => {
        if (variant.stock <= 0) {
            alert('This variant is out of stock!');
            return;
        }

        setCart(prev => {
            const existing = prev.find(item => item.variant.id === variant.id);
            if (existing) {
                if (existing.quantity >= variant.stock) return prev; // Cannot add more than stock
                return prev.map(item =>
                    item.variant.id === variant.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, variant, quantity: 1 }];
        });
    };

    const updateQuantity = (variantId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.variant.id === variantId) {
                const newQuantity = Math.max(1, Math.min(item.quantity + delta, item.variant.stock));
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const removeFromCart = (variantId: string) => {
        setCart(prev => prev.filter(item => item.variant.id !== variantId));
    };

    const subtotal = cart.reduce((sum, item) => sum + (item.product.basePrice * item.quantity), 0);
    const tax = (subtotal - discountAmount) * 0.18; // Example 18% GST calculation
    const total = subtotal - discountAmount + tax;

    const handleCheckout = () => {
        if (cart.length === 0) return;
        setIsCheckoutOpen(true);
    };

    const handleCheckoutSuccess = () => {
        setCart([]);
        setDiscountAmount(0);
        setIsCheckoutOpen(false);
        // Reload products to get latest stock
        setProducts(getProducts());
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden print:h-auto print:overflow-visible print:block">
            {/* Left Area: Products */}
            <div className="flex-1 flex flex-col h-full border-r border-gray-200 print:hidden">
                <div className="p-4 bg-white border-b border-gray-200">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products or scan SKU..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-lg shadow-sm"
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === category
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="h-32 bg-gray-100 flex items-center justify-center relative">
                                    {/* Placeholder for product image */}
                                    <span className="text-gray-400 font-medium text-lg">
                                        {product.name.charAt(0)}
                                    </span>
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-gray-900 text-xs font-bold px-2 py-1 rounded">
                                        ₹{product.basePrice}
                                    </div>
                                </div>
                                <div className="p-3">
                                    <h3 className="font-semibold text-gray-900 truncate" title={product.name}>{product.name}</h3>
                                    <p className="text-xs text-gray-500 mb-2">{product.category}</p>

                                    <div className="mt-2 space-y-1.5 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                                        {product.variants.map(variant => (
                                            <button
                                                key={variant.id}
                                                onClick={() => addToCart(product, variant)}
                                                disabled={variant.stock === 0}
                                                className={`w-full flex items-center justify-between p-2 rounded text-sm border transition-colors ${variant.stock > 0
                                                    ? 'border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-700'
                                                    : 'border-red-100 bg-red-50/50 text-red-400 cursor-not-allowed opacity-60'
                                                    }`}
                                            >
                                                <span className="font-medium bg-white px-1.5 rounded shadow-sm border border-gray-100 text-xs">
                                                    {variant.size}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span className="w-3 h-3 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: variant.color.toLowerCase() }} title={variant.color} />
                                                    <span className="text-xs">{variant.stock > 0 ? `${variant.stock} left` : 'Out'}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Area: Cart Flow */}
            <div className="w-96 bg-white flex flex-col shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-10 print:hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                        <ShoppingCart size={22} className="text-blue-600" />
                        <span>Current Order</span>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">{cart.length} items</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                            <ShoppingCart size={48} className="text-gray-200" />
                            <p>Your cart is empty.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {cart.map(item => (
                                <div key={item.variant.id} className="flex gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900 text-sm leading-tight mb-1">{item.product.name}</h4>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                            <span className="font-medium text-gray-700">Size: {item.variant.size}</span>
                                            <span>•</span>
                                            <span>Color: {item.variant.color}</span>
                                        </div>
                                        <div className="font-semibold text-gray-900">
                                            ₹{(item.product.basePrice * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end justify-between">
                                        <button
                                            onClick={() => removeFromCart(item.variant.id)}
                                            className="text-gray-400 hover:text-red-500 p-1"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-200">
                                            <button
                                                onClick={() => updateQuantity(item.variant.id, -1)}
                                                className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm transition-all shadow-sm bg-white"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-4 text-center text-sm font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.variant.id, 1)}
                                                className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm transition-all shadow-sm bg-white"
                                            >
                                                <PlusIcon size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-200 bg-gray-50 p-4">
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal</span>
                            <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 flex items-center gap-1"><Tag size={14} /> Discount</span>
                            <div className="relative w-24">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">₹</span>
                                <input
                                    type="number"
                                    min="0"
                                    max={subtotal}
                                    value={discountAmount || ''}
                                    onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                                    className="w-full pl-5 pr-2 py-1 text-right border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm font-medium"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between text-sm text-gray-600 pb-2 border-b border-gray-200">
                            <span>GST (18%)</span>
                            <span className="font-medium text-gray-900">₹{tax.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                            <span className="font-bold text-gray-900 text-lg">Total</span>
                            <span className="font-bold text-blue-600 text-2xl">₹{Math.max(0, total).toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                        className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all shadow-md ${cart.length > 0
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                            }`}
                    >
                        <CreditCard size={20} />
                        Checkout Now
                    </button>
                </div>
            </div>

            {isCheckoutOpen && (
                <CheckoutModal
                    cart={cart}
                    subtotal={subtotal}
                    discount={discountAmount}
                    tax={tax}
                    total={total}
                    onClose={() => setIsCheckoutOpen(false)}
                    onSuccess={handleCheckoutSuccess}
                />
            )}
        </div>
    );
};
