import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Tag, Check, X } from 'lucide-react';
import Button from '../../components/ui/Button';

const INITIAL_PRODUCTS = [
  { id: '1', name: 'Espresso Single', category: 'Hot Coffee', price: 3.50, stock: true, image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=200' },
  { id: '2', name: 'Caramel Macchiato', category: 'Cold Coffee', price: 5.25, stock: true, image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&q=80&w=200' },
  { id: '3', name: 'Butter Croissant', category: 'Bakery', price: 4.00, stock: false, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=200' }
];

const AdminProducts = () => {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: 'Hot Coffee', price: '', image: '', stock: true });

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    const newProd = {
      id: Date.now().toString(),
      ...formData,
      price: parseFloat(formData.price)
    };
    setProducts([newProd, ...products]);
    setIsModalOpen(false);
    setFormData({ name: '', category: 'Hot Coffee', price: '', image: '', stock: true });
  };

  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#3D2817]">Products Inventory</h2>
          <p className="text-xs text-stone-500">Manage menu items, prices, and availability</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New Product
        </Button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-stone-400" />
        <input 
          type="text" 
          placeholder="Search products by name or category..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-sm outline-none bg-transparent"
        />
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-100">
              <tr>
                <th className="p-4">ITEM</th>
                <th className="p-4">CATEGORY</th>
                <th className="p-4">PRICE</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-stone-50/50">
                  <td className="p-4 flex items-center gap-3">
                    <img src={item.image || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded-xl object-cover" />
                    <span className="font-bold text-[#3D2817]">{item.name}</span>
                  </td>
                  <td className="p-4 text-stone-600"><Tag className="w-3.5 h-3.5 inline mr-1 text-[#C68B45]" />{item.category}</td>
                  <td className="p-4 font-bold text-[#3D2817]">${item.price.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${item.stock ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                      {item.stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-50 text-stone-400 hover:text-red-500 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold font-serif text-[#3D2817]">Add New Coffee Product</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-stone-400" /></button>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-500">Product Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full input-field py-2 mt-1 border rounded-xl p-2" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-500">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border rounded-xl p-2 mt-1 bg-white text-sm">
                    <option>Hot Coffee</option>
                    <option>Cold Coffee</option>
                    <option>Bakery</option>
                    <option>Dessert</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-500">Price ($)</label>
                  <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border rounded-xl p-2 mt-1 text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-500">Image URL</label>
                <input type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://..." className="w-full border rounded-xl p-2 mt-1 text-sm" />
              </div>
              <Button type="submit" className="w-full mt-2">Save Product</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;