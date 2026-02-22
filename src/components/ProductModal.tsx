import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type { Product, Variant } from '../types/models';
import { saveProduct } from '../api/inventory';
import { v4 as uuidv4 } from 'uuid';

interface ProductModalProps {
    product?: Product;
    onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
    const [name, setName] = useState(product?.name || '');
    const [category, setCategory] = useState(product?.category || '');
    const [basePrice, setBasePrice] = useState(product?.basePrice?.toString() || '');
    const [variants, setVariants] = useState<Variant[]>(
        product?.variants || [{ id: uuidv4(), size: '', color: '', sku: '', stock: 0 }]
    );

    const handleAddVariant = () => {
        setVariants([...variants, { id: uuidv4(), size: '', color: '', sku: '', stock: 0 }]);
    };

    const handleRemoveVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleVariantChange = (index: number, field: keyof Variant, value: string | number) => {
        const newVariants = [...variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setVariants(newVariants);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newProduct: Product = {
            id: product?.id || uuidv4(),
            name,
            category,
            basePrice: parseFloat(basePrice) || 0,
            variants,
        };
        saveProduct(newProduct);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
                    <h2 className="text-xl font-bold text-gray-900">
                        {product ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    {/* Basic Details */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Basic Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                    placeholder="e.g., Casual Denim Jacket"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    type="text"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                    placeholder="e.g., Jackets"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Base Price (₹) <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={basePrice}
                                    onChange={(e) => setBasePrice(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Variants Section */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Variants (Sizes/Colors)</h3>
                            <button
                                type="button"
                                onClick={handleAddVariant}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                            >
                                <Plus size={16} /> Add Variant
                            </button>
                        </div>

                        <div className="space-y-4">
                            {variants.map((variant, index) => (
                                <div key={variant.id} className="flex flex-wrap md:flex-nowrap gap-4 items-start p-4 border border-gray-100 rounded-lg bg-gray-50/50 relative group">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Size</label>
                                            <input
                                                required
                                                type="text"
                                                value={variant.size}
                                                onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                                                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                placeholder="S, M, L..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Color</label>
                                            <input
                                                required
                                                type="text"
                                                value={variant.color}
                                                onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                                                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                placeholder="Red, Blue..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">SKU</label>
                                            <input
                                                required
                                                type="text"
                                                value={variant.sku}
                                                onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                                                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                placeholder="SKU-123"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Initial Stock</label>
                                            <input
                                                required
                                                type="number"
                                                min="0"
                                                value={variant.stock}
                                                onChange={(e) => handleVariantChange(index, 'stock', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                    {variants.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveVariant(index)}
                                            className="text-red-400 hover:text-red-600 p-2 mt-4 md:mt-0 transition-colors"
                                            title="Remove variant"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white py-4 -mx-6 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm shadow-sm"
                        >
                            Save Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
