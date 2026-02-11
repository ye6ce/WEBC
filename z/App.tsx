
import React, { useState } from 'react';
import { AppProvider, useApp } from './AppContext';
import { StoreHeader, AdminSidebar, Toast } from './components/Layout';
import { Storefront } from './pages/Storefront';
import { Dashboard } from './pages/Dashboard';
import { ProductDetail } from './pages/ProductDetail';
import { Shop } from './pages/Shop';
import { Icons, WILAYAS_ALGERIA } from './constants';

const Footer: React.FC<{ onHome: () => void, onAdmin: () => void }> = ({ onHome, onAdmin }) => {
  const { theme, isAdminAuthenticated } = useApp();
  const socials = [
    {id:'fb', link: theme.socialFacebook, icon: (props: any) => <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>},
    {id:'ig', link: theme.socialInstagram, icon: (props: any) => <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>},
    {id:'tk', link: theme.socialTikTok, icon: (props: any) => <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31 0 2.591.233 3.812.73.56.238.99.63 1.151 1.22.4.92.35 1.98.35 2.99 0 1.23.11 2.47.52 3.65.46 1.13 1.27 2.11 2.26 2.82.72.53 1.56.89 2.46 1.05.35.06.66.25.82.57.17.33.16.73-.02 1.05-1.2 2.13-3.4 3.51-5.71 3.51-1.01 0-1.99-.2-2.9-.58V20.5c0 1.93-1.57 3.5-3.5 3.5s-3.5-1.57-3.5-3.5 1.57-3.5 3.5-3.5c.26 0 .52.03.77.08v-2.31c-.25-.03-.51-.05-.77-.05-3.2 0-5.8 2.6-5.8 5.8s2.6 5.8 5.8 5.8 5.8-2.6 5.8-5.8V7.5c1.1.73 2.41 1.13 3.75 1.13v-2.4c-1.63 0-3.06-.99-3.66-2.42-.45-1.07-.45-2.26-.45-3.38 0-.23-.1-.45-.26-.61-.17-.17-.39-.27-.63-.27h-2.1c-.01 0-.01 0 0 0z"/></svg>},
    {id:'wa', link: theme.socialWhatsApp, icon: (props: any) => <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>},
  ];

  return (
    <footer className="transition-all duration-500 pt-24 pb-12 px-6 md:px-10" style={{ backgroundColor: theme.footer.bgColor, color: theme.footer.textColor }}>
      <div className="max-w-7xl mx-auto flex flex-col gap-20">
        {theme.footer.showLogoCenter && (
          <div className="flex flex-col items-center text-center space-y-6">
             <img src={theme.logoUrl} className="w-20 h-20 rounded-full border-4 border-white/10 p-2 object-contain" />
             <h2 className="text-4xl font-black tracking-tighter uppercase tracking-[0.2em]">{theme.storeName}</h2>
             <p className="max-w-md opacity-60 font-medium text-lg leading-relaxed">{theme.footer.description}</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 border-t border-white/5 pt-20">
           <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40">Suivez-nous</h3>
              <div className="flex gap-4">
                 {socials.filter(s => s.link).map(s => (
                    <a key={s.id} href={s.link} target="_blank" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-indigo-600 transition-all"><s.icon className="w-5 h-5" /></a>
                 ))}
              </div>
           </div>
           <div className="space-y-6 text-center">
              <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40">Navigation</h3>
              <div className="flex flex-col space-y-3 font-black text-sm uppercase">
                 <button onClick={onHome}>Accueil</button>
                 {!isAdminAuthenticated && <button onClick={() => {}} className="opacity-30 cursor-not-allowed">Compte Marchand</button>}
                 {isAdminAuthenticated && <button onClick={onAdmin}>Compte Marchand</button>}
              </div>
           </div>
           <div className="space-y-6 text-right">
              <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40">Localisation</h3>
              <p className="text-sm font-bold opacity-60">Livraison 58 Wilayas<br/>Algeria Pure Retail</p>
           </div>
        </div>
        <div className="text-center text-[10px] font-black uppercase tracking-[0.4em] opacity-20 pt-10 border-t border-white/5">© {new Date().getFullYear()} {theme.storeName}</div>
      </div>
    </footer>
  );
};

const CartDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, clearCart, theme, deliveryPrices, submitOrder, notify } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderForm, setOrderForm] = useState({
    name: '', phone: '', wilaya: WILAYAS_ALGERIA[15], commune: '', address: '', deliveryType: 'domicile' as 'domicile' | 'bureau'
  });

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.selectedVariant?.price || item.price) * item.quantity, 0);
  const selectedWilaya = deliveryPrices.find(p => p.wilaya === orderForm.wilaya);
  const deliveryFee = cart.length > 0 ? (selectedWilaya ? (orderForm.deliveryType === 'domicile' ? selectedWilaya.domicile : selectedWilaya.bureau) : 0) : 0;
  const grandTotal = cartSubtotal + deliveryFee;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderForm.name || !orderForm.phone) { notify("Veuillez remplir les informations de contact.", "error"); return; }
    if (cart.length === 0) return;
    setIsSubmitting(true);
    try {
      await submitOrder({
        customerName: orderForm.name,
        phone: orderForm.phone,
        wilaya: orderForm.wilaya,
        commune: orderForm.commune,
        address: orderForm.address,
        deliveryType: orderForm.deliveryType,
        deliveryFee,
        items: cart,
        total: grandTotal
      });
      clearCart();
      onClose();
      notify("Commande envoyée avec succès !");
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className={`fixed inset-0 z-[150] transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`}>
       <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
       <div className={`absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
          <div className="p-6 md:p-8 border-b flex justify-between items-center bg-white sticky top-0 z-10">
             <h2 className="text-xl md:text-2xl font-black tracking-tighter">Votre Panier</h2>
             <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all"><svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
             {/* Items List */}
             <div className="space-y-4">
                {cart.length === 0 ? (
                  <div className="py-20 flex flex-col items-center justify-center space-y-4 opacity-20 text-center">
                     <div className="text-6xl">🛒</div>
                     <p className="font-black uppercase tracking-widest text-[10px]">Votre panier est vide</p>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center animate-in slide-in-from-right duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
                       <img src={item.image} className="w-16 h-16 rounded-xl object-cover border" />
                       <div className="flex-1">
                          <h4 className="font-black text-[11px] leading-tight line-clamp-1">{item.name}</h4>
                          {item.selectedVariant && <p className="text-[9px] font-bold text-indigo-500 uppercase mt-0.5">{item.selectedVariant.name}</p>}
                          <p className="font-black text-slate-900 text-xs mt-1">{item.quantity} x {(item.selectedVariant?.price || item.price).toLocaleString()} DZD</p>
                       </div>
                       <button onClick={() => removeFromCart(idx)} className="p-2 text-rose-400 hover:bg-rose-50 rounded-lg transition-all"><Icons.Trash className="w-4 h-4" /></button>
                    </div>
                  ))
                )}
             </div>

             {/* Checkout Form in Cart */}
             {cart.length > 0 && (
               <div className="pt-8 border-t space-y-6">
                  <div className="text-center space-y-1">
                     <h3 className="text-lg font-black tracking-tighter uppercase">Finaliser ma commande</h3>
                     <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Paiement Cash à la livraison</p>
                  </div>
                  <form onSubmit={handleCheckout} className="space-y-4">
                     <div className="grid grid-cols-1 gap-4">
                        <input required value={orderForm.name} onChange={e => setOrderForm({...orderForm, name: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs outline-none focus:border-indigo-500" placeholder="Nom et Prénom" />
                        <input required value={orderForm.phone} onChange={e => setOrderForm({...orderForm, phone: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs outline-none focus:border-indigo-500" placeholder="Numéro de téléphone" />
                     </div>
                     <div className="grid grid-cols-2 gap-2">
                        <select value={orderForm.wilaya} onChange={e => setOrderForm({...orderForm, wilaya: e.target.value})} className="p-3 bg-slate-50 border border-slate-100 rounded-xl font-black text-[10px] uppercase outline-none">
                           {WILAYAS_ALGERIA.map(w => <option key={w} value={w}>{w}</option>)}
                        </select>
                        <input value={orderForm.commune} onChange={e => setOrderForm({...orderForm, commune: e.target.value})} className="p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs outline-none" placeholder="Commune" />
                     </div>
                     <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                        <button type="button" onClick={() => setOrderForm({...orderForm, deliveryType: 'domicile'})} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${orderForm.deliveryType === 'domicile' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Domicile</button>
                        <button type="button" onClick={() => setOrderForm({...orderForm, deliveryType: 'bureau'})} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${orderForm.deliveryType === 'bureau' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Bureau</button>
                     </div>
                  </form>
               </div>
             )}
          </div>
          {cart.length > 0 && (
            <div className="p-6 md:p-8 border-t bg-slate-50 space-y-6">
               <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase opacity-40"><span>Sous-total</span><span>{cartSubtotal.toLocaleString()} DZD</span></div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase opacity-40"><span>Frais livraison</span><span>{deliveryFee.toLocaleString()} DZD</span></div>
                  <div className="flex justify-between items-end pt-2">
                     <span className="text-xs font-black uppercase">Total Estimation</span>
                     <span className="text-2xl font-black text-indigo-600">{grandTotal.toLocaleString()} DZD</span>
                  </div>
               </div>
               <button 
                  disabled={isSubmitting} 
                  onClick={handleCheckout} 
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all disabled:opacity-50"
               >
                  {isSubmitting ? 'ENVOI EN COURS...' : 'FINALISER LA COMMANDE'}
               </button>
               <button onClick={clearCart} className="w-full text-[9px] font-black uppercase text-slate-400 tracking-widest hover:text-rose-500 transition-colors">Vider le panier</button>
            </div>
          )}
       </div>
    </div>
  );
};

const MainContent: React.FC = () => {
  const { isAdminAuthenticated } = useApp();
  const [view, setView] = useState<'home' | 'shop' | 'product' | 'admin'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState('analytics');

  const navigateToProduct = (id: string) => {
    setSelectedProductId(id);
    setView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCategory = (id: string) => {
    setSelectedCategoryId(id === 'all' ? null : id);
    setView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentView = (view === 'admin' && !isAdminAuthenticated) ? 'home' : view;

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {currentView !== 'admin' && (
        <StoreHeader 
          onCartOpen={() => setIsCartOpen(true)}
          onGoToDashboard={() => setView('admin')}
          onLogoClick={() => setView('home')}
          onGoToShop={(catId) => { setSelectedCategoryId(catId || null); setView('shop'); }}
        />
      )}

      <div className="flex-1 flex overflow-hidden">
        {currentView === 'admin' && isAdminAuthenticated && (
          <AdminSidebar 
            activeTab={activeAdminTab} 
            setActiveTab={setActiveAdminTab} 
            onExit={() => setView('home')} 
          />
        )}

        <main className="flex-1 overflow-y-auto bg-white custom-scrollbar no-scrollbar">
          {currentView === 'home' && <Storefront onProductClick={navigateToProduct} onCategoryClick={navigateToCategory} />}
          {currentView === 'shop' && <Shop initialCategoryId={selectedCategoryId} onProductClick={navigateToProduct} />}
          {currentView === 'product' && selectedProductId && <ProductDetail productId={selectedProductId} onBack={() => setView('shop')} />}
          {currentView === 'admin' && isAdminAuthenticated && <Dashboard activeTab={activeAdminTab} />}
          {currentView !== 'admin' && <Footer onHome={() => setView('home')} onAdmin={() => setView('admin')} />}
        </main>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Toast />
    </div>
  );
};

const App = () => (
  <AppProvider>
    <MainContent />
  </AppProvider>
);

export default App;
