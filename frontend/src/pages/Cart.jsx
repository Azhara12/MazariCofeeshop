import React, { useState } from 'react';
import { Trash2, ShoppingBag, ArrowRight, Tag, Info, Minus, Plus } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useModal } from '../hooks/useModal';
import Button from '../components/ui/Button';
import CheckoutModal from '../components/cards/CheckoutModal';
import { formatCurrency } from '../utils/helpers';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_replace_me');

const Cart = ({ setActiveTab }) => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    shippingFee, 
    taxAmount, 
    discountAmount, 
    totalPrice,
    promoCode,
    promoLabel,
    promoError,
    applyPromo,
    removePromo,
    clearCart
  } = useCart();

  const checkoutModal = useModal();
  const [promoInput, setPromoInput] = useState('');

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (applyPromo(promoInput)) {
      setPromoInput('');
    }
  };

  return (
    <div className="page-enter py-16 px-6 md:px-12 max-w-7xl mx-auto min-h-screen bg-white text-stone-900 transition-colors duration-300">
      {cart.length === 0 && !checkoutModal.isOpen ? (
        <div className="py-24 px-6 min-h-[70vh] flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mb-6 text-[#C68B45]">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#3D2817] mb-3">Your Cart is Empty</h2>
          <p className="text-stone-500 max-w-md mx-auto mb-8">
            Looks like you haven't added any artisanal coffee or treats to your cart yet.
          </p>
          <Button onClick={() => setActiveTab('menu')} size="lg" className="group">
            Explore Menu
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#3D2817]">Your Cart</h1>
            {cart.length > 0 && (
              <button 
                onClick={clearCart}
                className="text-sm font-semibold text-red-500 hover:text-red-600 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Clear Cart
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.cartKey} className="bg-white p-4 md:p-5 rounded-[2rem] flex flex-col sm:flex-row items-center gap-5 shadow-sm border border-stone-100 animate-fadeInUp">
                  <img src={item.image} alt={item.name} className="w-24 h-24 rounded-2xl object-cover bg-stone-100 flex-shrink-0" />
                  
                  <div className="flex-1 w-full text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-1">
                      <h3 className="font-bold text-lg text-[#3D2817] font-serif">{item.name}</h3>
                      <p className="font-bold text-[#C68B45] text-lg">{formatCurrency(item.price)}</p>
                    </div>
                    
                    {/* Customizations summary */}
                    <div className="text-xs text-stone-500 mb-4 flex flex-wrap justify-center sm:justify-start gap-x-2 gap-y-1">
                      {item.customization?.size && <span>Size: {item.customization.size}</span>}
                      {item.customization?.milk && <span>• Milk: {item.customization.milk}</span>}
                      {item.customization?.sweetness && <span>• Sweetness: {item.customization.sweetness}</span>}
                      {item.customization?.extraShots > 0 && <span>• Extra Shots: {item.customization.extraShots}</span>}
                      {item.customization?.syrups?.length > 0 && <span>• Syrups: {item.customization.syrups.join(', ')}</span>}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-stone-50 rounded-full px-1 py-1 border border-stone-200">
                        <button onClick={() => updateQuantity(item.cartKey, -1)} className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm hover:text-[#C68B45] transition-colors"><Minus className="w-3 h-3" /></button>
                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cartKey, 1)} className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm hover:text-[#C68B45] transition-colors"><Plus className="w-3 h-3" /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.cartKey)} className="text-stone-400 hover:text-red-500 transition-colors p-2" aria-label="Remove item">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-[2rem] shadow-md border border-amber-900/10 sticky top-24">
                <h3 className="text-xl font-bold font-serif text-[#3D2817] mb-6">Order Summary</h3>
                
                {/* Promo Code Engine */}
                <div className="mb-6">
                  {promoCode ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-emerald-700 flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> {promoCode}</p>
                        <p className="text-xs text-emerald-600">{promoLabel}</p>
                      </div>
                      <button onClick={removePromo} className="text-stone-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo}>
                      <label className="block text-xs font-semibold text-stone-500 mb-1.5">Promo Code</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={promoInput} 
                          onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                          placeholder="e.g. COFFEE10" 
                          className={`flex-1 input-field py-2 ${promoError ? 'border-red-300' : ''}`} 
                        />
                        <Button type="submit" size="sm" variant="secondary">Apply</Button>
                      </div>
                      {promoError && <p className="text-xs text-red-500 mt-1.5">{promoError}</p>}
                    </form>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 text-sm text-stone-600 border-t border-stone-100 pt-5">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#3D2817]">{formatCurrency(subtotal)}</span>
                  </div>
                  
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Discount ({promoCode})</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">Shipping {shippingFee > 0 && <Info className="w-3.5 h-3.5 text-stone-400" title="Free over $25" />}</span>
                    <span className="font-semibold text-[#3D2817]">{shippingFee === 0 ? 'Free' : formatCurrency(shippingFee)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Estimated Tax (8%)</span>
                    <span className="font-semibold text-[#3D2817]">{formatCurrency(taxAmount)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="mt-5 pt-5 border-t border-stone-200 flex items-center justify-between">
                  <span className="text-lg font-bold text-[#3D2817]">Total</span>
                  <span className="text-2xl font-bold text-[#C68B45]">{formatCurrency(totalPrice)}</span>
                </div>

                <Button onClick={checkoutModal.open} className="w-full mt-8 group" size="lg">
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Checkout modal remains rendered at parent level */}
      <Elements stripe={stripePromise}>
        <CheckoutModal 
          isOpen={checkoutModal.isOpen} 
          onClose={checkoutModal.close} 
          setActiveTab={setActiveTab} 
        />
      </Elements>
    </div>
  );
};

export default Cart;