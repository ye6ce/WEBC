
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { WILAYAS, ALGERIA_PHONE_REGEX } from '../constants';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const { cart, placeOrder, clearCart } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    wilaya: WILAYAS[15], // Default Alger
    commune: '',
    deliveryType: 'home' as 'home' | 'desk'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!ALGERIA_PHONE_REGEX.test(formData.phone)) {
      setError('Please enter a valid Algerian phone number (05, 06, or 07 followed by 8 digits).');
      return;
    }

    setIsSubmitting(true);
    const order = {
      id: Math.random().toString(36).substr(2, 9),
      items: cart.map(i => ({ productId: i.id, name: i.name, quantity: i.quantity, price: i.price })),
      total,
      customer: formData,
      status: 'pending' as const,
      createdAt: new Date().toISOString()
    };

    const success = await placeOrder(order);
    if (success) {
      setIsSuccess(true);
      clearCart();
    } else {
      setError('Failed to place order. Please try again.');
    }
    setIsSubmitting(false);
  };

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto py-32 px-4 text-center">
        <div className="flex justify-center mb-8">
          <CheckCircle2 size={80} className="text-green-500" />
        </div>
        <h1 className="text-4xl serif mb-4">Shukran!</h1>
        <p className="text-gray-600 mb-12">Your order has been placed successfully. We will call you within 24 hours to confirm your delivery details.</p>
        <Link to="/" className="inline-block px-10 py-4 bg-black text-white font-bold tracking-widest text-sm uppercase">Return Home</Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-32 px-4 text-center">
        <h1 className="text-4xl serif mb-4">Your bag is empty</h1>
        <p className="text-gray-600 mb-12">Add some luxury items before checking out.</p>
        <Link to="/products" className="inline-block px-10 py-4 bg-black text-white font-bold tracking-widest text-sm uppercase">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-20 px-4">
      <div className="flex items-center gap-2 text-xs tracking-widest text-gray-400 mb-12 uppercase">
        <Link to="/products" className="hover:text-black transition-colors">Bag</Link>
        <ChevronRight size={12} />
        <span className="text-black font-bold">Checkout</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <h2 className="text-3xl serif mb-8">Delivery Details (COD)</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Full Name</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border-b border-gray-200 focus:border-black transition-colors outline-none"
                placeholder="Ex: Mohamed Amine"
              />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Phone Number</label>
              <input 
                required
                type="tel" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border-b border-gray-200 focus:border-black transition-colors outline-none"
                placeholder="05/06/07XXXXXXXX"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Wilaya</label>
                <select 
                  value={formData.wilaya}
                  onChange={e => setFormData({...formData, wilaya: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border-b border-gray-200 focus:border-black transition-colors outline-none appearance-none"
                >
                  {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Commune</label>
                <input 
                  required
                  type="text" 
                  value={formData.commune}
                  onChange={e => setFormData({...formData, commune: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border-b border-gray-200 focus:border-black transition-colors outline-none"
                  placeholder="Ex: Dely Brahim"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-4">Delivery Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, deliveryType: 'home'})}
                  className={`p-4 border text-center transition-all ${formData.deliveryType === 'home' ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-500'}`}
                >
                  <span className="block font-bold text-sm">Home Delivery</span>
                  <span className="text-[10px] uppercase tracking-widest opacity-70">To your door</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, deliveryType: 'desk'})}
                  className={`p-4 border text-center transition-all ${formData.deliveryType === 'desk' ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-500'}`}
                >
                  <span className="block font-bold text-sm">Desk Delivery</span>
                  <span className="text-[10px] uppercase tracking-widest opacity-70">Collect from bureau</span>
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm italic">{error}</p>}

            <button 
              disabled={isSubmitting}
              type="submit"
              className="w-full py-5 bg-black text-white font-bold tracking-[0.3em] uppercase hover:bg-gray-900 transition-all transform hover:-translate-y-1 mt-8 flex items-center justify-center gap-4"
            >
              {isSubmitting ? 'PROCESSING...' : `CONFIRM ORDER (${total.toLocaleString()} DZD)`}
            </button>
            <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest mt-4">
              Payment is made upon delivery (Cash on Delivery)
            </p>
          </form>
        </div>

        <div>
          <div className="bg-gray-50 p-10 sticky top-32">
            <h3 className="text-xl serif mb-8 uppercase tracking-widest">Order Summary</h3>
            <div className="space-y-6 mb-8 max-h-80 overflow-y-auto custom-scrollbar pr-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover" />
                    <div>
                      <p className="text-sm font-bold">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold">{(item.price * item.quantity).toLocaleString()} DZD</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-6 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>{total.toLocaleString()} DZD</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span>{formData.deliveryType === 'home' ? '800 DZD' : '400 DZD'}</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-4">
                <span>Total</span>
                <span className="text-gold-700">{(total + (formData.deliveryType === 'home' ? 800 : 400)).toLocaleString()} DZD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
