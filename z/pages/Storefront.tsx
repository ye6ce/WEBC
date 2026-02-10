
import React from 'react';
import { useApp } from '../AppContext';
import { Product, Category, SectionConfig, SectionType } from '../types';

const AnimatedSection: React.FC<{ config: SectionConfig; children: React.ReactNode; id?: string }> = ({ config, children, id }) => {
  if (!config.isVisible) return null;
  const animClass = {
    none: '',
    fade: 'animate-in fade-in duration-1000',
    slide: 'animate-in slide-in-from-bottom-12 duration-1000',
    zoom: 'animate-in zoom-in duration-1000',
    bounce: 'animate-in slide-in-from-bottom-24 duration-1000 ease-out'
  }[config.animation];

  const alignmentClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  }[config.alignment];

  return (
    <section id={id} className={`transition-all duration-500 ${animClass}`} style={{ backgroundColor: config.bgColor, color: config.textColor }}>
      <div className={`max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-32 flex flex-col ${alignmentClass}`}>
        {children}
      </div>
    </section>
  );
};

export const Storefront: React.FC<{ onProductClick: (id: string) => void; onCategoryClick: (id: string) => void }> = ({ onProductClick, onCategoryClick }) => {
  const { products, categories, theme } = useApp();

  const renderSection = (type: SectionType) => {
    switch (type) {
      case 'hero':
        if (!theme.hero.isVisible) return null;
        return (
          <section key="hero" className={`transition-all duration-500 overflow-hidden relative min-h-[75vh] md:min-h-[85vh] flex items-center ${theme.hero.alignment === 'center' ? 'justify-center text-center' : theme.hero.alignment === 'right' ? 'justify-end text-right' : 'justify-start text-left'}`} style={{ backgroundColor: theme.hero.bgColor, color: theme.hero.textColor }}>
               <div className="absolute inset-0 z-0"><img src={theme.hero.bgImageUrl} className="w-full h-full object-cover grayscale brightness-[0.3]" alt="Hero background" /></div>
               <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full py-16 md:py-24">
                  <div className={`space-y-8 flex flex-col ${theme.hero.alignment === 'center' ? 'items-center' : theme.hero.alignment === 'right' ? 'items-end' : 'items-start'}`}>
                     <h1 className="text-4xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] drop-shadow-2xl">{theme.hero.title}</h1>
                     <p className="text-base md:text-2xl font-medium opacity-80 max-w-2xl leading-relaxed">{theme.hero.subtitle}</p>
                     <button 
                      onClick={() => { if(theme.hero.buttonLink === 'shop') document.getElementById('featured')?.scrollIntoView({behavior:'smooth'}); else onCategoryClick(theme.hero.buttonLink); }} 
                      className="px-10 md:px-12 py-5 md:py-6 rounded-full font-black text-[10px] md:text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-all active:scale-95" 
                      style={{backgroundColor: theme.primaryColor, color: '#fff'}}
                     >
                        {theme.hero.buttonText}
                     </button>
                  </div>
               </div>
          </section>
        );
      
      case 'categories':
        if (!theme.categories.isVisible) return null;
        return (
          <AnimatedSection key="categories" config={theme.categories}>
            <div className="w-full">
              <div className={`mb-16 md:mb-24 flex flex-col ${theme.categories.alignment === 'center' ? 'items-center' : theme.categories.alignment === 'right' ? 'items-end' : 'items-start'}`}>
                 <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-none">{theme.categories.title}</h2>
                 <p className="opacity-50 font-bold uppercase tracking-[0.3em] text-[8px] md:text-xs mt-4">{theme.categories.subtitle}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                 {categories.map(cat => (
                   <div key={cat.id} onClick={() => onCategoryClick(cat.id)} className="group relative cursor-pointer overflow-hidden shadow-xl transition-all rounded-[2rem] md:rounded-[3rem] h-[350px] md:h-[500px]">
                      {cat.image && <img src={cat.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" alt={cat.name} />}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/10 to-transparent flex flex-col justify-end p-8 md:p-12">
                         <h3 className="text-white font-black text-2xl md:text-4xl tracking-tighter mb-2">{cat.name}</h3>
                         <div className="w-8 md:w-12 h-1 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          </AnimatedSection>
        );

      case 'featured':
        if (!theme.featured.isVisible) return null;
        return (
          <AnimatedSection key="featured" config={theme.featured} id="featured">
             <div className="w-full">
              <div className={`flex flex-col md:flex-row justify-between items-center md:items-end mb-16 md:mb-24 gap-8 ${theme.featured.alignment === 'center' ? 'text-center' : theme.featured.alignment === 'right' ? 'text-right' : 'text-left'}`}>
                 <div className={`flex flex-col ${theme.featured.alignment === 'center' ? 'items-center' : theme.featured.alignment === 'right' ? 'items-end' : 'items-start'}`}>
                    <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-none">{theme.featured.title}</h2>
                    <p className="opacity-50 font-bold uppercase tracking-[0.3em] text-[8px] md:text-xs mt-4">{theme.featured.subtitle}</p>
                 </div>
                 <button onClick={() => onCategoryClick('all')} className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] border-b-4 pb-2 transition-all hover:opacity-50 shrink-0" style={{ borderColor: theme.primaryColor }}>Voir Tout</button>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-12">
                 {products.slice(0,8).map(p => (
                   <div key={p.id} onClick={() => onProductClick(p.id)} className="group cursor-pointer">
                      <div className="aspect-[4/5] overflow-hidden bg-slate-50 mb-4 md:mb-8 transition-all duration-1000 hover:shadow-2xl rounded-2xl md:rounded-[3rem] border border-slate-50">
                         <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" alt={p.name} />
                      </div>
                      <h3 className="font-black text-sm md:text-xl truncate mb-1 md:mb-2">{p.name}</h3>
                      <p className="font-black text-indigo-600 text-base md:text-2xl tracking-tighter">{p.price.toLocaleString()} DZD</p>
                   </div>
                 ))}
              </div>
             </div>
          </AnimatedSection>
        );

      case 'quotes':
        if (!theme.quotes.isVisible) return null;
        return (
          <AnimatedSection key="quotes" config={theme.quotes}>
            <div className={`w-full max-w-5xl flex flex-col ${theme.quotes.alignment === 'center' ? 'items-center' : theme.quotes.alignment === 'right' ? 'items-end' : 'items-start'}`}>
              <div className="mb-16 md:mb-24">
                 <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">{theme.quotes.title}</h2>
                 <p className="opacity-50 font-bold uppercase tracking-[0.3em] text-[8px] md:text-xs mt-4">{theme.quotes.subtitle}</p>
              </div>
              <div className="space-y-12 md:space-y-20 w-full">
                 {theme.quotes.items.map((q, i) => (
                   <div key={q.id} className={`flex items-start gap-4 md:gap-10 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                      <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-slate-900 flex items-center justify-center text-white font-black shrink-0 text-xl md:text-4xl shadow-xl uppercase">{q.sender[0]}</div>
                      <div className={`p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl max-w-[90%] relative ${i % 2 === 0 ? 'rounded-tl-none' : 'rounded-tr-none'}`} style={{ backgroundColor: theme.quotes.bgColor, color: theme.quotes.textColor }}>
                         <div className={`absolute top-0 ${i % 2 === 0 ? '-left-3' : '-right-3'} w-8 h-8 rotate-45`} style={{ backgroundColor: theme.quotes.bgColor }} />
                         <p className="text-base md:text-2xl font-black leading-relaxed mb-6 md:mb-8 italic">"{q.text}"</p>
                         <div className="flex items-center gap-4">
                            <div className="w-8 md:w-12 h-1 bg-current opacity-20" />
                            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] opacity-60 truncate">{q.sender}</p>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          </AnimatedSection>
        );

      case 'banner':
        if (!theme.banner.isVisible) return null;
        return (
          <AnimatedSection key="banner" config={theme.banner}>
             <div className="py-16 md:py-32 text-center">
                <h2 className="text-3xl md:text-7xl font-black uppercase tracking-[0.3em] mb-6 md:mb-12 leading-none">{theme.banner.title}</h2>
                <p className="text-sm md:text-4xl font-black uppercase opacity-80 tracking-widest">{theme.banner.subtitle}</p>
             </div>
          </AnimatedSection>
        );

      case 'features':
        if (!theme.features.isVisible) return null;
        return (
          <AnimatedSection key="features" config={theme.features}>
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24">
               {[
                 {title: theme.features.f1Title, desc: theme.features.f1Desc, icon: '🚚'},
                 {title: theme.features.f2Title, desc: theme.features.f2Desc, icon: '💎'},
                 {title: theme.features.f3Title, desc: theme.features.f3Desc, icon: '🤝'}
               ].map((f, i) => (
                 <div key={i} className="space-y-10 p-10 md:p-16 bg-white/5 backdrop-blur-3xl rounded-[3rem] md:rounded-[5rem] shadow-2xl transition-all hover:scale-105 group border border-white/10 hover:border-white/20 text-center">
                    <div className="text-6xl md:text-9xl mb-10 group-hover:rotate-12 transition-transform duration-700 drop-shadow-2xl">{f.icon}</div>
                    <div className="space-y-6">
                       <h4 className="text-2xl md:text-4xl font-black tracking-tighter">{f.title}</h4>
                       <p className="opacity-60 text-sm md:text-xl font-medium leading-relaxed">{f.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </AnimatedSection>
        );
      
      default:
        return null;
    }
  };

  return (
    <main className="overflow-x-hidden transition-all duration-700" style={{ backgroundColor: theme.backgroundColor }}>
      {theme.sectionOrder.map(section => renderSection(section))}
    </main>
  );
};
