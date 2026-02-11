
import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../AppContext';
import { ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const { state } = useApp();

  return (
    <div className="-mt-20">
      {/* Hero Section */}
      <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${state.theme.heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <span className="text-gold-500 font-bold tracking-[0.3em] text-sm mb-6 block uppercase animate-fade-in">
            ESTABLISHED IN ALGIERS
          </span>
          <h1 className="text-5xl md:text-8xl text-white mb-12 serif leading-tight">
            {state.theme.bannerText}
          </h1>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Link 
              to="/products" 
              className="px-10 py-4 bg-white text-black font-bold tracking-widest text-sm hover:bg-gray-100 transition-all transform hover:-translate-y-1"
            >
              DISCOVER COLLECTIONS
            </Link>
            <Link 
              to="/gallery" 
              className="px-10 py-4 border border-white/30 text-white backdrop-blur-sm font-bold tracking-widest text-sm hover:bg-white/10 transition-all transform hover:-translate-y-1"
            >
              VIEW GALLERY
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-widest animate-bounce">
          SCROLL TO EXPLORE
        </div>
      </div>

      {/* Featured Collection */}
      <section className="py-32 px-4 bg-[#fdfdfb]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-gold-600 font-bold tracking-widest text-xs uppercase mb-4 block">EXCLUSIVES</span>
              <h2 className="text-4xl md:text-5xl serif">The Artisan's Touch</h2>
            </div>
            <Link to="/products" className="hidden md:flex items-center gap-2 font-bold tracking-widest text-xs hover:text-gold-600 transition-colors">
              VIEW ALL <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {state.products.slice(0, 3).map((product) => (
              <Link 
                key={product.id} 
                to={`/product/${product.id}`}
                className="group block"
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-gray-100">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-xl serif mb-2">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                <p className="font-bold tracking-widest">{product.price.toLocaleString()} DZD</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Ethos */}
      <section className="py-32 bg-black text-white px-4 overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-gold-500 font-bold tracking-widest text-xs uppercase mb-6 block">OUR HERITAGE</span>
            <h2 className="text-5xl md:text-6xl serif mb-10 leading-tight">Authenticity in every stitch.</h2>
            <p className="text-xl text-gray-400 mb-12 leading-relaxed">
              K-SHOP isn't just a store; it's a bridge between generations. We source from the finest craftsmen across Algeria to bring you products that tell a story.
            </p>
            <div className="grid grid-cols-2 gap-12">
              <div>
                <h4 className="text-3xl font-bold text-gold-500 mb-2">58</h4>
                <p className="text-sm text-gray-500 uppercase tracking-widest">Wilayas Served</p>
              </div>
              <div>
                <h4 className="text-3xl font-bold text-gold-500 mb-2">100%</h4>
                <p className="text-sm text-gray-500 uppercase tracking-widest">Authentic Artistry</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] bg-gray-800 rounded-sm overflow-hidden x-art-glow">
              <img 
                src="https://picsum.photos/seed/craft/800/1000" 
                alt="Craftsmanship" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
