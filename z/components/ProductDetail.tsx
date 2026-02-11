
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../AppContext';
import { ShoppingBag, ChevronLeft, Sparkles, Camera } from 'lucide-react';
import { analyzeProductImage } from '../services/gemini';

const ProductDetail = () => {
  const { id } = useParams();
  const { state, addToCart } = useApp();
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const product = state.products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="py-32 text-center">
        <h1 className="text-2xl font-bold">Piece not found.</h1>
        <Link to="/products" className="text-blue-500 underline">Back to collections</Link>
      </div>
    );
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await analyzeProductImage(product.image);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <Link to="/products" className="flex items-center gap-2 text-xs tracking-widest font-bold text-gray-400 hover:text-black transition-colors mb-12 uppercase">
        <ChevronLeft size={16} /> Back to collections
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        <div className="bg-gray-50 relative x-art-glow overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full object-cover" />
          <div className="absolute top-4 left-4">
            <span className="px-4 py-2 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold tracking-widest uppercase rounded-full border border-white/20">
              {product.category}
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-5xl md:text-6xl serif mb-6">{product.name}</h1>
          <p className="text-2xl font-bold mb-10 tracking-widest">{product.price.toLocaleString()} DZD</p>
          
          <div className="prose prose-sm max-w-none text-gray-600 mb-12 leading-relaxed">
            <p>{product.description}</p>
          </div>

          <div className="space-y-4 mb-12">
            <button 
              onClick={() => addToCart(product)}
              className="w-full py-5 bg-black text-white font-bold tracking-[0.3em] uppercase hover:bg-gray-800 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-4"
            >
              <ShoppingBag size={20} /> ADD TO BAG
            </button>
            
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full py-5 border-2 border-gold-600 text-gold-700 font-bold tracking-[0.3em] uppercase hover:bg-gold-50 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
            >
              {isAnalyzing ? <Sparkles className="animate-pulse" size={20} /> : <Camera size={20} />}
              {isAnalyzing ? 'ANALYZING CRAFTSMANSHIP...' : 'AI VISION ANALYSIS'}
            </button>
          </div>

          {analysis && (
            <div className="bg-gold-50/50 border border-gold-100 p-8 rounded-sm animate-fade-in">
              <div className="flex items-center gap-2 mb-4 text-gold-700">
                <Sparkles size={16} />
                <span className="text-xs font-bold tracking-widest uppercase">CONCIERGE INSIGHT</span>
              </div>
              <p className="text-sm italic leading-relaxed text-gray-800 font-medium">
                "{analysis}"
              </p>
            </div>
          )}

          <div className="mt-16 pt-12 border-t border-gray-100 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">Origin</h4>
              <p className="text-sm font-medium">Artisanal Workshop, Algiers</p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">Delivery</h4>
              <p className="text-sm font-medium">Nationwide COD (3-5 Days)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
