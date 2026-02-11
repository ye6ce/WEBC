
import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../AppContext';
import { Product } from '../types';

const ProductCard: React.FC<{ 
  product: Product; 
  categoryName?: string; 
  onClick: (id: string) => void;
}> = ({ product, categoryName, onClick }) => {
  const { theme } = useApp();
  const displayPrice = product.variants.length > 0 
    ? Math.min(...product.variants.map(v => v.price)) 
    : product.price;

  const roundnessMap = { none: '0px', sm: '4px', md: '12px', lg: '1.5rem', full: '9999px' };

  return (
    <div 
      onClick={() => onClick(product.id)}
      className="group p-3 md:p-4 border transition-all hover:shadow-xl cursor-pointer"
      style={{ 
        backgroundColor: theme.cardBgColor, 
        color: theme.cardTextColor, 
        borderColor: `${theme.cardTextColor}15`,
        borderRadius: roundnessMap[theme.cardRoundness]
      }}
    >
      <div className="aspect-[4/5] overflow-hidden mb-4 md:mb-6 bg-slate-50" style={{ borderRadius: roundnessMap[theme.cardRoundness] }}>
        <img src={product.image} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
      </div>
      <div className="space-y-1 md:space-y-2 px-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-black text-base md:text-lg tracking-tight leading-tight line-clamp-1">{product.name}</h3>
          <span className="shrink-0 text-[8px] md:text-[9px] font-black uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-full" style={{ color: theme.primaryColor }}>{categoryName}</span>
        </div>
        <p className="text-lg md:text-xl font-black">{displayPrice.toLocaleString()} DZD</p>
      </div>
      <button 
        className="w-full py-3 md:py-4 mt-4 md:mt-6 font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-lg transition-all active:scale-95"
        style={{ 
          backgroundColor: theme.buttonBgColor, 
          color: theme.buttonTextColor,
          borderRadius: roundnessMap[theme.buttonRoundness]
        }}
      >
        Détails
      </button>
    </div>
  );
};

export const Shop: React.FC<{ initialCategoryId?: string | null, onProductClick: (id: string) => void }> = ({ initialCategoryId, onProductClick }) => {
  const { products, categories, theme, t } = useApp();
  const [activeCat, setActiveCat] = useState<string>(initialCategoryId || 'all');
  const [priceSort, setPriceSort] = useState<'low' | 'high' | 'none'>('none');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    setActiveCat(initialCategoryId || 'all');
  }, [initialCategoryId]);

  const filtered = useMemo(() => {
    let result = products;
    if (activeCat !== 'all') {
      result = result.filter(p => p.categoryId === activeCat);
    }
    if (searchQuery) {
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (priceSort === 'low') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (priceSort === 'high') {
      result = [...result].sort((a, b) => b.price - a.price);
    }
    return result;
  }, [products, activeCat, priceSort, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20" style={{ color: theme.textColor }}>
      <div className="mb-10 md:mb-20 space-y-4 md:space-y-6 text-center lg:text-left">
         <h1 className="text-4xl md:text-6xl font-black tracking-tighter">{t('shop')}</h1>
         <p className="opacity-50 font-bold uppercase tracking-[0.2em] text-[10px] md:text-[11px]">Découvrez notre catalogue premium.</p>
      </div>

      <div className="lg:grid lg:grid-cols-4 gap-12 lg:gap-16">
        <div className="lg:hidden mb-8">
           <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full flex items-center justify-center space-x-3 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl"
           >
              <span>{isFilterOpen ? 'Fermer Filtres' : 'Filtres & Recherche'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
           </button>
        </div>

        <aside className={`${isFilterOpen ? 'block' : 'hidden'} lg:block space-y-10 md:space-y-12 mb-12 lg:mb-0`}>
          <div className="space-y-4 md:space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">Rechercher</h4>
            <input 
              type="text" 
              placeholder="QUEL ARTICLE ?" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none font-black uppercase text-[10px] tracking-widest focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          <div className="space-y-4 md:space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">Catégories</h4>
            <div className="flex flex-col space-y-2 md:space-y-3">
               <button 
                onClick={() => { setActiveCat('all'); setIsFilterOpen(false); }}
                className={`text-left text-[11px] md:text-sm font-bold transition-all px-4 py-2 md:py-3 rounded-lg md:rounded-xl ${activeCat === 'all' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
               >
                 {t('all').toUpperCase()}
               </button>
               {categories.map(cat => (
                 <button 
                  key={cat.id}
                  onClick={() => { setActiveCat(cat.id); setIsFilterOpen(false); }}
                  className={`text-left text-[11px] md:text-sm font-bold transition-all px-4 py-2 md:py-3 rounded-lg md:rounded-xl ${activeCat === cat.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
                 >
                   {cat.name.toUpperCase()}
                 </button>
               ))}
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">Trier par Prix</h4>
            <select 
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value as any)}
              className="w-full px-6 py-3 md:py-4 bg-slate-50 border rounded-xl md:rounded-2xl font-black text-[10px] outline-none"
            >
               <option value="none">DEFAUT</option>
               <option value="low">PRIX CROISSANT</option>
               <option value="high">PRIX DECROISSANT</option>
            </select>
          </div>
        </aside>

        <div className="lg:col-span-3">
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 md:gap-10">
            {filtered.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                categoryName={categories.find(c => c.id === product.categoryId)?.name} 
                onClick={onProductClick}
              />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full py-20 md:py-40 text-center space-y-4">
                 <div className="text-4xl opacity-20">🔎</div>
                 <p className="opacity-20 font-black uppercase text-[10px] tracking-[0.3em]">{t('no_results')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
