
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Link } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';

const ProductList = () => {
  const { state } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = state.products.filter(p => 
    (selectedCategory === 'All' || p.category === selectedCategory) &&
    (p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="mb-20 text-center">
        <span className="text-gold-600 font-bold tracking-[0.3em] text-[10px] uppercase block mb-4">THE CURATION</span>
        <h1 className="text-5xl serif mb-6">Explore the Collections</h1>
        <p className="text-gray-500 max-w-xl mx-auto italic">Bridging timeless craftsmanship with modern sensibilities through our meticulously curated Algerian catalog.</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16 pb-8 border-b border-gray-100">
        <div className="flex gap-6 overflow-x-auto w-full md:w-auto pb-4 md:pb-0 no-scrollbar">
          <button 
            onClick={() => setSelectedCategory('All')}
            className={`text-xs font-bold tracking-widest uppercase pb-2 transition-all border-b-2 whitespace-nowrap ${selectedCategory === 'All' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
          >
            All Pieces
          </button>
          {state.categories.map(c => (
            <button 
              key={c.id}
              onClick={() => setSelectedCategory(c.name)}
              className={`text-xs font-bold tracking-widest uppercase pb-2 transition-all border-b-2 whitespace-nowrap ${selectedCategory === c.name ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search our heritage..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 text-xs outline-none focus:bg-white border-b border-transparent focus:border-black transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
        {filtered.map(product => (
          <Link key={product.id} to={`/product/${product.id}`} className="group block">
            <div className="relative aspect-[3/4] bg-gray-50 mb-6 overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
              <button className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-white text-black text-[10px] font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                QUICK VIEW
              </button>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">{product.category}</p>
              <h3 className="text-lg serif mb-2">{product.name}</h3>
              <p className="font-bold tracking-widest text-sm">{product.price.toLocaleString()} DZD</p>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-gray-400 italic">No pieces matching your search were found in our vault.</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
