import { useState } from 'react';
import { X, Printer, CheckCircle2 } from 'lucide-react';
import type { CartItem, Transaction } from '../types/sales';
import { saveTransaction } from '../api/sales';

interface CheckoutModalProps {
    cart: CartItem[];
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    onClose: () => void;
    onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
    cart,
    subtotal,
    discount,
    tax,
    total,
    onClose,
    onSuccess
}) => {
    const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'UPI'>('Cash');
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [transactionId, setTransactionId] = useState('');

    const handlePayment = () => {
        setIsProcessing(true);

        // Simulate API call
        setTimeout(() => {
            const newTransaction: Transaction = {
                id: `TXN-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
                date: new Date().toISOString(),
                items: cart,
                subtotal,
                discount,
                tax,
                total,
                paymentMethod,
                customerName: customerName || 'Walk-in Customer',
                customerPhone: customerPhone || 'N/A'
            };

            saveTransaction(newTransaction);
            setTransactionId(newTransaction.id);
            setIsProcessing(false);
            setIsSuccess(true);
        }, 1000);
    };

    const handlePrint = () => {
        window.print();
    };

    if (isSuccess) {
        return (
            <>
                {/* Screen View */}
                <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4 print:hidden">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>

                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
                            <CheckCircle2 size={32} />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                        <p className="text-gray-500 mb-6">Transaction ID: {transactionId}</p>

                        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Amount Paid</span>
                                <span className="font-bold text-gray-900">₹{total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Payment Mode</span>
                                <span className="font-medium text-gray-900">{paymentMethod}</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handlePrint}
                                className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
                            >
                                <Printer size={18} /> Download / Print Invoice
                            </button>
                            <button
                                onClick={onSuccess}
                                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm"
                            >
                                New Sale
                            </button>
                        </div>
                    </div>
                </div>

                {/* Hidden Printable A4 Invoice section (only visible in print mode via CSS) */}
                <div className="hidden print:block w-full bg-white text-gray-800 p-8 text-left text-sm mx-auto font-sans min-h-screen">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <div className="w-16 h-16 bg-[#d95c1c] rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-sm">L</div>
                                <h1 className="text-xl font-bold text-[#d95c1c] mb-1">Luna Clothing</h1>
                                <p className="text-gray-500">14B, Northern Street</p>
                                <p className="text-gray-500">Greater South Avenue</p>
                                <p className="text-gray-500">New York 10001</p>
                                <p className="text-gray-500">U.S.A</p>
                            </div>
                            <div className="text-right">
                                <h2 className="text-4xl font-light text-[#d95c1c] tracking-widest mb-2">INVOICE</h2>
                                <p className="font-semibold text-gray-800"># {transactionId}</p>
                                <div className="mt-8">
                                    <p className="text-gray-500 mb-1">Balance Due</p>
                                    <p className="text-xl font-bold">₹0.00</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between mb-12">
                            <div>
                                <p className="text-gray-500 font-semibold mb-2">Bill To</p>
                                <p className="font-bold text-gray-800 text-lg">{customerName || 'Walk-in Customer'}</p>
                                {customerPhone && <p className="text-gray-600">{customerPhone}</p>}
                            </div>
                            <div className="text-right flex gap-8">
                                <div>
                                    <p className="text-gray-500 mb-1">Invoice Date:</p>
                                    <p className="text-gray-500">Terms:</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                    <p className="font-semibold">Paid via {paymentMethod}</p>
                                </div>
                            </div>
                        </div>

                        <table className="w-full mb-8">
                            <thead>
                                <tr className="bg-[#d95c1c] text-white">
                                    <th className="py-3 px-4 text-left font-semibold w-12">#</th>
                                    <th className="py-3 px-4 text-left font-semibold">Item & Description</th>
                                    <th className="py-3 px-4 text-right font-semibold">Qty</th>
                                    <th className="py-3 px-4 text-right font-semibold">Rate</th>
                                    <th className="py-3 px-4 text-right font-semibold">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item, index) => (
                                    <tr key={item.variant.id} className="border-b border-gray-200">
                                        <td className="py-4 px-4 align-top text-gray-600">{index + 1}</td>
                                        <td className="py-4 px-4">
                                            <div className="font-semibold text-gray-800">{item.product.name}</div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                {item.variant.size} / {item.variant.color}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-right align-top text-gray-600">{item.quantity.toFixed(2)}</td>
                                        <td className="py-4 px-4 text-right align-top text-gray-600">{item.product.basePrice.toFixed(2)}</td>
                                        <td className="py-4 px-4 text-right align-top text-gray-600">{(item.product.basePrice * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex justify-end mb-12">
                            <div className="w-1/2">
                                <div className="flex justify-between py-2 text-gray-600">
                                    <span>Sub Total</span>
                                    <span>{subtotal.toFixed(2)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between py-2 text-gray-600">
                                        <span>Discount</span>
                                        <span>-{discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between py-2 text-gray-600">
                                    <span>Tax Rate (18%)</span>
                                    <span>{tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between py-3 font-bold text-lg border-t border-gray-200 mt-2">
                                    <span>Total</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between py-3 px-4 bg-[#d95c1c] text-white font-bold text-lg mt-4 shadow-sm">
                                    <span>Amount Paid</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 border-t border-gray-200 pt-8">
                            <p className="font-bold text-gray-800 mb-1">Notes</p>
                            <p className="text-gray-500 mb-6">Thanks for your business.</p>

                            <p className="font-bold text-gray-800 mb-1">Terms & Conditions</p>
                            <p className="text-gray-500">All prices are inclusive of GST. No returns on discounted items.</p>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="border-b border-gray-100 p-6 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Checkout</h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Order Summary</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-600">
                                <span>Items ({cart.length})</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Discount</span>
                                <span className="text-red-500">-₹{discount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax (18%)</span>
                                <span>₹{tax.toFixed(2)}</span>
                            </div>
                            <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                                <span className="font-semibold text-gray-900">Total Amount</span>
                                <span className="font-bold text-2xl text-blue-600">₹{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Customer Details</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Jack Little"
                                    value={customerName}
                                    onChange={e => setCustomerName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    placeholder="e.g. 9876543210"
                                    value={customerPhone}
                                    onChange={e => setCustomerPhone(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Payment Method</h3>
                        <div className="grid grid-cols-3 gap-3 mb-8">
                            {['Cash', 'Card', 'UPI'].map((method) => (
                                <button
                                    key={method}
                                    onClick={() => setPaymentMethod(method as 'Cash' | 'Card' | 'UPI')}
                                    className={`py-3 rounded-lg border-2 font-medium transition-all ${paymentMethod === method
                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {method}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all shadow-md ${isProcessing
                                ? 'bg-blue-400 cursor-not-allowed text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
                                }`}
                        >
                            {isProcessing ? 'Processing...' : `Pay ₹${total.toFixed(2)}`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
