import React from 'react';
import { X, Trash2, ShoppingBag, Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../hooks/useCart';

const WishlistDrawer = ({ isOpen, onClose }) => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity" 
        onClick={onClose} 
      />

      {/* Drawer Container */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <h2 className="text-lg font-bold text-[#3D2817] font-serif">
              My Wishlist ({wishlist.length})
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 :bg-stone-800 text-stone-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {wishlist.length === 0 ? (
            <div className="text-center py-12 text-stone-500">
              <Heart className="w-12 h-12 mx-auto mb-3 opacity-30 text-stone-400" />
              <p className="font-semibold text-stone-700 ">Your wishlist is empty</p>
              <p className="text-xs mt-1">Explore menu and save your favorite items!</p>
            </div>
          ) : (
            wishlist.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center gap-4 p-3 bg-stone-50 rounded-2xl border border-stone-200 "
              >
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-16 h-16 rounded-xl object-cover bg-stone-200"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-[#3D2817] truncate">
                    {item.name}
                  </h4>
                  <p className="text-xs text-[#C68B45] font-bold mt-0.5">
                    ${item.price}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      addToCart(item);
                      removeFromWishlist(item.id);
                    }}
                    className="p-2 text-amber-700 hover:bg-amber-100 :bg-stone-700 rounded-lg cursor-pointer"
                    title="Move to Cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 :bg-red-950/40 rounded-lg cursor-pointer"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistDrawer;