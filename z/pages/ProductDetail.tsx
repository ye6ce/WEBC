
import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { Product, ProductVariant, Review } from '../types';
import { Icons, WILAYAS_ALGERIA } from '../constants';

interface ProductDetailProps {
  productId: string;
  onBack: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ productId, onBack }) => {
  const { products, categories, theme, deliveryPrices, addToCart, submitOrder, t, language } = useApp();
  const product = products.find(p => p.id === productId);
  
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <p className="text-gray-400 font-black uppercase tracking-widest text-center">{t('no_results')}</p>
    </div>
  );

  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(product.variants[0]?.id);
  const [currentImage, setCurrentImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    wilaya: WILAYAS_ALGERIA[15],
    commune: '',
    address: '',
    deliveryType: 'domicile' as 'domicile' | 'bureau'
  });

  const selectedVariant = product.variants.find(v => v.id === selectedVariantId);
  const displayPrice = selectedVariant?.price || product.price;
  const allImages = [product.image, ...(product.images || [])];

  const selectedWilaya = deliveryPrices.find(p => p.wilaya === orderForm.wilaya);
  const deliveryFee = selectedWilaya ? (orderForm.deliveryType === 'domicile' ? selectedWilaya.domicile : selectedWilaya.bureau) : 0;
  const productTotal = displayPrice * quantity;
  const grandTotal = productTotal + deliveryFee;

  const roundnessMap = { none: '0px', sm: '4px', md: '12px', lg: '1.5rem', full: '9999px' };
  const btnRadius = roundnessMap[theme.buttonRoundness] || '2rem';
  const cardRadius = roundnessMap[theme.cardRoundness] || '2rem';

  useEffect(() => { setCurrentImage(product.image); }, [product]);
  useEffect(() => { if (selectedVariant?.image) setCurrentImage(selectedVariant.image); }, [selectedVariant]);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderForm.name || !orderForm.phone) { alert("Champs obligatoires."); return; }
    setIsSubmitting(true);
    try {
      await submitOrder({
        customerName: orderForm.name,
        phone: orderForm.phone,
        wilaya: orderForm.wilaya,
        commune: orderForm.commune,
        address: orderForm.address,
        deliveryType: orderForm.deliveryType,
        deliveryFee: deliveryFee,
        items: [{ ...product, selectedVariant, quantity }],
        total: grandTotal,
      });
      setOrderSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally { setIsSubmitting(false); }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 md:py-40 text-center animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8"><Icons.Sparkles /></div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-4">{t('order_success')}</h2>
        <p className="text-slate-500 font-medium mb-10 text-sm md:text-base">Merci pour votre confiance.</p>
        <button onClick={onBack} className="w-full sm:w-auto px-12 py-5 bg-slate-900 text-white font-black text-xs uppercase tracking-widest shadow-xl transition-all" style={{ borderRadius: btnRadius }}>{t('home')}</button>
      </div>
    );
  }

  const renderVariants = () => {
    if (product.variants.length === 0) return null;

    if (product.variantDisplayType === 'color') {
      return (
        <div className="space-y-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('colors')}</span>
          <div className="flex flex-wrap gap-3">
            {product.variants.map((v) => (
              <button 
                key={v.id} 
                onClick={() => setSelectedVariantId(v.id)} 
                className={`w-10 h-10 rounded-full border-2 transition-all ${selectedVariantId === v.id ? 'scale-110 shadow-lg' : 'border-slate-100 hover:border-slate-300'}`} 
                style={{ backgroundColor: v.color || '#ccc', borderColor: selectedVariantId === v.id ? theme.primaryColor : 'transparent' }} 
              />
            ))}
          </div>
        </div>
      );
    }

    if (product.variantDisplayType === 'radio') {
      return (
        <div className="space-y-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('variants')}</span>
          <div className="flex flex-col gap-2">
            {product.variants.map((v) => (
              <label key={v.id} className={`flex items-center justify-between p-4 border-2 cursor-pointer transition-all ${selectedVariantId === v.id ? 'bg-indigo-50/50' : 'border-slate-100'}`} style={{ borderRadius: cardRadius, borderColor: selectedVariantId === v.id ? theme.primaryColor : 'transparent' }} onClick={() => setSelectedVariantId(v.id)}>
                <div className="flex items-center gap-3">
                   <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: selectedVariantId === v.id ? theme.primaryColor : '#cbd5e1' }}>
                      {selectedVariantId === v.id && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primaryColor }} />}
                   </div>
                   <span className="text-xs font-black uppercase tracking-widest">{v.name}</span>
                </div>
                <span className="text-xs font-black">{v.price.toLocaleString()} DZD</span>
              </label>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('variants')}</span>
        <select 
          value={selectedVariantId} 
          onChange={(e) => setSelectedVariantId(e.target.value)} 
          className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-xs uppercase outline-none"
        >
          {product.variants.map(v => <option key={v.id} value={v.id}>{v.name} - {v.price.toLocaleString()} DZD</option>)}
        </select>
      </div>
    );
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 md:px-10 py-8 md:py-20 animate-in fade-in duration-700 overflow-x-hidden ${language === 'ar' ? 'font-arabic' : ''}`} style={{ color: theme.textColor }}>
      <div className="mb-10 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center space-x-2 text-[9px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all"><span>{t('back')}</span></button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
        <div className="space-y-6 md:sticky md:top-32">
          <div className="aspect-square w-full overflow-hidden bg-slate-100 shadow-xl" style={{ borderRadius: cardRadius }}>
            <img src={currentImage} className="w-full h-full object-cover transition-opacity duration-500" />
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-4 no-scrollbar">
            {allImages.map((img, i) => (
              <button key={i} onClick={() => setCurrentImage(img)} className={`w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${currentImage === img ? 'scale-105' : 'border-transparent opacity-60'}`} style={{ borderColor: currentImage === img ? theme.primaryColor : 'transparent' }}><img src={img} className="w-full h-full object-cover" /></button>
            ))}
          </div>
        </div>

        <div className="space-y-8 md:space-y-12">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-6xl font-black tracking-tighter leading-tight">{product.name}</h1>
            <p className="text-2xl md:text-4xl font-black tracking-tighter" style={{ color: theme.primaryColor }}>{displayPrice.toLocaleString()} DZD</p>
          </div>

          <p className="text-sm md:text-lg opacity-60 font-medium leading-relaxed max-w-xl">{product.description}</p>

          {renderVariants()}

          <div className="space-y-10 pt-8 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center bg-slate-50 rounded-2xl border w-full sm:w-auto">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-14 font-black text-slate-400 hover:text-slate-900">-</button>
                <span className="w-10 text-center font-black text-sm">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-14 font-black text-slate-400 hover:text-slate-900">+</button>
              </div>
              <button onClick={() => { addToCart(product, selectedVariantId); }} className="w-full py-5 font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95" style={{ backgroundColor: theme.buttonBgColor, color: theme.buttonTextColor, borderRadius: btnRadius }}>{t('add_to_cart')}</button>
            </div>

            <div className="p-6 md:p-10 space-y-8 shadow-inner border" style={{ backgroundColor: theme.cardBgColor, color: theme.cardTextColor, borderRadius: cardRadius, borderColor: `${theme.cardTextColor}10` }}>
              <div className="text-center space-y-1">
                <h3 className="text-2xl font-black tracking-tighter">Vente Directe</h3>
                <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest">Paiement Cash à la Livraison</p>
              </div>

              <form onSubmit={handleOrderSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required value={orderForm.name} onChange={e => setOrderForm({...orderForm, name: e.target.value})} className="w-full px-5 py-4 bg-white/50 rounded-xl outline-none font-bold text-sm border focus:ring-2 focus:ring-indigo-500/20" placeholder="Nom complet" />
                  <input required value={orderForm.phone} onChange={e => setOrderForm({...orderForm, phone: e.target.value})} className="w-full px-5 py-4 bg-white/50 rounded-xl outline-none font-bold text-sm border focus:ring-2 focus:ring-indigo-500/20" placeholder="Téléphone" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <select required value={orderForm.wilaya} onChange={e => setOrderForm({...orderForm, wilaya: e.target.value})} className="w-full px-5 py-4 bg-white/50 rounded-xl outline-none font-bold text-xs uppercase border">
                    {WILAYAS_ALGERIA.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                  <input required value={orderForm.commune} onChange={e => setOrderForm({...orderForm, commune: e.target.value})} className="w-full px-5 py-4 bg-white/50 rounded-xl outline-none font-bold text-sm border focus:ring-2 focus:ring-indigo-500/20" placeholder="Commune" />
                </div>

                <div className="flex gap-2 p-1.5 bg-slate-200/50 rounded-xl">
                   <button type="button" onClick={() => setOrderForm({...orderForm, deliveryType: 'domicile'})} className={`flex-1 py-3 rounded-lg text-[9px] font-black uppercase transition-all ${orderForm.deliveryType === 'domicile' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>{t('domicile')}</button>
                   <button type="button" onClick={() => setOrderForm({...orderForm, deliveryType: 'bureau'})} className={`flex-1 py-3 rounded-lg text-[9px] font-black uppercase transition-all ${orderForm.deliveryType === 'bureau' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>{t('bureau')}</button>
                </div>

                <div className="p-6 bg-white/30 rounded-2xl space-y-3 border shadow-sm">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase opacity-40"><span>{t('price')}</span><span>{productTotal.toLocaleString()} DZD</span></div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase opacity-40"><span>{t('shipping')}</span><span style={{ color: theme.primaryColor }}>+{deliveryFee} DZD</span></div>
                  <div className="pt-3 border-t flex justify-between items-center"><span className="text-xs font-black uppercase">{t('total')}</span><span className="text-2xl font-black">{grandTotal.toLocaleString()} DZD</span></div>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full py-5 font-black text-[11px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 disabled:opacity-50" style={{ backgroundColor: theme.buttonBgColor, color: theme.buttonTextColor, borderRadius: btnRadius }}>{isSubmitting ? '...' : t('confirm_order')}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
