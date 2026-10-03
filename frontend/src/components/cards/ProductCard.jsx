import React, { useState } from 'react';
import { Plus, Heart, Eye } from 'lucide-react';
import Rating from '../ui/Rating';
import Badge from '../ui/Badge';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useToast } from '../../hooks/useToast';
import { formatCurrency } from '../../utils/helpers';

const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { toast } = useToast();
  const [imgError, setImgError] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (product.sizes) {
      onQuickView?.(product);
    } else {
      addToCart(product);
      toast.cart(`${product.name} added to cart!`);
    }
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    setHeartAnim(true);
    
    // FIX: Passing full product object instead of product.id
    toggleWishlist(product);
    
    toast.success(
      wishlisted ? `${product.name} removed from wishlist` : `${product.name} saved to wishlist ❤️`
    );
    setTimeout(() => setHeartAnim(false), 700);
  };

  return (
    <div
      className="product-card bg-white rounded-3xl overflow-hidden border border-stone-200 flex flex-col cursor-pointer group transition-colors duration-300"
      onClick={() => onQuickView?.(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onQuickView?.(product)}
      aria-label={`View ${product.name} details`}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-stone-100 ">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            className="product-card-img w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-amber-50 ">☕</div>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
          <button
            onClick={(e) => { e.stopPropagation(); onQuickView?.(product); }}
            className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-[#3D2817] px-4 py-2 rounded-full text-xs font-semibold shadow-md hover:bg-white :bg-stone-700 transition-all animate-fadeInUp cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
        </div>

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3">
            <Badge label={product.badge} />
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`heart-btn absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center cursor-pointer transition-transform ${heartAnim ? 'active' : ''}`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${wishlisted ? 'fill-red-500 stroke-red-500' : 'stroke-stone-400 '}`}
          />
        </button>

        {/* Rating Pill */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
          <Rating value={product.rating} />
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-base font-bold text-[#3D2817] leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
              {product.name}
            </h3>
            {product.isNew && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase bg-emerald-100 text-emerald-700 flex-shrink-0">
                NEW
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">{product.description}</p>
        </div>

        {/* Footer */}
        <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-base font-bold text-[#C68B45]">{formatCurrency(product.price)}</span>
            {product.sizes && (
              <span className="text-[10px] text-stone-400 ml-1">/ S</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="w-9 h-9 rounded-full bg-[#3D2817] hover:bg-[#C68B45] :bg-[#a87337] text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm group/btn cursor-pointer"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus className="w-4 h-4 group-hover/btn:rotate-90 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;