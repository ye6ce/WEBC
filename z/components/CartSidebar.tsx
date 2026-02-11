
import React from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../AppContext';
import { Link } from 'react-router-dom';

const CartSidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, addToCart } = useApp();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className={`fixed inset-0 z-[110] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`absolute top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold serif uppercase tracking-widest">Your Bag ({cart.length})</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
          </div>

          <div className="flex-grow overflow-y-auto p-6 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <p className="text-gray-500 italic mb-8">Your bag is currently empty.</p>
                <Link to="/products" onClick={onClose} className="text-sm font-bold tracking-widest underline underline-offset-8">EXPLORE COLLECTIONS</Link>
              </div>
            ) : (
              <div className="space-y-8">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-24 h-32 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between mb-1">
                        <h3 className="font-bold text-sm tracking-tight">{item.name}</h3>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                      </div>
                      <p className="text-xs text-gray-500 mb-4">{item.category}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center border rounded-full px-2 py-1 gap-4">
                          <button className="text-gray-400"><Minus size={14} /></button>
                          <span className="text-sm font-bold">{item.quantity}</span>
                          <button onClick={() => addToCart(item)} className="text-gray-400"><Plus size={14} /></button>
                        </div>
                        <p className="font-bold text-sm">{(item.price * item.quantity).toLocaleString()} DZD</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between mb-4">
                <span className="text-gray-500 text-sm tracking-widest">SUBTOTAL</span>
                <span className="font-bold text-lg">{total.toLocaleString()} DZD</span>
              </div>
              <p className="text-xs text-gray-400 mb-8 italic">Shipping calculated at checkout. COD available nationwide.</p>
              <Link 
                to="/checkout" 
                onClick={onClose}
                className="block w-full py-4 bg-black text-white text-center text-sm font-bold tracking-[0.2em] hover:bg-gray-900 transition-colors uppercase"
              >
                PROCEED TO CHECKOUT
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
