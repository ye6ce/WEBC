
import React, { useState, useEffect } from 'react';
import { useApp, fileToBase64 } from '../AppContext';
import { Icons, WILAYAS_ALGERIA } from '../constants';
import { Product, ProductVariant, Category, StoreTheme, Order, SectionConfig, SectionType, Quote, Alignment, WilayaDeliveryPrice, VariantDisplayType } from '../types';
import { suggestDeliveryRates } from '../services/geminiService';

interface DashboardProps { activeTab: string; }

export const Dashboard: React.FC<DashboardProps> = ({ activeTab }) => {
  const { 
    sales, products, categories, theme, orders, deliveryPrices, 
    updateOrderStatus, addProduct, updateProduct, deleteProduct, 
    updateTheme, addCategory, updateCategory, deleteCategory, updateDeliveryPrices, notify 
  } = useApp();
  
  const [isEditingProduct, setIsEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState<Category | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const [localTheme, setLocalTheme] = useState<StoreTheme>(theme);
  const [localLogistics, setLocalLogistics] = useState<WilayaDeliveryPrice[]>(deliveryPrices);
  const [hasChanges, setHasChanges] = useState(false);
  const [hasLogisticsChanges, setHasLogisticsChanges] = useState(false);
  const [aiLogisticsContext, setAiLogisticsContext] = useState('');
  const [brandingSubTab, setBrandingSubTab] = useState<'global' | 'order' | 'hero' | 'categories' | 'featured' | 'quotes' | 'features' | 'banner' | 'footer' | 'socials'>('global');

  useEffect(() => { setLocalTheme(theme); setHasChanges(false); }, [activeTab, theme]);
  useEffect(() => { setLocalLogistics(deliveryPrices); setHasLogisticsChanges(false); }, [activeTab, deliveryPrices]);

  const updateLocal = (update: Partial<StoreTheme>) => { setLocalTheme(prev => ({ ...prev, ...update })); setHasChanges(true); };
  
  const updateSection = <K extends keyof StoreTheme>(key: K, update: any) => {
    const current = localTheme[key];
    setLocalTheme(prev => ({ ...prev, [key]: { ...(current as any), ...update } }));
    setHasChanges(true);
  };

  const updateWilayaPrice = (index: number, field: 'domicile' | 'bureau', value: number) => {
    const newLogistics = [...localLogistics];
    newLogistics[index] = { ...newLogistics[index], [field]: value };
    setLocalLogistics(newLogistics);
    setHasLogisticsChanges(true);
  };

  const handleSaveBranding = () => { updateTheme(localTheme); setHasChanges(false); };
  const handleSaveLogistics = () => { updateDeliveryPrices(localLogistics); setHasLogisticsChanges(false); };

  const handleAIFillLogistics = async () => {
    if (!aiLogisticsContext) { notify("Veuillez saisir des instructions.", "error"); return; }
    notify("L'IA analyse vos tarifs...", "info");
    const suggestions = await suggestDeliveryRates(localTheme.storeName, aiLogisticsContext);
    
    if (suggestions && Array.isArray(suggestions)) {
      const nextLogistics = [...localLogistics];
      suggestions.forEach((s: any) => {
        const idx = nextLogistics.findIndex(l => parseInt(l.wilaya.split(' - ')[0]) === s.wilayaCode);
        if (idx !== -1) {
          nextLogistics[idx] = { ...nextLogistics[idx], domicile: s.domicile, bureau: s.bureau };
        }
      });
      setLocalLogistics(nextLogistics);
      setHasLogisticsChanges(true);
      notify("Tarifs mis à jour par l'IA !");
    } else {
      notify("L'IA n'a pas pu traiter la liste.", "error");
    }
  };

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-8 md:space-y-12 pb-32 overflow-x-hidden">
      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-in fade-in duration-500">
           <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter">Statistiques</h2>
           <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {[
                { label: 'C.A', value: `${sales.reduce((a, b) => a + b.amount, 0).toLocaleString()} DZD`, icon: '💰' },
                { label: 'Commandes', value: orders.length, icon: '📦' },
                { label: 'Produits', value: products.length, icon: '🏷️' },
                { label: 'En attente', value: orders.filter(o => o.status === 'pending').length, icon: '⏳' },
              ].map((s, i) => (
                <div key={i} className="bg-white p-4 md:p-8 rounded-2xl md:rounded-[2rem] border shadow-sm transition-all hover:shadow-md">
                   <div className="text-xl md:text-3xl mb-2 md:mb-4">{s.icon}</div>
                   <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                   <p className="text-sm md:text-2xl font-black text-slate-900 mt-1">{s.value}</p>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
           <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter">Commandes</h2>
           <div className="bg-white rounded-2xl md:rounded-[2.5rem] border shadow-sm overflow-x-auto no-scrollbar">
              <table className="w-full text-left min-w-[600px]">
                 <thead className="bg-slate-50 border-b text-[8px] md:text-[10px] font-black uppercase text-slate-400">
                    <tr><th className="px-4 py-3 md:px-6 md:py-4">Réf / Date</th><th className="px-4 py-3 md:px-6 md:py-4">Client</th><th className="px-4 py-3 md:px-6 md:py-4">Localisation</th><th className="px-4 py-3 md:px-6 md:py-4">Total</th><th className="px-4 py-3 md:px-6 md:py-4 text-center">Statut</th></tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 text-[10px] md:text-xs">
                    {orders.map(o => (
                      <tr key={o.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedOrder(o)}>
                        <td className="px-4 py-3 md:px-6 md:py-4 font-mono font-black">#{o.id}<br/><span className="text-[8px] text-slate-400">{new Date(o.date).toLocaleDateString()}</span></td>
                        <td className="px-4 py-3 md:px-6 md:py-4 font-black truncate max-w-[120px]">{o.customerName}<br/><span className="text-indigo-500">{o.phone}</span></td>
                        <td className="px-4 py-3 md:px-6 md:py-4 font-bold truncate max-w-[150px]">{o.wilaya}<br/><span className="text-[8px] text-slate-400">{o.commune}</span></td>
                        <td className="px-4 py-3 md:px-6 md:py-4 font-black">{o.total.toLocaleString()} DZD</td>
                        <td className="px-4 py-3 md:px-6 md:py-4 text-center" onClick={e => e.stopPropagation()}>
                           <select value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value as any)} className="px-2 py-1 rounded-lg text-[8px] md:text-[9px] font-black uppercase border-2 outline-none">
                              <option value="pending">Attente</option><option value="confirmed">Confirmé</option><option value="shipped">Expédié</option><option value="delivered">Livré</option><option value="cancelled">Annulé</option>
                           </select>
                        </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'logistics' && (
        <div className="space-y-8 animate-in fade-in duration-500">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter">Livraison</h2>
              {hasLogisticsChanges && (
                 <button onClick={handleSaveLogistics} className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">ENREGISTRER</button>
              )}
           </div>

           <div className="bg-white p-6 md:p-10 rounded-[2rem] border-2 border-slate-100 shadow-sm space-y-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm">
                 <Icons.Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                 <h3 className="text-xl font-black uppercase tracking-widest text-slate-900">IA Remplissage Automatique</h3>
                 <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">Collez votre liste de prix ou écrivez vos instructions (ex: Alger 400, Sud 1000...) et l'IA s'occupe de tout.</p>
              </div>
              <div className="w-full max-w-2xl space-y-4">
                 <textarea 
                    value={aiLogisticsContext} 
                    onChange={e => setAiLogisticsContext(e.target.value)}
                    className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:opacity-30"
                    placeholder="1 1400 800
2 800 500..."
                    rows={4}
                 />
                 <button onClick={handleAIFillLogistics} className="w-full py-4 bg-indigo-600 text-white rounded-[1.2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-[1.01] active:scale-95 transition-all">
                    Lancer l'IA
                 </button>
              </div>
           </div>

           <div className="bg-white rounded-2xl md:rounded-[2.5rem] border shadow-sm overflow-hidden">
              <div className="max-h-[500px] overflow-y-auto no-scrollbar">
                 <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b text-[8px] md:text-[10px] font-black uppercase text-slate-400 sticky top-0 z-10">
                       <tr><th className="px-6 py-5">Wilaya</th><th className="px-6 py-5">Domicile</th><th className="px-6 py-5">Bureau</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {localLogistics.map((l, i) => (
                         <tr key={l.wilaya} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-black text-slate-900 text-xs">{l.wilaya}</td>
                            <td className="px-6 py-4"><input type="number" value={l.domicile} onChange={e => updateWilayaPrice(i, 'domicile', parseInt(e.target.value) || 0)} className="w-20 md:w-32 p-2 bg-white border border-slate-200 rounded-lg font-black text-xs outline-none" /></td>
                            <td className="px-6 py-4"><input type="number" value={l.bureau} onChange={e => updateWilayaPrice(i, 'bureau', parseInt(e.target.value) || 0)} className="w-20 md:w-32 p-2 bg-white border border-slate-200 rounded-lg font-black text-xs outline-none" /></td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'branding' && (
        <div className="space-y-8 animate-in zoom-in duration-500">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter">Design Studio</h2>
           </div>

           {/* Tabs Navigation */}
           <div className="relative group">
              <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl overflow-x-auto no-scrollbar scroll-smooth snap-x">
                 {['global', 'order', 'hero', 'categories', 'featured', 'quotes', 'features', 'banner', 'footer', 'socials'].map(tab => (
                   <button 
                     key={tab} 
                     onClick={() => setBrandingSubTab(tab as any)} 
                     className={`px-6 py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all snap-start flex-shrink-0 ${brandingSubTab === tab ? 'bg-white shadow-md text-indigo-600 scale-105' : 'text-slate-500 hover:text-slate-900'}`}
                   >
                     {tab}
                   </button>
                 ))}
              </div>
              <div className="md:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-100 to-transparent pointer-events-none rounded-r-2xl" />
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
              {brandingSubTab === 'global' && (
                <>
                  <SectionCard title="Identité">
                    <div className="space-y-6">
                       <div className="space-y-2">
                         <p className="text-[10px] font-black uppercase text-slate-400">Nom de la Boutique</p>
                         <input value={localTheme.storeName} onChange={e => updateLocal({storeName: e.target.value})} className="w-full p-4 border-2 border-slate-100 rounded-2xl font-black text-base focus:border-indigo-500 outline-none transition-all" placeholder="Nom du Site" />
                       </div>
                       <div className="flex flex-col sm:flex-row items-center gap-6">
                          <img src={localTheme.logoUrl} className="w-24 h-24 rounded-2xl border-2 border-slate-100 object-contain p-2 bg-slate-50 shadow-sm" />
                          <label className="w-full flex-1 cursor-pointer bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase text-center tracking-widest hover:bg-black transition-all">CHANGER LOGO <input type="file" className="hidden" onChange={async e => { if(e.target.files?.[0]) { const b = await fileToBase64(e.target.files[0]); updateLocal({logoUrl: b}); } }} /></label>
                       </div>
                    </div>
                  </SectionCard>
                  <SectionCard title="Couleurs Système">
                    <div className="grid grid-cols-2 gap-4">
                       <ColorInput label="Couleur Primaire" value={localTheme.primaryColor} onChange={v => updateLocal({primaryColor: v})} />
                       <ColorInput label="Fond Site" value={localTheme.backgroundColor} onChange={v => updateLocal({backgroundColor: v})} />
                       <ColorInput label="Fond Cartes" value={localTheme.cardBgColor} onChange={v => updateLocal({cardBgColor: v})} />
                       <ColorInput label="Texte Cartes" value={localTheme.cardTextColor} onChange={v => updateLocal({cardTextColor: v})} />
                       <ColorInput label="Fond Boutons" value={localTheme.buttonBgColor} onChange={v => updateLocal({buttonBgColor: v})} />
                       <ColorInput label="Texte Boutons" value={localTheme.buttonTextColor} onChange={v => updateLocal({buttonTextColor: v})} />
                    </div>
                  </SectionCard>
                </>
              )}

              {brandingSubTab === 'order' && (
                <>
                  <SectionCard title="Entête / Menu">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase text-slate-400">Type de Header</p>
                        <select value={localTheme.headerType} onChange={e => updateLocal({headerType: e.target.value as any})} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest outline-none">
                           <option value="classic">Classique</option>
                           <option value="minimal">Minimaliste</option>
                           <option value="centered">Centré</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <ColorInput label="Fond Header" value={localTheme.headerBgColor} onChange={v => updateLocal({headerBgColor: v})} />
                        <ColorInput label="Texte Header" value={localTheme.headerTextColor} onChange={v => updateLocal({headerTextColor: v})} />
                      </div>
                    </div>
                  </SectionCard>
                  <SectionCard title="Préférences Catalogue">
                     <div className="space-y-4">
                       <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                          <span className="text-[10px] font-black uppercase tracking-widest">Afficher les Notes et Avis</span>
                          <input type="checkbox" checked={localTheme.showRatings} onChange={e => updateLocal({showRatings: e.target.checked})} className="w-6 h-6 rounded-lg text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                       </div>
                       <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase text-slate-400">Arrondi des Cartes</p>
                        <select value={localTheme.cardRoundness} onChange={e => updateLocal({cardRoundness: e.target.value as any})} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-[10px] uppercase">
                           <option value="none">Aucun</option><option value="sm">Petit</option><option value="md">Moyen</option><option value="lg">Grand</option><option value="full">Complet</option>
                        </select>
                       </div>
                       <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase text-slate-400">Arrondi des Boutons</p>
                        <select value={localTheme.buttonRoundness} onChange={e => updateLocal({buttonRoundness: e.target.value as any})} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-[10px] uppercase">
                           <option value="none">Aucun</option><option value="sm">Petit</option><option value="md">Moyen</option><option value="lg">Grand</option><option value="full">Complet</option>
                        </select>
                       </div>
                     </div>
                  </SectionCard>
                </>
              )}

              {brandingSubTab === 'hero' && (
                <>
                  <SectionCard title="Configuration Hero">
                    <div className="space-y-6">
                       <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                          <span className="text-[10px] font-black uppercase tracking-widest">Visible sur l'accueil</span>
                          <input type="checkbox" checked={localTheme.hero.isVisible} onChange={e => updateSection('hero', {isVisible: e.target.checked})} className="w-6 h-6 rounded-lg" />
                       </div>
                       <input value={localTheme.hero.title} onChange={e => updateSection('hero', {title: e.target.value})} className="w-full p-4 border-2 border-slate-100 rounded-2xl font-black text-lg" placeholder="Titre Hero" />
                       <textarea value={localTheme.hero.subtitle} onChange={e => updateSection('hero', {subtitle: e.target.value})} className="w-full p-4 border-2 border-slate-100 rounded-2xl font-medium text-xs" rows={2} placeholder="Sous-titre" />
                       <div className="grid grid-cols-2 gap-4">
                          <input value={localTheme.hero.buttonText} onChange={e => updateSection('hero', {buttonText: e.target.value})} className="w-full p-4 border-2 border-slate-100 rounded-2xl font-black text-xs uppercase" placeholder="Texte Bouton" />
                          <input value={localTheme.hero.buttonLink} onChange={e => updateSection('hero', {buttonLink: e.target.value})} className="w-full p-4 border-2 border-slate-100 rounded-2xl font-black text-xs uppercase" placeholder="Lien Bouton" />
                       </div>
                    </div>
                  </SectionCard>
                  <SectionCard title="Style Visuel">
                    <div className="space-y-6">
                       <div className="flex flex-col gap-4">
                          <img src={localTheme.hero.bgImageUrl} className="w-full h-32 rounded-2xl object-cover border-2" />
                          <label className="w-full cursor-pointer bg-slate-100 p-3 rounded-xl text-center text-[10px] font-black uppercase tracking-widest">Changer Fond <input type="file" className="hidden" onChange={async e => { if(e.target.files?.[0]) { const b = await fileToBase64(e.target.files[0]); updateSection('hero', {bgImageUrl: b}); } }} /></label>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                         <ColorInput label="Fond" value={localTheme.hero.bgColor} onChange={v => updateSection('hero', {bgColor: v})} />
                         <ColorInput label="Texte" value={localTheme.hero.textColor} onChange={v => updateSection('hero', {textColor: v})} />
                       </div>
                       <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase text-slate-400">Alignement</p>
                        <select value={localTheme.hero.alignment} onChange={e => updateSection('hero', {alignment: e.target.value as any})} className="w-full p-3 border-2 border-slate-100 rounded-xl font-black text-xs">
                           <option value="left">Gauche</option><option value="center">Centre</option><option value="right">Droite</option>
                        </select>
                       </div>
                    </div>
                  </SectionCard>
                </>
              )}

              {brandingSubTab === 'categories' && (
                 <>
                   <SectionCard title="Section Collections">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                           <span className="text-[10px] font-black uppercase tracking-widest">Afficher cette section</span>
                           <input type="checkbox" checked={localTheme.categories.isVisible} onChange={e => updateSection('categories', {isVisible: e.target.checked})} className="w-6 h-6" />
                        </div>
                        <input value={localTheme.categories.title} onChange={e => updateSection('categories', {title: e.target.value})} className="w-full p-4 border-2 border-slate-100 rounded-2xl font-black" placeholder="Titre de section" />
                        <input value={localTheme.categories.subtitle} onChange={e => updateSection('categories', {subtitle: e.target.value})} className="w-full p-4 border-2 border-slate-100 rounded-2xl font-bold text-xs" placeholder="Sous-titre" />
                      </div>
                   </SectionCard>
                   <SectionCard title="Apparence">
                      <div className="grid grid-cols-2 gap-4">
                        <ColorInput label="Fond" value={localTheme.categories.bgColor} onChange={v => updateSection('categories', {bgColor: v})} />
                        <ColorInput label="Texte" value={localTheme.categories.textColor} onChange={v => updateSection('categories', {textColor: v})} />
                      </div>
                   </SectionCard>
                 </>
              )}

              {brandingSubTab === 'featured' && (
                 <>
                   <SectionCard title="Produits Vedettes">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                           <span className="text-[10px] font-black uppercase tracking-widest">Afficher cette section</span>
                           <input type="checkbox" checked={localTheme.featured.isVisible} onChange={e => updateSection('featured', {isVisible: e.target.checked})} className="w-6 h-6" />
                        </div>
                        <input value={localTheme.featured.title} onChange={e => updateSection('featured', {title: e.target.value})} className="w-full p-4 border-2 border-slate-100 rounded-2xl font-black" placeholder="Titre de section" />
                        <input value={localTheme.featured.subtitle} onChange={e => updateSection('featured', {subtitle: e.target.value})} className="w-full p-4 border-2 border-slate-100 rounded-2xl font-bold text-xs" placeholder="Sous-titre" />
                      </div>
                   </SectionCard>
                   <SectionCard title="Paramètres">
                      <div className="grid grid-cols-2 gap-4">
                        <ColorInput label="Fond" value={localTheme.featured.bgColor} onChange={v => updateSection('featured', {bgColor: v})} />
                        <ColorInput label="Texte" value={localTheme.featured.textColor} onChange={v => updateSection('featured', {textColor: v})} />
                      </div>
                   </SectionCard>
                 </>
              )}

              {brandingSubTab === 'quotes' && (
                 <>
                   <SectionCard title="Avis Clients / Citations">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                           <span className="text-[10px] font-black uppercase tracking-widest">Activer section</span>
                           <input type="checkbox" checked={localTheme.quotes.isVisible} onChange={e => updateSection('quotes', {isVisible: e.target.checked})} className="w-6 h-6" />
                        </div>
                        <input value={localTheme.quotes.title} onChange={e => updateSection('quotes', {title: e.target.value})} className="w-full p-4 border-2 border-slate-100 rounded-2xl font-black" />
                        <div className="grid grid-cols-2 gap-4">
                          <ColorInput label="Fond Section" value={localTheme.quotes.bgColor} onChange={v => updateSection('quotes', {bgColor: v})} />
                          <ColorInput label="Texte Section" value={localTheme.quotes.textColor} onChange={v => updateSection('quotes', {textColor: v})} />
                        </div>
                      </div>
                   </SectionCard>
                   <SectionCard title="Liste des Avis">
                      <div className="space-y-4">
                        {localTheme.quotes.items.map((q, idx) => (
                           <div key={idx} className="p-4 border-2 rounded-2xl space-y-3 bg-slate-50">
                              <textarea value={q.text} onChange={e => {
                                 const items = [...localTheme.quotes.items];
                                 items[idx].text = e.target.value;
                                 updateSection('quotes', {items});
                              }} className="w-full p-3 border rounded-xl text-[11px] font-bold" rows={2} />
                              <div className="flex justify-between gap-2">
                                <input value={q.sender} onChange={e => {
                                   const items = [...localTheme.quotes.items];
                                   items[idx].sender = e.target.value;
                                   updateSection('quotes', {items});
                                }} className="flex-1 p-2 border rounded-xl text-[10px] font-black uppercase" placeholder="Auteur" />
                                <button onClick={() => {
                                   const items = localTheme.quotes.items.filter((_, i) => i !== idx);
                                   updateSection('quotes', {items});
                                }} className="px-3 py-2 bg-rose-50 text-rose-500 rounded-xl font-black">X</button>
                              </div>
                           </div>
                        ))}
                        <button onClick={() => {
                           const items = [...localTheme.quotes.items, {id: Math.random().toString(36).substr(2, 5), text: 'Nouveau témoignage...', sender: 'Nom Client'}];
                           updateSection('quotes', {items});
                        }} className="w-full py-3 border-2 border-dashed border-slate-300 rounded-2xl font-black text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100">Ajouter Avis</button>
                      </div>
                   </SectionCard>
                 </>
              )}

              {brandingSubTab === 'features' && (
                 <>
                   <SectionCard title="Arguments de Vente">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                           <span className="text-[10px] font-black uppercase tracking-widest">Section active</span>
                           <input type="checkbox" checked={localTheme.features.isVisible} onChange={e => updateSection('features', {isVisible: e.target.checked})} className="w-6 h-6" />
                        </div>
                        <input value={localTheme.features.title} onChange={e => updateSection('features', {title: e.target.value})} className="w-full p-4 border-2 border-slate-100 rounded-2xl font-black" />
                        <div className="grid grid-cols-2 gap-4">
                          <ColorInput label="Fond" value={localTheme.features.bgColor} onChange={v => updateSection('features', {bgColor: v})} />
                          <ColorInput label="Texte" value={localTheme.features.textColor} onChange={v => updateSection('features', {textColor: v})} />
                        </div>
                      </div>
                   </SectionCard>
                   <SectionCard title="Les 3 Points Forts">
                      <div className="space-y-8">
                        {[1, 2, 3].map(i => (
                           <div key={i} className="space-y-3 p-4 bg-slate-50 border-2 rounded-2xl">
                              <p className="text-[10px] font-black uppercase text-indigo-500">Argument {i}</p>
                              <input value={(localTheme.features as any)[`f${i}Title`]} onChange={e => updateSection('features', {[`f${i}Title`]: e.target.value})} className="w-full p-3 border rounded-xl font-black text-xs" placeholder="Titre..." />
                              <textarea value={(localTheme.features as any)[`f${i}Desc`]} onChange={e => updateSection('features', {[`f${i}Desc`]: e.target.value})} className="w-full p-3 border rounded-xl font-bold text-[10px]" rows={2} placeholder="Description..." />
                           </div>
                        ))}
                      </div>
                   </SectionCard>
                 </>
              )}

              {brandingSubTab === 'banner' && (
                 <>
                   <SectionCard title="Bannière Promotionnelle">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                           <span className="text-[10px] font-black uppercase tracking-widest">Section active</span>
                           <input type="checkbox" checked={localTheme.banner.isVisible} onChange={e => updateSection('banner', {isVisible: e.target.checked})} className="w-6 h-6" />
                        </div>
                        <input value={localTheme.banner.title} onChange={e => updateSection('banner', {title: e.target.value})} className="w-full p-4 border-2 border-slate-100 rounded-2xl font-black" placeholder="Titre Promo" />
                        <input value={localTheme.banner.subtitle} onChange={e => updateSection('banner', {subtitle: e.target.value})} className="w-full p-4 border-2 border-slate-100 rounded-2xl font-bold text-xs" placeholder="Sous-titre Promo" />
                      </div>
                   </SectionCard>
                   <SectionCard title="Couleurs Promo">
                      <div className="grid grid-cols-2 gap-4">
                        <ColorInput label="Fond Bannière" value={localTheme.banner.bgColor} onChange={v => updateSection('banner', {bgColor: v})} />
                        <ColorInput label="Texte Bannière" value={localTheme.banner.textColor} onChange={v => updateSection('banner', {textColor: v})} />
                      </div>
                   </SectionCard>
                 </>
              )}

              {brandingSubTab === 'footer' && (
                <>
                  <SectionCard title="Contenu Pied de Page">
                    <div className="space-y-6">
                       <textarea value={localTheme.footer.description} onChange={e => updateSection('footer', {description: e.target.value})} className="w-full p-4 border-2 border-slate-100 rounded-2xl font-medium text-xs" rows={3} placeholder="Description de votre boutique..." />
                       <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                          <span className="text-[10px] font-black uppercase tracking-widest">Logo Centré au Footer</span>
                          <input type="checkbox" checked={localTheme.footer.showLogoCenter} onChange={e => updateSection('footer', {showLogoCenter: e.target.checked})} className="w-6 h-6" />
                       </div>
                    </div>
                  </SectionCard>
                  <SectionCard title="Design Footer">
                    <div className="grid grid-cols-2 gap-4">
                       <ColorInput label="Fond Footer" value={localTheme.footer.bgColor} onChange={v => updateSection('footer', {bgColor: v})} />
                       <ColorInput label="Texte Footer" value={localTheme.footer.textColor} onChange={v => updateSection('footer', {textColor: v})} />
                    </div>
                  </SectionCard>
                </>
              )}

              {brandingSubTab === 'socials' && (
                <>
                  <SectionCard title="Réseaux Sociaux">
                    <div className="space-y-4">
                       <SocialInput icon="FB" label="Lien Facebook" value={localTheme.socialFacebook} onChange={v => updateLocal({socialFacebook: v})} />
                       <SocialInput icon="IG" label="Lien Instagram" value={localTheme.socialInstagram} onChange={v => updateLocal({socialInstagram: v})} />
                       <SocialInput icon="TK" label="Lien TikTok" value={localTheme.socialTikTok} onChange={v => updateLocal({socialTikTok: v})} />
                       <SocialInput icon="WA" label="Lien WhatsApp" value={localTheme.socialWhatsApp} onChange={v => updateLocal({socialWhatsApp: v})} />
                    </div>
                  </SectionCard>
                  <SectionCard title="Info Utile">
                    <p className="text-[10px] font-bold text-slate-400 italic">Ces liens apparaîtront automatiquement dans le footer de votre boutique.</p>
                  </SectionCard>
                </>
              )}
           </div>

           {hasChanges && (
              <button 
                onClick={handleSaveBranding} 
                className="fixed bottom-10 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-10 z-[100] px-10 py-5 bg-indigo-600 text-white rounded-full font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:scale-110 active:scale-95 transition-all"
              >
                 SAUVEGARDER LE DESIGN
              </button>
           )}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-6 md:space-y-10">
           <div className="flex justify-between items-center"><h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter">Catalogue</h2><button onClick={() => setIsAddingProduct(true)} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl">NOUVEAU PRODUIT</button></div>
           <div className="bg-white rounded-2xl border-2 border-slate-50 shadow-sm overflow-hidden"><table className="w-full text-left text-xs"><tbody className="divide-y">{products.map(p => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors"><td className="px-4 py-3 md:px-6 md:py-4 flex items-center space-x-4"><img src={p.image} className="w-12 h-12 rounded-xl object-cover border" /><span className="font-black text-slate-900 truncate max-w-[150px]">{p.name}</span></td><td className="px-4 py-3 md:px-6 md:py-4 text-right"><button onClick={() => setIsEditingProduct(p)} className="text-indigo-600 font-black text-[9px] uppercase mr-6">Éditer</button><button onClick={() => deleteProduct(p.id)} className="text-rose-400 font-black text-[9px] uppercase">Effacer</button></td></tr>
           ))}</tbody></table></div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-6 md:space-y-10">
           <div className="flex justify-between items-center"><h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter">Collections</h2><button onClick={() => setIsAddingCategory(true)} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl">NOUVELLE COLLECTION</button></div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{categories.map(cat => (
              <div key={cat.id} className="bg-white p-6 rounded-3xl border-2 border-slate-50 shadow-sm hover:shadow-lg transition-all flex flex-col items-center text-center">
                 <img src={cat.image} className="w-full h-32 rounded-2xl object-cover mb-4 border" />
                 <h3 className="font-black text-lg mb-4">{cat.name}</h3>
                 <div className="flex gap-4 w-full pt-4 border-t">
                    <button onClick={() => setIsEditingCategory(cat)} className="flex-1 text-[9px] font-black uppercase text-indigo-600">Éditer</button>
                    <button onClick={() => deleteCategory(cat.id)} className="flex-1 text-[9px] font-black uppercase text-rose-500">Supprimer</button>
                 </div>
              </div>
           ))}</div>
        </div>
      )}

      {(isAddingProduct || isEditingProduct) && (
        <ProductFormModal 
          product={isEditingProduct} 
          categories={categories} 
          onClose={() => { setIsAddingProduct(false); setIsEditingProduct(null); }} 
          onSave={p => { if(isEditingProduct) updateProduct(p); else addProduct(p); setIsAddingProduct(false); setIsEditingProduct(null); }} 
        />
      )}

      {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onUpdate={updateOrderStatus} />}
      {(isAddingCategory || isEditingCategory) && <CategoryFormModal category={isEditingCategory} onClose={() => { setIsAddingCategory(false); setIsEditingCategory(null); }} onSave={c => { if(isEditingCategory) updateCategory(c); else addCategory(c); setIsAddingCategory(false); setIsEditingCategory(null); }} />}
    </div>
  );
};

const SectionCard: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
  <div className="bg-white p-6 md:p-10 rounded-[2rem] border-2 border-slate-50 shadow-sm space-y-6">
     <h3 className="font-black text-base md:text-xl text-slate-900 tracking-tight border-l-4 border-indigo-500 pl-4">{title}</h3>
     {children}
  </div>
);

const ColorInput: React.FC<{label: string; value: string; onChange: (v: string) => void}> = ({label, value, onChange}) => (
  <div className="space-y-2">
    <p className="text-[9px] font-black uppercase text-slate-400">{label}</p>
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border-2 border-slate-100">
       <input type="color" value={value} onChange={e => onChange(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0" />
       <span className="text-[10px] font-mono font-black">{value.toUpperCase()}</span>
    </div>
  </div>
);

const SocialInput: React.FC<{icon: string; label: string; value?: string; onChange: (v: string) => void}> = ({icon, label, value, onChange}) => (
  <div className="flex items-center gap-4 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl">
     <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs">{icon}</div>
     <div className="flex-1 space-y-1">
        <p className="text-[9px] font-black uppercase text-slate-400">{label}</p>
        <input value={value || ''} onChange={e => onChange(e.target.value)} className="w-full bg-transparent border-0 p-0 font-bold text-xs outline-none focus:ring-0" placeholder="https://..." />
     </div>
  </div>
);

const OrderDetailsModal: React.FC<{order: Order; onClose: () => void; onUpdate: (id: string, s: Order['status']) => void}> = ({order, onClose, onUpdate}) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 backdrop-blur-xl bg-slate-900/70 overflow-y-auto no-scrollbar">
     <div className="bg-white rounded-[2rem] w-full max-w-lg p-6 md:p-12 shadow-2xl relative animate-in zoom-in duration-300">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 md:top-10 md:right-10 p-2 md:p-4 text-slate-900 hover:scale-110 transition-all z-10"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="space-y-8 md:space-y-12">
           <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">Commande #{order.id}</h3>
           
           <div className="p-6 md:p-10 bg-slate-50 rounded-[2rem] space-y-8 border-2 border-slate-100/50">
              <div className="space-y-1">
                 <p className="text-[9px] font-black uppercase text-indigo-500 tracking-widest">Client</p>
                 <p className="font-black text-slate-900 text-2xl md:text-3xl leading-none">{order.customerName}</p>
              </div>
              
              <div className="space-y-1">
                 <p className="text-[9px] font-black uppercase text-indigo-500 tracking-widest">Contact</p>
                 <p className="font-black text-indigo-600 text-xl md:text-2xl">{order.phone}</p>
              </div>
              
              <div className="space-y-1">
                 <p className="text-[9px] font-black uppercase text-indigo-500 tracking-widest">Localisation</p>
                 <p className="font-black text-slate-900 text-sm md:text-base uppercase tracking-tight">{order.wilaya} — {order.commune}</p>
                 {order.address && <p className="text-xs text-slate-400 font-bold mt-2 leading-relaxed">{order.address}</p>}
              </div>

              <div className="pt-6 border-t-2 border-slate-100/50 flex items-center justify-between">
                 <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Mode de livraison</span>
                 <span className="px-5 py-2 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">{order.deliveryType}</span>
              </div>
           </div>

           <div className="space-y-6">
              <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Articles commandés</p>
              <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                 {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-4 bg-white border-2 border-slate-50 rounded-2xl items-center shadow-sm">
                       <img src={item.image} className="w-14 h-14 rounded-xl object-cover border" />
                       <div className="flex-1 space-y-0.5">
                          <p className="font-black text-slate-900 text-[11px] leading-tight">{item.name}</p>
                          <p className="text-[9px] font-black text-indigo-500 uppercase">x{item.quantity} — {(item.selectedVariant?.price || item.price).toLocaleString()} DZD</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="pt-8 border-t-2 border-slate-100 flex flex-col items-end gap-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Final</p>
              <p className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">{order.total.toLocaleString()} DZD</p>
           </div>

           <div className="flex flex-col md:flex-row gap-4">
              <select 
                value={order.status} 
                onChange={e => onUpdate(order.id, e.target.value as any)} 
                className="w-full p-5 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] outline-none shadow-xl cursor-pointer hover:bg-black transition-colors"
              >
                 <option value="pending">EN ATTENTE</option>
                 <option value="confirmed">CONFIRMÉ</option>
                 <option value="shipped">EXPÉDIÉ</option>
                 <option value="delivered">LIVRÉ</option>
                 <option value="cancelled">ANNULÉ</option>
              </select>
           </div>
        </div>
     </div>
  </div>
);

const CategoryFormModal: React.FC<{category: Category | null; onClose: () => void; onSave: (c: Category) => void}> = ({category, onClose, onSave}) => {
  const [formData, setFormData] = useState<Category>(category || { id: Math.random().toString(36).substr(2, 6).toUpperCase(), name: '', description: '', image: '' });
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-xl bg-slate-900/70">
       <div className="bg-white rounded-[3rem] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in duration-300">
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-10 text-center uppercase tracking-widest">Collection</h3>
          <div className="space-y-8">
             <div className="flex flex-col items-center gap-6">
                <div className="w-40 h-40 rounded-[2.5rem] border-4 border-slate-50 overflow-hidden flex items-center justify-center p-2 bg-slate-50 shadow-inner">
                   {formData.image ? <img src={formData.image} className="w-full h-full object-cover rounded-2xl" /> : <div className="text-5xl opacity-10">🖼️</div>}
                </div>
                <label className="w-full cursor-pointer"><div className="w-full py-4 bg-slate-900 text-white text-center rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">CHOISIR IMAGE</div><input type="file" onChange={async e => { if(e.target.files?.[0]) { const b = await fileToBase64(e.target.files[0]); setFormData({...formData, image: b}); } }} className="hidden" /></label>
             </div>
             <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-indigo-500">Nom de la collection</p>
                <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-base focus:border-indigo-500 outline-none transition-all" placeholder="Mode, Accessoires..." />
             </div>
             <div className="flex flex-col gap-4 pt-6">
                <button onClick={() => { if(!formData.name) return; onSave(formData); }} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95">ENREGISTRER</button>
                <button onClick={onClose} className="w-full py-3 font-black text-slate-400 uppercase text-[10px] tracking-widest hover:text-slate-900">ANNULER</button>
             </div>
          </div>
       </div>
    </div>
  );
};

const ProductFormModal: React.FC<{ product: Product | null; categories: Category[]; onClose: () => void; onSave: (p: Product) => void; }> = ({ product, categories, onClose, onSave }) => {
  const { notify } = useApp();
  const [formData, setFormData] = useState<Product>(product || { id: Math.random().toString(36).substr(2, 9), name: '', description: '', price: 0, image: '', images: [], categoryId: categories[0]?.id || '', variants: [], rating: 4.8, reviewCount: 12, reviews: [], variantDisplayType: 'select' });
  const [newVariant, setNewVariant] = useState<Partial<ProductVariant>>({ name: '', price: 0, stock: 10, type: 'standard', color: '#000000' });

  const addVariant = () => {
    if(!newVariant.name) { notify("Veuillez donner un nom à la variante.", "error"); return; }
    const v: ProductVariant = {
      id: Math.random().toString(36).substr(2, 5),
      name: newVariant.name!,
      price: newVariant.price || formData.price,
      stock: newVariant.stock || 10,
      type: newVariant.type as 'standard' | 'color',
      color: newVariant.type === 'color' ? newVariant.color : undefined
    };
    setFormData({...formData, variants: [...formData.variants, v]});
    setNewVariant({ name: '', price: 0, stock: 10, type: 'standard', color: '#000000' });
    notify("Variante ajoutée.");
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 md:p-4 backdrop-blur-3xl bg-slate-900/80 overflow-y-auto no-scrollbar">
      <div className="bg-white rounded-[3rem] md:rounded-[4rem] w-full max-w-6xl max-h-[95vh] overflow-y-auto p-6 md:p-16 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] relative animate-in zoom-in duration-300 no-scrollbar">
        <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-16 text-center uppercase tracking-widest">Édition Produit</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="space-y-10">
             <div className="space-y-6">
                <div className="space-y-2"><p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Nom de l'article</p><input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-lg focus:border-indigo-500 outline-none" /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div className="space-y-2"><p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Collection</p><select value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black focus:border-indigo-500 outline-none">{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                   <div className="space-y-2"><p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Prix de base (DZD)</p><input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value) || 0})} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black focus:border-indigo-500 outline-none" /></div>
                </div>
                <div className="space-y-2"><p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Description complète</p><textarea rows={5} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-xs leading-relaxed focus:border-indigo-500 outline-none" placeholder="Détails, caractéristiques..." /></div>
             </div>

             <div className="p-6 bg-slate-50 rounded-[2rem] border-2 border-slate-100 space-y-4">
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Type d'affichage des variantes</p>
                <select value={formData.variantDisplayType} onChange={e => setFormData({...formData, variantDisplayType: e.target.value as VariantDisplayType})} className="w-full p-4 bg-white border-2 border-slate-100 rounded-xl font-black text-[10px] uppercase tracking-widest outline-none">
                   <option value="select">Liste Déroulante (Standard)</option>
                   <option value="radio">Boutons Radio (Grille)</option>
                   <option value="color">Pastilles Couleurs (Swatches)</option>
                </select>
             </div>
          </div>

          <div className="space-y-12">
             <div className="flex flex-col items-center gap-8">
                <div className="w-52 h-52 rounded-[3rem] border-8 border-slate-50 overflow-hidden flex items-center justify-center p-2 bg-white shadow-2xl relative group">
                   {formData.image ? <img src={formData.image} className="w-full h-full object-cover rounded-[2rem]" /> : <div className="text-4xl opacity-10">📸</div>}
                   <label className="absolute inset-0 cursor-pointer bg-slate-900/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <span className="text-white font-black text-[9px] uppercase tracking-widest">Remplacer</span>
                      <input type="file" onChange={async e => { if(e.target.files?.[0]) { const b = await fileToBase64(e.target.files[0]); setFormData({...formData, image: b}); } }} className="hidden" />
                   </label>
                </div>
                
                <div className="w-full space-y-4 text-center">
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Images Secondaires (Galerie)</p>
                   <div className="flex flex-wrap justify-center gap-4">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm group">
                           <img src={img} className="w-full h-full object-cover" />
                           <button onClick={() => setFormData({...formData, images: formData.images.filter((_, i) => i !== idx)})} className="absolute inset-0 bg-rose-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-black text-[8px]">X</button>
                        </div>
                      ))}
                      {formData.images.length < 4 && (
                        <label className="w-20 h-20 rounded-2xl border-4 border-dashed border-slate-100 flex items-center justify-center text-slate-200 cursor-pointer hover:bg-slate-50 transition-all font-black text-2xl">
                           + <input type="file" multiple onChange={async e => { if(e.target.files) { 
                             // Fix for line 725: Explicitly cast unknown files to File array
                             const files = Array.from(e.target.files) as File[]; 
                             const base64s = await Promise.all(files.map(f => fileToBase64(f))); 
                             setFormData({...formData, images: [...formData.images, ...base64s].slice(0, 4)}); 
                           } }} className="hidden" />
                        </label>
                      )}
                   </div>
                </div>
             </div>

             <div className="p-10 bg-slate-900 rounded-[3rem] text-white space-y-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)]">
                <div className="flex justify-between items-center border-b border-white/10 pb-6">
                   <h4 className="font-black text-xl text-indigo-400 uppercase tracking-tighter">Variantes</h4>
                   <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
                      <button onClick={() => setNewVariant({...newVariant, type: 'standard'})} className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase transition-all ${newVariant.type === 'standard' ? 'bg-white text-slate-900 shadow-xl' : 'text-white/40 hover:text-white'}`}>Standard</button>
                      <button onClick={() => setNewVariant({...newVariant, type: 'color'})} className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase transition-all ${newVariant.type === 'color' ? 'bg-white text-slate-900 shadow-xl' : 'text-white/40 hover:text-white'}`}>Couleur</button>
                   </div>
                </div>
                
                <div className="space-y-6">
                   <div className="flex flex-col gap-4">
                      <div className="space-y-1.5">
                         <p className="text-[9px] font-black uppercase text-white/30 tracking-widest">Nom de l'option (ex: XL, Rouge...)</p>
                         <input value={newVariant.name} onChange={e => setNewVariant({...newVariant, name: e.target.value})} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-white text-sm focus:bg-white/10 outline-none transition-all" placeholder="Entrez un nom..." />
                      </div>

                      <div className="flex gap-4 items-end">
                         <div className="flex-1 space-y-1.5">
                            <p className="text-[9px] font-black uppercase text-white/30 tracking-widest">Prix Variante (DZD)</p>
                            <input type="number" value={newVariant.price} onChange={e => setNewVariant({...newVariant, price: parseInt(e.target.value) || 0})} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl font-black text-white text-sm outline-none" />
                         </div>
                         {newVariant.type === 'color' && (
                           <div className="space-y-1.5">
                              <p className="text-[9px] font-black uppercase text-white/30 tracking-widest text-center">Couleur</p>
                              <input type="color" value={newVariant.color} onChange={e => setNewVariant({...newVariant, color: e.target.value})} className="w-16 h-16 rounded-2xl cursor-pointer bg-white/5 border-2 border-white/10 p-1" />
                           </div>
                         )}
                      </div>

                      <button onClick={addVariant} className="w-full py-5 bg-indigo-500 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(99,102,241,0.5)] active:scale-95 transition-all mt-4">AJOUTER LA VARIANTE</button>
                   </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-6 border-t border-white/10">
                   {formData.variants.map((v, i) => (
                      <span key={v.id} className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase flex items-center gap-4 group hover:bg-white/10 transition-all">
                        {v.type === 'color' && <div className="w-3.5 h-3.5 rounded-full border-2 border-white/20 shadow-sm" style={{backgroundColor:v.color}} />}
                        <span className="tracking-widest">{v.name}</span>
                        <span className="opacity-40 font-mono text-[9px]">{v.price} DZD</span>
                        <button onClick={() => setFormData({...formData, variants: formData.variants.filter((_, idx) => idx !== i)})} className="text-rose-400 font-black text-lg ml-2 hover:scale-125 transition-transform">×</button>
                      </span>
                   ))}
                   {formData.variants.length === 0 && <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest italic w-full text-center py-4">Aucune variante configurée.</p>}
                </div>
             </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col sm:flex-row justify-center gap-6 pt-12 border-t-2 border-slate-50">
           <button onClick={onClose} className="px-12 py-5 font-black text-slate-400 uppercase text-[11px] tracking-widest hover:text-slate-900 transition-colors">Annuler les modifications</button>
           <button onClick={() => { if(!formData.name || !formData.image) { notify("Nom et image principale requis.", "error"); return; } onSave(formData); }} className="px-20 py-6 bg-slate-900 text-white rounded-full font-black text-xs md:text-sm uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-95 hover:bg-black">SAUVEGARDER L'ARTICLE</button>
        </div>
      </div>
    </div>
  );
};
