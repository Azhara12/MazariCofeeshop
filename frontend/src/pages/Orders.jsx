import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { Package, Coffee, RefreshCw, Lock } from 'lucide-react';

const STATUS_STYLES = {
  'Order Received': { bg: 'bg-blue-100 text-blue-800 ',   bar: 'bg-blue-400',    pct: 20  },
  Brewing:          { bg: 'bg-purple-100 text-purple-800 ', bar: 'bg-purple-500', pct: 50  },
  'On the Way':     { bg: 'bg-amber-100 text-amber-800 ',  bar: 'bg-amber-400',   pct: 75  },
  Delivered:        { bg: 'bg-emerald-100 text-emerald-800 ', bar: 'bg-emerald-500', pct: 100 },
  Cancelled:        { bg: 'bg-red-100 text-red-800 ',        bar: 'bg-red-400',     pct: 100 },
};

// Skeleton for single order card
const SkeletonOrderCard = () => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <div className="h-5 bg-stone-200 rounded w-32" />
        <div className="h-3 bg-stone-200 rounded w-24" />
      </div>
      <div className="h-7 bg-stone-200 rounded w-20" />
    </div>
    <div className="mt-4 pt-4 border-t border-stone-100 flex gap-3">
      <div className="h-5 bg-stone-200 rounded-full w-28" />
      <div className="h-5 bg-stone-200 rounded w-24" />
    </div>
  </div>
);

const Orders = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated || !user) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await orderAPI.getMyOrders();
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-xl mx-auto py-24 px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-stone-400" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-black mb-3">
          Please Log In
        </h2>
        <p className="text-stone-500 text-sm">
          You need to be signed in to view your order history.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 min-h-screen bg-white text-stone-900 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#C68B45]/10 text-[#C68B45] flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-3xl font-serif font-bold text-black ">
              My Orders
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              {!loading && `${orders.length} order${orders.length !== 1 ? 's' : ''} in history`}
            </p>
          </div>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 text-sm font-semibold text-[#C68B45] border border-[#C68B45]/40 px-4 py-2 rounded-xl hover:bg-[#C68B45] hover:text-white transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-center justify-between animate-fadeIn">
          <span className="text-sm">{error}</span>
          <button onClick={fetchOrders} className="text-sm font-bold underline ml-4 cursor-pointer">Retry</button>
        </div>
      )}

      {/* Skeleton loading */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonOrderCard key={i} />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-14 rounded-[2rem] border border-stone-200 text-center shadow-sm">
          <Coffee className="w-14 h-14 mx-auto mb-4 text-stone-300 " />
          <p className="text-stone-600 font-semibold text-lg mb-1">No orders yet!</p>
          <p className="text-stone-400 text-sm">Your placed orders will appear here after checkout.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const total = order.pricing?.totalAmount || order.pricing?.totalPrice || order.totalPrice || 0;
            const status = order.orderStatus || 'Order Received';
            const style  = STATUS_STYLES[status] || STATUS_STYLES['Order Received'];

            return (
              <div
                key={order._id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-bold text-black text-lg">
                      Order #{order.orderId || order._id?.slice(-6)}
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString('en-US', {
                            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                          })
                        : '—'}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-bold text-black ">
                      ${Number(total).toFixed(2)}
                    </p>
                    <span className="text-xs px-2.5 py-0.5 bg-stone-100 rounded-full text-stone-500 font-medium">
                      {order.paymentMethod || 'COD'}
                    </span>
                  </div>
                </div>

                {/* KDS Progress bar */}
                {status !== 'Cancelled' && (
                  <div className="mt-4">
                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${style.bar}`}
                        style={{ width: `${style.pct}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100 ">
                  <span className={`text-xs px-3 py-1.5 rounded-full font-bold ${style.bg}`}>
                    {status}
                  </span>
                  <span className="text-xs text-stone-400 font-medium">
                    {order.deliveryMethod || 'Home Delivery'} ·{' '}
                    {order.orderItems?.length || 0} item{(order.orderItems?.length || 0) !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Order Items Pills */}
                {order.orderItems && order.orderItems.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {order.orderItems.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-stone-50 border border-stone-200 text-stone-600 px-2.5 py-1 rounded-lg"
                      >
                        {item.quantity}× {item.name}
                        {item.size ? ` (${item.size})` : ''}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;