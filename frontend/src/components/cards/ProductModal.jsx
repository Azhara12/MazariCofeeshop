import React, { useState, useEffect } from "react";
import { X, Heart, Plus, Minus, ShoppingBag } from "lucide-react";
import Rating from "../ui/Rating";
import Badge from "../ui/Badge";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { useToast } from "../../hooks/useToast";
import { formatCurrency } from "../../utils/helpers";

const ProductModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { toast } = useToast();

  const [selectedSize, setSelectedSize] = useState(
    product.sizes ? product.sizes[0] : null
  );
  const [selectedMilk, setSelectedMilk] = useState(
    product.milkOptions ? product.milkOptions[0] : null
  );
  const [sweetness, setSweetness] = useState("100%");
  const [extraShots, setExtraShots] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const wishlisted = isWishlisted(product.id);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const calculateTotal = () => {
    let price = product.price;
    if (selectedSize?.priceOffset) price += selectedSize.priceOffset;
    price += extraShots * 0.75;
    return price * quantity;
  };

  const handleAddToCart = () => {
    const customizedItem = {
      ...product,
      selectedSize,
      selectedMilk,
      sweetness,
      extraShots,
      unitPrice: calculateTotal() / quantity,
      price: calculateTotal(),
    };

    addToCart(customizedItem, quantity);
    toast.cart(`${product.name} added to cart!`);
    onClose();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div 
        className="bg-stone-900 text-stone-100 rounded-[2rem] shadow-2xl w-full max-w-md flex flex-col overflow-hidden border border-stone-800 transition-all text-left relative"
        style={{
          maxHeight: '78vh',
          margin: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative h-36 sm:h-40 shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
          
          {/* Top Actions */}
          <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
            <button
              type="button"
              onClick={() => {
                toggleWishlist(product);
                toast.success(
                  wishlisted
                    ? `${product.name} removed from wishlist`
                    : `${product.name} saved to wishlist ❤️`
                );
              }}
              className="w-8 h-8 rounded-full bg-stone-800/90 backdrop-blur-md flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition-transform"
            >
              <Heart
                className={`w-4 h-4 ${
                  wishlisted ? "fill-red-500 text-red-500" : "text-stone-300"
                }`}
              />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-800/90 backdrop-blur-md flex items-center justify-center shadow-md text-stone-200 cursor-pointer hover:scale-105 transition-transform"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute bottom-3 left-5 right-5">
            {product.badge && <Badge label={product.badge} className="mb-1" />}
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white drop-shadow-md">
              {product.name}
            </h2>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-stone-100">
          {/* Rating & Category */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <Rating value={product.rating} count={product.reviewsCount || 278} />
            <span className="text-[10px] font-bold tracking-wider uppercase text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-800">
              {product.category}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-stone-300 leading-relaxed font-normal">
            {product.description}
          </p>

          {/* Ingredients */}
          {product.ingredients && (
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-stone-300 uppercase mb-1.5">
                Ingredients
              </label>
              <div className="flex flex-wrap gap-1.5">
                {product.ingredients.map((ing, idx) => (
                  <span
                    key={`modal-ing-${product.id}-${idx}`}
                    className="text-[11px] px-2.5 py-0.5 bg-stone-800 text-amber-200 font-semibold rounded-full border border-stone-700"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && (
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-stone-300 uppercase mb-1.5">
                Select Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {product.sizes.map((s, idx) => {
                  const isSelected = selectedSize?.name === s.name;
                  return (
                    <button
                      key={`modal-size-${product.id}-${s.name || idx}`}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`py-2 px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#C68B45] bg-[#C68B45] text-white shadow-md"
                          : "border-stone-700 bg-stone-800 text-stone-200 hover:bg-stone-700"
                      }`}
                    >
                      {s.name} {s.priceOffset ? `+$${s.priceOffset.toFixed(2)}` : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Milk Options */}
          {product.milkOptions && (
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-stone-300 uppercase mb-1.5">
                Milk Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {product.milkOptions.map((m, idx) => {
                  const isSelected = selectedMilk === m;
                  return (
                    <button
                      key={`modal-milk-${product.id}-${m || idx}`}
                      type="button"
                      onClick={() => setSelectedMilk(m)}
                      className={`py-2 px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#C68B45] bg-[#C68B45] text-white shadow-md"
                          : "border-stone-700 bg-stone-800 text-stone-200 hover:bg-stone-700"
                      }`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sweetness */}
          <div>
            <label className="block text-[11px] font-bold tracking-wider text-stone-300 uppercase mb-1.5">
              Sweetness Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["0%", "50%", "100%"].map((sw, idx) => {
                const isSelected = sweetness === sw;
                return (
                  <button
                    key={`modal-sweet-${product.id}-${sw || idx}`}
                    type="button"
                    onClick={() => setSweetness(sw)}
                    className={`py-2 px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#C68B45] bg-[#C68B45] text-white shadow-md"
                        : "border-stone-700 bg-stone-800 text-stone-200 hover:bg-stone-700"
                    }`}
                  >
                    {sw}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Extra Shots */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-stone-300 uppercase">
                Extra Espresso Shots
              </label>
              <span className="text-[10px] text-stone-400">+ $0.75 each</span>
            </div>
            <div className="flex items-center gap-2.5 bg-stone-800 border border-stone-700 rounded-full px-2.5 py-1">
              <button
                type="button"
                onClick={() => setExtraShots((v) => Math.max(0, v - 1))}
                className="w-5 h-5 flex items-center justify-center text-stone-200 font-bold cursor-pointer hover:text-white"
              >
                -
              </button>
              <span className="text-xs font-bold text-stone-100">{extraShots}</span>
              <button
                type="button"
                onClick={() => setExtraShots((v) => v + 1)}
                className="w-5 h-5 flex items-center justify-center text-stone-200 font-bold cursor-pointer hover:text-white"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2.5 bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 shadow-sm">
            <button
              type="button"
              onClick={() => setQuantity((v) => Math.max(1, v - 1))}
              className="p-0.5 hover:text-[#C68B45] text-stone-200 font-bold cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-bold text-xs text-stone-100 w-4 text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((v) => v + 1)}
              className="p-0.5 hover:text-[#C68B45] text-stone-200 font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 py-2.5 px-4 bg-[#C68B45] hover:bg-[#a87337] text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add to Cart - {formatCurrency(calculateTotal())}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;  