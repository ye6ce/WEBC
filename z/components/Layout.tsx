
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Icons } from '../constants';

export const Toast: React.FC = () => {
  const { notifications, removeNotification } = useApp();
  
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center space-y-4 w-full max-w-sm px-6">
      {notifications.map((n) => (
        <div 
          key={n.id} 
          className={`w-full p-4 rounded-2xl shadow-2xl flex items-center justify-between border backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300 ${
            n.type === 'success' ? 'bg-slate-900 border-slate-800 text-white' : 
            n.type === 'error' ? 'bg-red-500 border-red-400 text-white' : 
            'bg-indigo-50 border-indigo-100 text-indigo-900'
          }`}
        >
          <div className="flex items-center space-x-3">
             {n.type === 'success' && <div className="w-2 h-2 rounded-full bg-green-400" />}
             <span className="text-[11px] font-black uppercase tracking-widest">{n.message}</span>
          </div>
          <button onClick={() => removeNotification(n.id)} className="opacity-50 hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export const LoginModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { loginAdmin } = useApp();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(user, pass)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 backdrop-blur-xl bg-slate-900/60 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-10 shadow-2xl relative animate-in zoom-in duration-300">
         <button onClick={onClose} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900"><Icons.Plus className="rotate-45 w-6 h-6" /></button>
         <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-8 text-center uppercase">Administration</h2>
         <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
               <p className="text-[10px] font-black uppercase text-indigo-500 tracking-widest ml-1">Utilisateur</p>
               <input value={user} onChange={e => setUser(e.target.value)} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-sm outline-none focus:border-indigo-500 transition-all" placeholder="Nom d'utilisateur" />
            </div>
            <div className="space-y-2">
               <p className="text-[10px] font-black uppercase text-indigo-500 tracking-widest ml-1">Mot de passe</p>
               <input type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-sm outline-none focus:border-indigo-500 transition-all" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all">Accéder au Dashboard</button>
         </form>
      </div>
    </div>
  );
};

export const StoreHeader: React.FC<{ 
  onCartOpen: () => void; 
  onGoToDashboard: () => void;
  onLogoClick: () => void;
  onGoToShop: (catId?: string) => void;
}> = ({ onCartOpen, onGoToDashboard, onLogoClick, onGoToShop }) => {
  const { theme, cart, toggleLanguage, t, isAdminAuthenticated } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const headerStyle = {
    backgroundColor: theme.headerBgColor,
    color: theme.headerTextColor,
    borderColor: `${theme.headerTextColor}15`
  };

  const Logo = () => (
    <div 
      onClick={() => { onLogoClick(); setIsMobileMenuOpen(false); }}
      className="flex items-center space-x-2 md:space-x-4 cursor-pointer hover:opacity-80 transition-opacity"
    >
      <img src={theme.logoUrl} alt="Logo" className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl object-cover shadow-sm" />
      <span className="font-black text-xl md:text-2xl tracking-tighter">{theme.storeName}</span>
    </div>
  );

  const Navigation = () => (
    <nav className="hidden md:flex items-center space-x-10 text-[11px] font-black uppercase tracking-[0.2em] opacity-70">
      <button onClick={onLogoClick} className="hover:opacity-100 transition-opacity">{t('home')}</button>
      <button onClick={() => onGoToShop()} className="hover:opacity-100 transition-opacity">{t('shop')}</button>
      <button className="hover:opacity-100 transition-opacity">{t('contact')}</button>
    </nav>
  );

  const Actions = () => (
    <div className="flex items-center space-x-2 md:space-x-6">
      <button 
        onClick={toggleLanguage}
        className="px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-100 shadow-sm"
      >
        {theme.language === 'fr' ? 'العربية' : 'Français'}
      </button>
      
      {isAdminAuthenticated ? (
        <button 
          onClick={onGoToDashboard}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
        >
          <Icons.Dashboard className="w-4 h-4" />
          <span className="hidden sm:inline">Marchand</span>
        </button>
      ) : (
        <button 
          onClick={() => setIsLoginModalOpen(true)}
          className="px-4 py-2 border-2 border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
        >
          {t('login')}
        </button>
      )}

      <button 
        onClick={onCartOpen}
        className="relative p-2 opacity-60 hover:opacity-100 hover:bg-black/5 rounded-lg transition-all"
      >
        <Icons.Cart />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 md:w-5 md:h-5 text-[9px] md:text-[10px] font-bold text-white rounded-full shadow-lg border-2 border-white" style={{ backgroundColor: theme.primaryColor }}>
            {cartCount}
          </span>
        )}
      </button>
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden p-2 opacity-60"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-50 transition-colors duration-500 border-b" style={headerStyle}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20">
          <div className="h-full flex items-center justify-between">
              <Logo />
              {theme.headerType === 'classic' && <Navigation />}
              <Actions />
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-6 px-4 animate-in slide-in-from-top duration-300 border-t" style={{ backgroundColor: theme.headerBgColor, borderColor: `${theme.headerTextColor}15` }}>
             <nav className="flex flex-col space-y-4 text-[13px] font-black uppercase tracking-widest opacity-70">
                <button onClick={() => { onLogoClick(); setIsMobileMenuOpen(false); }} className="text-left py-2">{t('home')}</button>
                <button onClick={() => { onGoToShop(); setIsMobileMenuOpen(false); }} className="text-left py-2">{t('shop')}</button>
             </nav>
          </div>
        )}
      </header>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
};

export const AdminSidebar: React.FC<{ activeTab: string; setActiveTab: (t: string) => void; onExit: () => void }> = ({ activeTab, setActiveTab, onExit }) => {
  const { logoutAdmin } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  
  const navItems = [
    { id: 'analytics', label: 'Dashboard', icon: Icons.Dashboard },
    { id: 'products', label: 'Produits', icon: Icons.Store },
    { id: 'categories', label: 'Collections', icon: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg> },
    { id: 'orders', label: 'Commandes', icon: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
    { id: 'logistics', label: 'Logistique', icon: Icons.Truck },
    { id: 'branding', label: 'Design', icon: Icons.Settings },
  ];

  const handleLogout = () => {
    logoutAdmin();
    onExit();
  };

  const SidebarContent = () => (
    <>
      <div className="p-8 border-b border-white/5 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-black">M</div>
        <div>
          <h1 className="font-bold text-lg leading-none">Marchand</h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Lumina Pro</p>
        </div>
      </div>
      <nav className="flex-1 p-6 space-y-2 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
            className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
              activeTab === item.id 
              ? 'bg-white/10 text-white border border-white/10' 
              : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
            }`}
          >
            <item.icon />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-6 space-y-3">
        <button 
          onClick={onExit}
          className="w-full flex items-center justify-center px-5 py-4 rounded-2xl text-sm font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
        >
          <span>Quitter le Panel</span>
        </button>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-5 py-4 rounded-2xl text-sm font-bold text-red-400 bg-red-400/5 hover:bg-red-400/10 border border-red-400/10 transition-all"
        >
          <span>Déconnexion</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-4 bg-indigo-600 text-white rounded-full shadow-2xl"
        >
          <Icons.Dashboard />
        </button>
      </div>

      <aside className={`fixed inset-y-0 left-0 z-[160] w-72 bg-gray-900 text-white flex flex-col shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} lg:relative`}>
        <SidebarContent />
      </aside>

      {isOpen && <div className="fixed inset-0 bg-black/50 z-[155] lg:hidden" onClick={() => setIsOpen(false)} />}
    </>
  );
};
