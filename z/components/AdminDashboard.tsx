import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit3, Image as ImageIcon, Save, RefreshCw, Layout, Package, ShoppingCart, X } from 'lucide-react';
import { generateProductImage } from '../services/gemini';
import { Product } from '../types';

const AdminDashboard = () => {
  const { state, isAdmin, upsertProduct, deleteProduct, updateTheme, syncData, isLoading } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'products' | 'theme' | 'orders'>('products');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isAdmin) {
    return (
      <div className="p-20 text-center">
        <h1 className="text-2xl font-bold">Unauthorized Access</h1>
        <button onClick={() => navigate('/admin-login')} className="mt-4 text-blue-500 underline">Login as admin</button>
      </div>
    );
  }

  const handleGenerateImage = async () => {
    if (!editingProduct?.name) return alert('Please enter a product name first');
    setIsGenerating(true);
    const url = await generateProductImage(editingProduct.name);
    if (url) setEditingProduct({ ...editingProduct, image: url });
    setIsGenerating(false);
  };

  const saveProduct = () => {
    if (editingProduct?.name && editingProduct?.price) {
      upsertProduct({
        ...editingProduct as Product,
        id: editingProduct.id || Math.random().toString(36).substr(2, 9),
        createdAt: editingProduct.createdAt || new Date().toISOString()
      });
      setEditingProduct(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl serif mb-2">Vault Dashboard</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest">Global Synchronization & Control</p>
        </div>
        <button 
          onClick={syncData}
          disabled={isLoading}
          className="flex items-center gap-3 px-8 py-4 bg-gold-600 text-white font-bold tracking-widest text-xs rounded-sm hover:bg-gold-700 transition-all disabled:opacity-50"
        >
          {isLoading ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
          PUBLISH CHANGES TO LIVE STORE
        </button>
      </div>

      <div className="flex gap-8 border-b mb-12">
        <button 
          onClick={() => setActiveTab('products')}
          className={`pb-4 px-2 text-sm font-bold tracking-widest uppercase transition-all flex items-center gap-2 ${activeTab === 'products' ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}
        >
          <Package size={16} /> Products
        </button>
        <button 
          onClick={() => setActiveTab('theme')}
          className={`pb-4 px-2 text-sm font-bold tracking-widest uppercase transition-all flex items-center gap-2 ${activeTab === 'theme' ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}
        >
          <Layout size={16} /> Theme
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`pb-4 px-2 text-sm font-bold tracking-widest uppercase transition-all flex items-center gap-2 ${activeTab === 'orders' ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}
        >
          <ShoppingCart size={16} /> Orders
        </button>
      </div>

      {activeTab === 'products' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold serif">Store Catalog</h2>
            <button 
              onClick={() => setEditingProduct({ name: '', price: 0, category: 'General', description: '', image: 'https://picsum.photos/600/800' })}
              className="flex items-center gap-2 px-6 py-2 bg-black text-white text-xs font-bold tracking-widest rounded-sm"
            >
              <Plus size={16} /> ADD PRODUCT
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {state.products.map(p => (
              <div key={p.id} className="bg-white border p-6 flex gap-4 items-start">
                <img src={p.image} className="w-20 h-28 object-cover bg-gray-100" />
                <div className="flex-grow">
                  <h3 className="font-bold text-sm mb-1">{p.name}</h3>
                  <p className="text-xs text-gray-500 mb-4">{p.category}</p>
                  <p className="font-bold text-xs mb-4">{p.price.toLocaleString()} DZD</p>
                  <div className="flex gap-4">
                    <button onClick={() => setEditingProduct(p)} className="text-gray-400 hover:text-black"><Edit3 size={16} /></button>
                    <button onClick={() => deleteProduct(p.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {editingProduct && (
            <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white w-full max-w-4xl p-10 relative">
                {/* Fixed: Added missing X icon component */}
                <button onClick={() => setEditingProduct(null)} className="absolute top-6 right-6"><X size={24} /></button>
                <h2 className="text-2xl serif mb-8">{editingProduct.id ? 'Edit Product' : 'New Masterpiece'}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Title</label>
                      <input 
                        type="text" 
                        value={editingProduct.name}
                        onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                        className="w-full p-3 border-b border-gray-100 outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Price (DZD)</label>
                      <input 
                        type="number" 
                        value={editingProduct.price}
                        onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                        className="w-full p-3 border-b border-gray-100 outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Description</label>
                      <textarea 
                        rows={4}
                        value={editingProduct.description}
                        onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                        className="w-full p-3 border-b border-gray-100 outline-none focus:border-black resize-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="aspect-[3/4] bg-gray-50 border relative flex items-center justify-center overflow-hidden">
                      {isGenerating ? (
                        <div className="text-center">
                          <RefreshCw className="animate-spin mx-auto mb-4 text-gold-600" size={32} />
                          <p className="text-xs text-gray-400 tracking-[0.2em]">PAINTING IN PROGRESS...</p>
                        </div>
                      ) : (
                        <img src={editingProduct.image} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <button 
                      onClick={handleGenerateImage}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-3 py-4 border-2 border-black font-bold tracking-widest text-xs hover:bg-black hover:text-white transition-all"
                    >
                      <ImageIcon size={18} /> GENERATE AI ART (X ART STYLE)
                    </button>
                    <button onClick={saveProduct} className="w-full py-4 bg-gold-600 text-white font-bold tracking-widest text-xs">SAVE CHANGES</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'theme' && (
        <div className="max-w-2xl bg-white border p-12 space-y-8">
          <h2 className="text-xl font-bold serif mb-4">Store Aesthetics</h2>
          <div>
            <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Global Banner Text</label>
            <input 
              type="text" 
              value={state.theme.bannerText}
              onChange={e => updateTheme({ bannerText: e.target.value })}
              className="w-full p-3 border-b border-gray-100 outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Primary Signature Color</label>
            <div className="flex gap-4 items-center">
              <input 
                type="color" 
                value={state.theme.primaryColor}
                onChange={e => updateTheme({ primaryColor: e.target.value })}
                className="w-12 h-12 rounded-full cursor-pointer overflow-hidden border-none"
              />
              <span className="text-sm font-mono text-gray-500 uppercase">{state.theme.primaryColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Hero Image URL</label>
            <input 
              type="text" 
              value={state.theme.heroImage}
              onChange={e => updateTheme({ heroImage: e.target.value })}
              className="w-full p-3 border-b border-gray-100 outline-none focus:border-black"
            />
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold serif mb-8">Pending Deliveries</h2>
          {state.orders.length === 0 ? (
            <p className="text-gray-400 italic">No orders recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="p-4 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Order ID</th>
                    <th className="p-4 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Customer</th>
                    <th className="p-4 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Location</th>
                    <th className="p-4 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Total</th>
                    <th className="p-4 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Items</th>
                    <th className="p-4 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {state.orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-xs font-bold">#{order.id}</td>
                      <td className="p-4">
                        <div className="text-sm font-bold">{order.customer.name}</div>
                        <div className="text-xs text-gray-500">{order.customer.phone}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-xs uppercase font-medium">{order.customer.wilaya}</div>
                        <div className="text-[10px] text-gray-400">{order.customer.commune} ({order.customer.deliveryType})</div>
                      </td>
                      <td className="p-4 font-bold text-sm">{order.total.toLocaleString()} DZD</td>
                      <td className="p-4 text-xs text-gray-500">
                        {order.items.length} items
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;