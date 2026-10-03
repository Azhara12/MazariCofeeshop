import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import ProductCard from '../components/cards/ProductCard';
import ProductModal from '../components/cards/ProductModal';
import { useModal } from '../hooks/useModal';
import Button from '../components/ui/Button';

const SORT_OPTIONS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Top Rated' }
];

const MenuSection = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const modal = useModal();

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS;

    // Filter by Category
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.ingredients?.some(i => i.toLowerCase().includes(q))
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        default: return 0;
      }
    });

    return result;
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <section className="pt-6 pb-12 px-6 md:px-12 max-w-7xl mx-auto min-h-screen transition-colors duration-300">
      <div className="text-center mb-10 animate-fadeInUp">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#3D2817] mb-3">
          Our Menu
        </h1>
        <p className="text-stone-600 max-w-2xl mx-auto text-sm sm:text-base">
          Explore our wide selection of artisanal coffees, refreshing cold drinks, and decadent pastries.
        </p>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-10 bg-white p-4 rounded-3xl shadow-sm border border-stone-200 transition-colors duration-300 animate-fadeInUp delay-100">
        
        {/* Categories */}
        <div className="flex overflow-x-auto w-full lg:w-auto scrollbar-hide pb-2 lg:pb-0 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`category-pill flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                activeCategory === cat 
                  ? 'bg-[#3D2817] text-white shadow-md' 
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 :bg-stone-700'
              }`}
            >
              <span className="relative z-10">{cat}</span>
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex w-full lg:w-auto items-center gap-3">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 " />
            <input 
              type="text" 
              placeholder="Search drinks, ingredients..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 rounded-full text-sm focus:outline-none focus:border-[#C68B45] focus:ring-2 focus:ring-[#C68B45]/20 transition-all"
            />
          </div>
          <div className="relative hidden sm:block">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 bg-stone-50 border border-stone-200 text-stone-800 rounded-full text-sm font-medium focus:outline-none focus:border-[#C68B45] cursor-pointer"
            >
              {SORT_OPTIONS.map(opt => <option key={opt.id} value={opt.id} className="bg-white text-stone-800 ">{opt.label}</option>)}
            </select>
            <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div key={product.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 50}ms` }}>
              <ProductCard product={product} onQuickView={modal.open} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 transition-colors duration-300 animate-fadeIn">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-serif font-bold text-[#3D2817] mb-2">No items found</h3>
          <p className="text-stone-600 mb-6">We couldn't find anything matching "{searchQuery}"</p>
          <Button onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}>Clear Filters</Button>
        </div>
      )}

      {/* Portal Modal directly to document.body for 100% viewport centering */}
      {modal.isOpen && createPortal(
        <ProductModal isOpen={modal.isOpen} onClose={modal.close} product={modal.data} />,
        document.body
      )}
    </section>
  );
};

export default MenuSection;