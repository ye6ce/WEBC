
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './AppContext';
import { ShoppingBag, User, Menu, X, Settings, MessageSquare, Camera } from 'lucide-react';
import LandingPage from './components/LandingPage';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Checkout from './components/Checkout';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import CartSidebar from './components/CartSidebar';
import ChatBot from './components/ChatBot';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart, state, isAdmin } = useApp();
  const location = useLocation();

  const isDark = location.pathname === '/';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isDark ? 'bg-transparent text-white' : 'bg-white/80 backdrop-blur-md text-black border-b border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsOpen(true)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <Menu size={24} />
            </button>
            <Link to="/" className="text-2xl font-bold tracking-tighter serif">K-SHOP</Link>
          </div>

          <div className="hidden md:flex items-center gap-8 font-medium text-sm tracking-widest">
            <Link to="/products" className="hover:opacity-70 transition-opacity">COLLECTIONS</Link>
            <Link to="/gallery" className="hover:opacity-70 transition-opacity">THE GALLERY</Link>
            <Link to="/about" className="hover:opacity-70 transition-opacity">HERITAGE</Link>
          </div>

          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link to="/admin" className="p-2 hover:bg-black/5 rounded-full text-gold-600">
                <Settings size={20} />
              </Link>
            )}
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 hover:bg-black/5 rounded-full">
              <ShoppingBag size={20} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-yellow-600 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                  {cart.length}
                </span>
              )}
            </button>
            <Link to="/admin-login" className="p-2 hover:bg-black/5 rounded-full">
              <User size={20} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsOpen(false)}>
        <div className={`fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white p-8 transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-2xl font-bold serif">K-SHOP</h2>
            <button onClick={() => setIsOpen(false)}><X size={24} /></button>
          </div>
          <div className="flex flex-col gap-8 text-xl serif">
            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/products" onClick={() => setIsOpen(false)}>Collections</Link>
            <Link to="/gallery" onClick={() => setIsOpen(false)}>Gallery</Link>
            <Link to="/about" onClick={() => setIsOpen(false)}>Heritage</Link>
          </div>
        </div>
      </div>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <footer className="bg-black text-white py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-4xl font-bold serif mb-6">K-SHOP</h2>
            <p className="text-gray-400 max-w-md mb-8">
              A curated experience of Algerian excellence. Bridging the gap between timeless tradition and contemporary luxury.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-yellow-600 transition-colors">Instagram</a>
              <a href="#" className="hover:text-yellow-600 transition-colors">Facebook</a>
              <a href="#" className="hover:text-yellow-600 transition-colors">Pinterest</a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-widest mb-6">COLLECTIONS</h3>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-white">Oud & Perfumery</a></li>
              <li><a href="#" className="hover:text-white">Traditional Wear</a></li>
              <li><a href="#" className="hover:text-white">Jewelry</a></li>
              <li><a href="#" className="hover:text-white">Home Goods</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-widest mb-6">CUSTOMER CARE</h3>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-white">Shipping (COD)</a></li>
              <li><a href="#" className="hover:text-white">Returns</a></li>
              <li><a href="#" className="hover:text-white">Size Guide</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-12 border-t border-white/10 text-center text-xs text-gray-500 tracking-widest">
          &copy; {new Date().getFullYear()} K-SHOP ALGERIA. ALL RIGHTS RESERVED.
        </div>
      </footer>
      <ChatBot />
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin-login" element={<AdminLogin />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
};

export default App;
