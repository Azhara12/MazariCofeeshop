import React from 'react';
import { MapPin, User, Phone, CreditCard, Banknote, Coffee, Info, Package, X } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const DetailRow = ({ icon: Icon, label, value, mono = false }) => (
  <div className="flex items-start gap-3">
    <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-900 text-stone-400 dark:text-stone-500 flex items-center justify-center flex-shrink-0">
      <Icon className="w-4 h-4" />
    </div>
    <div>
      <p className="text-xs text-stone-400 dark:text-stone-500">{label}</p>
      <p className={`font-semibold text-black dark:text-white text-sm mt-0.5 ${mono ? 'font-mono' : ''}`}>{value || '—'}</p>
    </div>
  </div>
);

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const {
    orderId, customerDetails, orderItems, deliveryMethod,
    deliveryAddress, paymentMethod, pricing, stripePaymentIntentId, createdAt, orderStatus,
  } = order;

  // Keyboard shortcut: Esc to close
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
  };

  const statusColors = {
    'Order Received': 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300',
    Brewing:          'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300',
    'On the Way':     'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300',
    Delivered:        'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300',
    Cancelled:        'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300',
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-white dark:bg-stone-950 rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col max-h-[90vh] animate-scaleIn">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 dark:border-stone-900 flex-shrink-0">
          <div>
            <h2 className="text-xl font-serif font-bold text-black dark:text-white">
              Order #{orderId}
            </h2>
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
              {createdAt ? new Date(createdAt).toLocaleString() : '—'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[orderStatus] || 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-300'}`}>
              <Package className="w-3 h-3 inline mr-1" />
              {orderStatus || 'Order Received'}
            </span>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-black dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">

          {/* Total highlight */}
          <div className="bg-stone-50 dark:bg-stone-900 rounded-2xl p-4 border border-stone-100 dark:border-stone-800 flex items-center justify-between">
            <span className="text-sm font-semibold text-stone-500 dark:text-stone-400">Total Amount</span>
            <span className="text-2xl font-bold text-[#C68B45]">
              {formatCurrency(pricing?.totalAmount || 0)}
            </span>
          </div>

          {/* Customer & Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer */}
            <div>
              <h4 className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-3">Customer Details</h4>
              <div className="space-y-3">
                <DetailRow icon={User}  label="Name"  value={customerDetails?.fullName || customerDetails?.name} />
                <DetailRow icon={Phone} label="Phone" value={customerDetails?.phone} />
                <DetailRow icon={Info}  label="Email" value={customerDetails?.email} />
              </div>
            </div>

            {/* Order Info */}
            <div>
              <h4 className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-3">Order Information</h4>
              <div className="space-y-3">
                <DetailRow
                  icon={MapPin}
                  label={deliveryMethod || 'Delivery'}
                  value={deliveryMethod === 'Home Delivery'
                    ? `${deliveryAddress?.address || ''} ${deliveryAddress?.city ? '— ' + deliveryAddress.city : ''}`
                    : 'Pickup at Store'}
                />
                {deliveryAddress?.instructions && (
                  <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800/50 ml-12">
                    📝 {deliveryAddress.instructions}
                  </p>
                )}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-900 flex items-center justify-center flex-shrink-0">
                    {paymentMethod === 'Card'
                      ? <CreditCard className="w-4 h-4 text-emerald-500" />
                      : <Banknote className="w-4 h-4 text-amber-500" />
                    }
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 dark:text-stone-500">Payment</p>
                    <p className="font-semibold text-black dark:text-white text-sm mt-0.5">{paymentMethod || 'COD'}</p>
                    {stripePaymentIntentId && (
                      <p className="text-[10px] text-stone-400 font-mono mt-0.5" title={stripePaymentIntentId}>
                        ID: {stripePaymentIntentId.slice(0, 16)}…
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h4 className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-3">
              Ordered Items ({orderItems?.length || 0})
            </h4>
            <div className="space-y-3">
              {orderItems?.map((item, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-xl border border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover bg-stone-100 dark:bg-stone-800 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 flex-shrink-0">
                      <Coffee className="w-7 h-7" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h5 className="font-bold text-black dark:text-white text-sm">{item.name}</h5>
                      <p className="font-bold text-[#C68B45] text-sm">{formatCurrency(item.price)}</p>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">Qty: {item.quantity}</p>
                    {(item.size || item.milk || item.extraShots > 0 || item.sweetness) && (
                      <div className="flex flex-wrap gap-1.5">
                        {item.size       && <span className="text-[10px] font-semibold bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-stone-600 dark:text-stone-300">Size: {item.size}</span>}
                        {item.milk       && <span className="text-[10px] font-semibold bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-stone-600 dark:text-stone-300">Milk: {item.milk}</span>}
                        {item.sweetness  && <span className="text-[10px] font-semibold bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-stone-600 dark:text-stone-300">Sugar: {item.sweetness}</span>}
                        {item.extraShots > 0 && <span className="text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded text-amber-700 dark:text-amber-400">+{item.extraShots} shot{item.extraShots > 1 ? 's' : ''}</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
            <div className="w-full md:w-72 ml-auto space-y-2 text-sm">
              <div className="flex justify-between text-stone-500 dark:text-stone-400">
                <span>Subtotal</span>
                <span>{formatCurrency(pricing?.subtotal || 0)}</span>
              </div>
              {pricing?.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Discount</span>
                  <span>−{formatCurrency(pricing.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-500 dark:text-stone-400">
                <span>Shipping</span>
                <span>{formatCurrency(pricing?.shippingFee || 0)}</span>
              </div>
              <div className="flex justify-between text-stone-500 dark:text-stone-400">
                <span>Tax</span>
                <span>{formatCurrency(pricing?.tax || 0)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-black dark:text-white pt-2 border-t border-stone-200 dark:border-stone-800 mt-2">
                <span>Total</span>
                <span className="text-[#C68B45]">{formatCurrency(pricing?.totalAmount || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
