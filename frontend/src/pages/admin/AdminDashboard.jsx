import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';
import { PRODUCTS } from '../../data/products';
import { DollarSign, ShoppingBag, Clock, Coffee, RefreshCw, TrendingUp, Download } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

// ── KDS Status Badge ──────────────────────────────────────────────────────────
const KDS_STEPS = ['Order Received', 'Brewing', 'On the Way', 'Delivered'];

const getKdsIndex = (status) => {
  const idx = KDS_STEPS.indexOf(status);
  return idx === -1 ? 0 : idx;
};

const StatusKDS = ({ status }) => {
  const idx = getKdsIndex(status);
  const pct = Math.round(((idx + 1) / KDS_STEPS.length) * 100);

  const colors = {
    'Order Received': 'bg-amber-100 text-amber-800',
    Brewing:          'bg-purple-100 text-purple-800',
    'On the Way':     'bg-blue-100 text-blue-800',
    Delivered:        'bg-emerald-100 text-emerald-800',
    Cancelled:        'bg-red-100 text-red-800',
  };

  const barColors = {
    'Order Received': 'bg-amber-400',
    Brewing:          'bg-purple-500',
    'On the Way':     'bg-blue-500',
    Delivered:        'bg-emerald-500',
    Cancelled:        'bg-red-400',
  };

  if (status === 'Cancelled') {
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors[status] || 'bg-stone-100 text-stone-600'}`}>
        {status}
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-1 min-w-[100px]">
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold self-start ${colors[status] || 'bg-stone-100 text-stone-600'}`}>
        {status || 'Order Received'}
      </span>
      <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColors[status] || 'bg-stone-400'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

// ── Skeleton Card ─────────────────────────────────────────────────────────────
const SkeletonStatCard = () => (
  <div className="bg-white p-6 rounded-2xl border border-stone-200 flex items-center gap-4 animate-pulse">
    <div className="w-12 h-12 rounded-xl bg-stone-200" />
    <div className="space-y-2 flex-1">
      <div className="h-3 bg-stone-200 rounded w-24" />
      <div className="h-6 bg-stone-200 rounded w-32" />
    </div>
  </div>
);

// ── Export to CSV ─────────────────────────────────────────────────────────────
const exportCSV = (orders) => {
  const headers = ['Order ID', 'Customer', 'Total', 'Payment', 'Delivery', 'Status', 'Date'];
  const rows = orders.map(o => [
    o.orderId || o._id?.slice(-6),
    o.customerDetails?.fullName || 'Guest',
    (o.pricing?.totalAmount || o.totalPrice || 0).toFixed(2),
    o.paymentMethod || 'COD',
    o.deliveryMethod || 'Home Delivery',
    o.orderStatus || 'Order Received',
    o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '',
  ]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mazarics-orders-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// ── Main Component ─────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { token } = useAuth();

  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: PRODUCTS.length,
  });
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);

    try {
      setError(null);

      const [statsRes, ordersRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getOrders(),
      ]);

      const statsData = statsRes.data;
      if (statsData) {
        setStats({
          totalSales:    statsData.totalRevenue    || 0,
          totalOrders:   statsData.totalOrders     || 0,
          pendingOrders: statsData.pendingOrders   || 0,
          totalProducts: (statsData.totalProducts && statsData.totalProducts > 5)
            ? statsData.totalProducts
            : PRODUCTS.length,
        });
      }

      const ordersData = ordersRes.data;
      setOrders(Array.isArray(ordersData) ? ordersData : ordersData?.orders || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('[AdminDashboard] Fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

  // Auto-refresh every 30 s
  useEffect(() => {
    const interval = setInterval(() => fetchDashboardData(), 30_000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const statCards = [
    { label: 'Total Revenue',   value: formatCurrency(stats.totalSales),   icon: DollarSign,  colorBg: 'bg-emerald-100', colorText: 'text-emerald-600' },
    { label: 'Total Orders',    value: stats.totalOrders,                  icon: ShoppingBag, colorBg: 'bg-blue-100',       colorText: 'text-blue-600'       },
    { label: 'Pending Orders',  value: stats.pendingOrders,                icon: Clock,       colorBg: 'bg-amber-100',     colorText: 'text-amber-600'     },
    { label: 'Total Products',  value: stats.totalProducts,                icon: Coffee,      colorBg: 'bg-purple-100',   colorText: 'text-purple-600'   },
  ];

  return (
    <div className="space-y-8 animate-fadeInUp">

      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-black">Dashboard</h1>
          {lastUpdated && (
            <p className="text-xs text-stone-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => exportCSV(orders)}
            disabled={orders.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 text-sm font-semibold rounded-xl border border-stone-200 hover:bg-stone-200 transition-all cursor-pointer disabled:opacity-40"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-semibold rounded-xl hover:opacity-80 transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* ── Error Banner ────────────────────────────────────────────────────── */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl flex items-center justify-between animate-fadeIn">
          <span className="font-medium text-sm">{error}</span>
          <button onClick={() => fetchDashboardData(true)} className="text-sm font-bold underline cursor-pointer">
            Retry
          </button>
        </div>
      )}

      {/* ── Stat Cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)
          : statCards.map(({ label, value, icon: Icon, colorBg, colorText }) => (
              <div
                key={label}
                className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className={`w-12 h-12 ${colorBg} ${colorText} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-stone-500 font-medium">{label}</p>
                  <h3 className="text-2xl font-bold text-black mt-0.5">{value}</h3>
                </div>
              </div>
            ))
        }
      </div>

      {/* ── Recent Orders Table ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-black font-serif">Recent Orders</h3>
          <span className="text-xs text-stone-400">{orders.length} total</span>
        </div>

        {loading ? (
          <div className="p-8 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="h-4 bg-stone-200 rounded w-24" />
                <div className="h-4 bg-stone-200 rounded w-32" />
                <div className="h-4 bg-stone-200 rounded w-20" />
                <div className="h-4 bg-stone-200 rounded w-24" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <Coffee className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-base font-medium">No orders in database yet</p>
            <p className="text-sm mt-1">Customer orders will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-xs text-stone-500 uppercase font-bold tracking-wider">
                  <th className="py-3 px-5">Order ID</th>
                  <th className="py-3 px-5">Customer</th>
                  <th className="py-3 px-5">Total</th>
                  <th className="py-3 px-5">Payment</th>
                  <th className="py-3 px-5">Delivery</th>
                  <th className="py-3 px-5">KDS Status</th>
                  <th className="py-3 px-5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {orders.slice(0, 20).map((ord) => (
                  <tr key={ord._id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-4 px-5 font-mono font-bold text-[#C68B45] text-sm">
                      #{ord.orderId || ord._id?.slice(-6)}
                    </td>
                    <td className="py-4 px-5 font-medium text-black">
                      {ord.customerDetails?.fullName || ord.customerDetails?.name || 'Guest'}
                    </td>
                    <td className="py-4 px-5 font-bold text-black">
                      {formatCurrency(ord.pricing?.totalAmount || ord.pricing?.totalPrice || ord.totalPrice || 0)}
                    </td>
                    <td className="py-4 px-5 text-stone-600">{ord.paymentMethod || 'COD'}</td>
                    <td className="py-4 px-5 text-stone-600">{ord.deliveryMethod || 'Home Delivery'}</td>
                    <td className="py-4 px-5">
                      <StatusKDS status={ord.orderStatus} />
                    </td>
                    <td className="py-4 px-5 text-stone-400 text-xs">
                      {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;