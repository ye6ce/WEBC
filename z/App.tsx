import React, { useState } from 'react';
import { useApp } from './AppContext';
import { StoreHeader, AdminSidebar, Toast } from './components/Layout';
import { Storefront } from './pages/Storefront';
import { Dashboard } from './pages/Dashboard';
import { ProductDetail } from './pages/ProductDetail';
import { Shop } from './pages/Shop';

// Simple Login Component for the Admin
const AdminLoginModal: React.FC<{ onLogin: (e: string, p: string) => void, onClose: () => void }> = ({ onLogin, onClose }) => {
const [email, setEmail] = useState('');
const [pass, setPass] = useState('');

return (
<div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
<div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
<h2 className="text-2xl font-black mb-6 uppercase tracking-tighter">Admin Access</h2>
<div className="space-y-4">
<input
type="email" placeholder="Admin Email"
className="w-full p-4 bg-gray-100 rounded-2xl border-none outline-none focus:ring-2 ring-indigo-500"
value={email} onChange={(e) => setEmail(e.target.value)}
/>
<input
type="password" placeholder="Password"
className="w-full p-4 bg-gray-100 rounded-2xl border-none outline-none focus:ring-2 ring-indigo-500"
value={pass} onChange={(e) => setPass(e.target.value)}
/>
<button
onClick={() => onLogin(email, pass)}
className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all"
>
Verify Credentials
</button>
<button onClick={onClose} className="w-full text-gray-400 text-sm font-medium">Cancel</button>
</div>
</div>
</div>
);
};

const Footer: React.FC<{ onHome: () => void, onAdmin: () => void }> = ({ onHome, onAdmin }) => {
const { theme } = useApp();
return (
<footer className="bg-slate-50 border-t border-slate-100 py-12 px-6">
<div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
<div className="text-center md:text-left">
<h3 className="font-black text-xl tracking-tighter cursor-pointer" onClick={onHome}>K-SHOP</h3>
<p className="text-slate-400 text-sm mt-2">{theme.footer?.description || "Élégance & Tradition"}</p>
</div>
<button onClick={onAdmin} className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] hover:text-indigo-600 transition-colors">
Panel d'administration
</button>
</div>
</footer>
);
};

const MainContent = () => {
const {
theme,
isAdminAuthenticated,
loginAdmin,
logoutAdmin,
saveGlobalData, // From updated AppContext
products,
categories,
orders
} = useApp();

const [currentView, setView] = useState<'home' | 'shop' | 'product' | 'admin'>('home');
const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
const [activeAdminTab, setActiveAdminTab] = useState('overview');
const [isCartOpen, setIsCartOpen] = useState(false);
const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

// Navigation Logic
const navigateToProduct = (id: string) => { setSelectedProductId(id); setView('product'); };
const navigateToCategory = (id: string) => { setSelectedCategoryId(id); setView('shop'); };

// Sync to Neon
const handleGlobalSync = async () => {
await saveGlobalData({
products,
categories,
theme,
orders
});
};

return (
<div className="min-h-screen flex flex-col bg-white">
{isLoginModalOpen && (
<AdminLoginModal
onLogin={(e, p) => {
const success = loginAdmin(e, p);
if (success) {
setIsLoginModalOpen(false);
setView('admin');
} else {
alert("Invalid credentials");
}
}}
onClose={() => setIsLoginModalOpen(false)}
/>
)}

{currentView !== 'admin' && (
<StoreHeader
onCartOpen={() => setIsCartOpen(true)}
onGoToDashboard={() => {
if (isAdminAuthenticated) setView('admin');
else setIsLoginModalOpen(true);
}}
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

<main className="flex-1 overflow-y-auto bg-white no-scrollbar">
{/* Admin Sync Notification Bar */}
{currentView === 'admin' && isAdminAuthenticated && (
<div className="sticky top-0 z-50 bg-indigo-600 text-white px-6 py-3 flex justify-between items-center shadow-lg">
<span className="text-xs font-bold uppercase tracking-widest">Mode Édition Cloud</span>
<button
onClick={handleGlobalSync}
className="bg-white text-indigo-600 px-4 py-1.5 rounded-full text-xs font-black hover:bg-indigo-50 transition-colors"
>
METTRE À JOUR LE SITE (SYNC)
</button>
</div>
)}

{currentView === 'home' && <Storefront onProductClick={navigateToProduct} onCategoryClick={navigateToCategory} />}
{currentView === 'shop' && <Shop initialCategoryId={selectedCategoryId} onProductClick={navigateToProduct} />}
{currentView === 'product' && selectedProductId && <ProductDetail productId={selectedProductId} onBack={() => setView('shop')} />}
{currentView === 'admin' && isAdminAuthenticated && <Dashboard activeTab={activeAdminTab} />}

{currentView !== 'admin' && <Footer onHome={() => setView('home')} onAdmin={() => setIsLoginModalOpen(true)} />}
</main>
</div>

<Toast />
</div>
);
};

export default function App() {
return (
<AppProvider>
<MainContent />
</AppProvider>
);
}