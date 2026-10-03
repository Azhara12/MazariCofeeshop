import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, Tag, CheckCircle2, XCircle, X, Package, Filter } from 'lucide-react';
import { PRODUCTS as INITIAL_PRODUCTS } from '../../data/products';
import { formatCurrency } from '../../utils/helpers';
import { useToast } from '../../hooks/useToast';

const CATEGORY_OPTIONS = ['All', 'Coffee', 'Cold Drinks', 'Teas', 'Pastries', 'Desserts'];

// ── Product Customization Modal ───────────────────────────────────────────────
const MILK_OPTIONS     = ['Whole Milk', 'Oat Milk', 'Almond Milk', 'Skim Milk', 'Soy Milk'];
const SUGAR_OPTIONS    = ['No Sugar', 'Low', 'Normal', 'Extra Sweet'];

const AdminProducts = () => {
  const [products, setProducts]             = useState(INITIAL_PRODUCTS);
  const [searchTerm, setSearchTerm]         = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen]       = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData]             = useState({
    name: '', category: 'Coffee', price: '', description: '', image: '', inStock: true,
  });

  const filteredProducts = useMemo(() =>
    products.filter(p => {
      const matchesSearch   = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              p.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }),
    [products, searchTerm, selectedCategory]
  );

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name:        product.name,
        category:    product.category,
        price:       product.price,
        description: product.description || '',
        image:       product.image || '',
        inStock:     product.inStock !== false,
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', category: 'Coffee', price: '', description: '', image: '', inStock: true });
    }
    setIsModalOpen(true);
  };

  const handleToggleStock = (id) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const newStatus = !(p.inStock !== false);
      toast.success(`${p.name} marked as ${newStatus ? 'In Stock' : 'Out of Stock'}`);
      return { ...p, inStock: newStatus };
    }));
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete "${name}" permanently?`)) {
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success(`${name} removed from inventory`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error('Product name and price are required.');
      return;
    }

    if (editingProduct) {
      setProducts(prev => prev.map(p =>
        p.id === editingProduct.id ? { ...p, ...formData, price: parseFloat(formData.price) } : p
      ));
      toast.success(`${formData.name} updated!`);
    } else {
      setProducts(prev => [{
        id:          `prod-${Date.now()}`,
        ...formData,
        price:       parseFloat(formData.price),
        rating:      5.0,
        reviewCount: 0,
        popular:     false,
        badge:       'New',
        ingredients: ['Espresso', 'Steamed Milk'],
      }, ...prev]);
      toast.success(`${formData.name} added to menu!`);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeInUp">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-black">Products Inventory</h1>
          <p className="text-sm text-stone-500 mt-1">
            {products.length} items · Manage menu, prices, and availability
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#C68B45] hover:bg-[#a87337] text-white font-bold text-sm rounded-2xl shadow-md transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-hide">
          {CATEGORY_OPTIONS.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search products…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-black placeholder:text-stone-400 focus:outline-none focus:border-[#C68B45] focus:ring-1 focus:ring-[#C68B45]/30"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[11px] uppercase tracking-wider text-stone-500 font-bold">
                <th className="p-4">Item</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-stone-400">
                    <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>No products found.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => {
                  const isInStock = product.inStock !== false;
                  return (
                    <tr key={product.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=200'}
                            alt={product.name}
                            className="w-10 h-10 rounded-xl object-cover border border-stone-200"
                          />
                          <div>
                            <p className="font-bold text-black text-sm">{product.name}</p>
                            {product.badge && (
                              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                {product.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 bg-stone-100 px-3 py-1 rounded-lg">
                          <Tag className="w-3 h-3 text-[#C68B45]" />
                          {product.category}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-black">{formatCurrency(product.price)}</td>
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStock(product.id)}
                          className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full cursor-pointer transition-all ${
                            isInStock
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                          title="Click to toggle"
                        >
                          {isInStock
                            ? <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> In Stock</>
                            : <><XCircle className="w-3.5 h-3.5 text-red-600" /> Out of Stock</>
                          }
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenModal(product)}
                            className="p-2 text-stone-500 hover:text-[#C68B45] hover:bg-stone-100 rounded-xl transition-all cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(product.id, product.name)}
                            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onKeyDown={e => e.key === 'Escape' && setIsModalOpen(false)}
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative animate-scaleIn">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-black rounded-full hover:bg-stone-100 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-serif font-bold text-black mb-5">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1.5">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Hazelnut Latte"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-black text-sm focus:outline-none focus:border-[#C68B45] focus:ring-1 focus:ring-[#C68B45]/30 placeholder:text-stone-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1.5">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-black text-sm focus:outline-none focus:border-[#C68B45]"
                  >
                    {CATEGORY_OPTIONS.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1.5">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    placeholder="4.50"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-black text-sm focus:outline-none focus:border-[#C68B45]"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1.5">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/…"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-black text-sm focus:outline-none focus:border-[#C68B45] placeholder:text-stone-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1.5">Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ingredients and brief notes…"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-black text-sm focus:outline-none focus:border-[#C68B45] resize-none placeholder:text-stone-400"
                />
              </div>

              {/* In Stock Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="inStockCheck"
                  checked={formData.inStock}
                  onChange={e => setFormData({ ...formData, inStock: e.target.checked })}
                  className="w-4 h-4 rounded border-stone-300 text-[#C68B45] focus:ring-[#C68B45] focus:ring-offset-0"
                />
                <label htmlFor="inStockCheck" className="text-xs font-bold text-black cursor-pointer">
                  Available In Stock
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#C68B45] hover:bg-[#a87337] text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;