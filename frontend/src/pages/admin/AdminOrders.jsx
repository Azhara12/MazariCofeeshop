import React, { useState, useEffect, useRef, useCallback } from 'react';
import { adminAPI } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import {
  DollarSign, ShoppingBag, Clock, Search, ChevronDown, Loader2,
  Utensils, Printer, Download, Calendar, X,
} from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import OrderDetailsModal from '../../components/admin/OrderDetailsModal';
import { printKOT, printCustomerBill } from '../../utils/printEngine';
import { useAudioAlert } from '../../hooks/useAudioAlert';

const STATUS_OPTIONS = ['Order Received', 'Brewing', 'On the Way', 'Delivered', 'Cancelled'];

// ── Date range presets ────────────────────────────────────────────────────────
const DATE_PRESETS = ['All', 'Today', 'Yesterday', 'This Month'];

const isInDateRange = (order, preset) => {
  if (preset === 'All') return true;
  const created = new Date(order.createdAt);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  if (preset === 'Today')      return created >= today;
  if (preset === 'Yesterday')  return created >= yesterday && created < today;
  if (preset === 'This Month') return created >= monthStart;
  return true;
};

// ── KDS animated status badge + progress bar ─────────────────────────────────
const KDS_STEPS = ['Order Received', 'Brewing', 'On the Way', 'Delivered'];

const getKdsPct = (status) => {
  const idx = KDS_STEPS.indexOf(status);
  return idx === -1 ? 0 : Math.round(((idx + 1) / KDS_STEPS.length) * 100);
};

const statusBadgeClass = (status) => {
  switch (status) {
    case 'Delivered':     return 'bg-emerald-100 text-emerald-800';
    case 'On the Way':   return 'bg-blue-100 text-blue-800';
    case 'Brewing':      return 'bg-purple-100 text-purple-800';
    case 'Cancelled':    return 'bg-red-100 text-red-800';
    default:             return 'bg-amber-100 text-amber-800';
  }
};

const statusBarClass = (status) => {
  switch (status) {
    case 'Delivered':   return 'bg-emerald-500';
    case 'On the Way':  return 'bg-blue-500';
    case 'Brewing':     return 'bg-purple-500';
    case 'Cancelled':   return 'bg-red-400';
    default:            return 'bg-amber-400';
  }
};

const SkeletonRow = () => (
  <tr className="animate-pulse">
    {Array.from({ length: 7 }).map((_, i) => (
      <td key={i} className="p-4">
        <div className="h-4 bg-stone-200 rounded" />
      </td>
    ))}
  </tr>
);

// ── CSV export helper ─────────────────────────────────────────────────────────
const exportOrdersCSV = (orders) => {
  const headers = ['Order ID', 'Customer', 'Phone', 'Total', 'Payment', 'Pay Status', 'Delivery', 'Order Status', 'Date'];
  const rows = orders.map(o => [
    `#${o.orderId || o._id?.slice(-6)}`,
    o.customerDetails?.fullName || 'Guest',
    o.customerDetails?.phone || '',
    (o.pricing?.totalAmount ?? o.totalAmount ?? 0).toFixed(2),
    o.paymentMethod || 'COD',
    o.paymentStatus || 'Pending',
    o.deliveryMethod || 'Takeaway',
    o.orderStatus || 'Order Received',
    o.createdAt ? new Date(o.createdAt).toLocaleString() : '',
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mazarics-orders-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// ── Main Component ────────────────────────────────────────────────────────────
const AdminOrders = ({ hideStats = false }) => {
  const [orders, setOrders]             = useState([]);
  const [stats, setStats]               = useState({ totalRevenue: 0, totalOrders: 0, pendingOrders: 0 });
  const [loading, setLoading]           = useState(true);
  const [searchTerm, setSearchTerm]     = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter]     = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const { toast } = useToast();
  const { playAlert } = useAudioAlert();
  const prevOrderCount = useRef(0);
  const searchRef = useRef(null);

  // ── Keyboard shortcuts ──────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        setOpenDropdownId(null);
        setIsModalOpen(false);
      }
      if (e.key === '/' && document.activeElement !== searchRef.current) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        // Allow browser print shortcut when modal is open
        if (!isModalOpen) e.preventDefault();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isModalOpen]);

  // ── Click-outside to close dropdowns ───────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('[data-dropdown]')) setOpenDropdownId(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [ordersRes, statsRes] = await Promise.all([
        adminAPI.getOrders(),
        adminAPI.getStats(),
      ]);
      const fetched = ordersRes.data?.data || ordersRes.data || [];
      const arr = Array.isArray(fetched) ? fetched : [];
      setOrders(arr);
      setStats(statsRes.data || { totalRevenue: 0, totalOrders: 0, pendingOrders: 0 });

      // Audio alert on new orders
      if (prevOrderCount.current > 0 && arr.length > prevOrderCount.current) {
        playAlert();
        toast.success(`🔔 ${arr.length - prevOrderCount.current} new order(s) received!`);
      }
      prevOrderCount.current = arr.length;
    } catch (error) {
      console.error('Failed to fetch admin data', error);
    } finally {
      setLoading(false);
    }
  }, [playAlert, toast]);

  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

  // Auto-refresh every 20 s
  useEffect(() => {
    const id = setInterval(fetchDashboardData, 20_000);
    return () => clearInterval(id);
  }, [fetchDashboardData]);

  const handleUpdateStatus = async (targetOrder, newStatus) => {
    setOpenDropdownId(null);
    if (targetOrder.orderStatus === newStatus) return;

    const mongoId = targetOrder._id;
    setUpdatingOrderId(mongoId);
    setOrders(prev => prev.map(o => o._id === mongoId ? { ...o, orderStatus: newStatus } : o));

    try {
      await adminAPI.updateOrderStatus(mongoId, newStatus);
      toast.success(`Status updated to "${newStatus}"`);
      adminAPI.getStats().then(res => setStats(res.data || stats)).catch(() => {});
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status.');
      fetchDashboardData();
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const orderIdStr      = String(order.orderId || order._id || '');
    const customerNameStr = order.customerDetails?.fullName || order.customerDetails?.name || '';
    const matchesSearch   = orderIdStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            customerNameStr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus   = statusFilter === 'All' || order.orderStatus === statusFilter;
    const matchesDate     = isInDateRange(order, dateFilter);
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-8 transition-colors duration-300 animate-fadeInUp">

      {/* ── Stat Cards ──────────────────────────────────────────────────────── */}
      {!hideStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue || 0), icon: DollarSign, colorBg: 'bg-emerald-100', colorText: 'text-emerald-600' },
            { label: 'Total Orders',  value: stats.totalOrders || 0,                  icon: ShoppingBag, colorBg: 'bg-blue-100',       colorText: 'text-blue-600'       },
            { label: 'Pending',       value: stats.pendingOrders || 0,                icon: Clock,       colorBg: 'bg-amber-100',     colorText: 'text-amber-600'     },
          ].map(({ label, value, icon: Icon, colorBg, colorText }) => (
            <div key={label} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
              <div className={`w-12 h-12 ${colorBg} ${colorText} rounded-full flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-500">{label}</p>
                <p className="text-2xl font-bold text-black">{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Main Table Panel ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">

        {/* Table Header / Filters */}
        <div className="p-5 border-b border-stone-200 space-y-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">

            {/* Status Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide flex-wrap">
              {['All', ...STATUS_OPTIONS].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    statusFilter === s
                      ? 'bg-black text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Date Range + Search + Export */}
            <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap">
              <div className="flex gap-2">
                {DATE_PRESETS.map(p => (
                  <button
                    key={p}
                    onClick={() => setDateFilter(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      dateFilter === p
                        ? 'bg-[#C68B45] text-white'
                        : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 min-w-48">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search ID or Customer…  (/)"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#C68B45] text-sm placeholder:text-stone-400"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                onClick={() => exportOrdersCSV(filteredOrders)}
                disabled={filteredOrders.length === 0}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 text-stone-600 text-xs font-semibold rounded-xl border border-stone-200 hover:bg-stone-200 transition-all cursor-pointer disabled:opacity-40 whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                CSV
              </button>
            </div>
          </div>

          <p className="text-xs text-stone-400">
            Showing {filteredOrders.length} of {orders.length} orders
            {searchTerm && <> · matching "<span className="text-[#C68B45] font-semibold">{searchTerm}</span>"</>}
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1050px]">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-xs uppercase tracking-wider text-stone-500 font-bold">
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Delivery</th>
                <th className="p-4">KDS Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-stone-400">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const kdsIdx = KDS_STEPS.indexOf(order.orderStatus);
                  const pct = order.orderStatus === 'Cancelled'
                    ? 100
                    : Math.round(((Math.max(kdsIdx, 0) + 1) / KDS_STEPS.length) * 100);

                  return (
                    <tr key={order._id} className="hover:bg-stone-50/60 transition-colors">

                      <td className="p-4">
                        <button
                          onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                          className="font-mono text-sm font-bold text-[#C68B45] hover:underline cursor-pointer"
                        >
                          #{order.orderId || order._id?.slice(-6)}
                        </button>
                      </td>

                      <td className="p-4">
                        <p className="font-semibold text-sm text-black">
                          {order.customerDetails?.fullName || order.customerDetails?.name || 'Guest'}
                        </p>
                        <p className="text-xs text-stone-400">
                          {order.customerDetails?.phone || 'No phone'}
                        </p>
                      </td>

                      <td className="p-4 font-bold text-black text-sm">
                        {formatCurrency(order.pricing?.totalAmount ?? order.totalAmount ?? 0)}
                      </td>

                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md ${
                          order.paymentStatus === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.paymentMethod || 'COD'} · {order.paymentStatus || 'Pending'}
                        </span>
                      </td>

                      <td className="p-4 text-sm font-medium text-stone-600">
                        {order.deliveryMethod || 'Takeaway'}
                      </td>

                      {/* KDS animated status */}
                      <td className="p-4">
                        <div className="flex flex-col gap-1.5 min-w-[120px]">
                          <span className={`inline-block self-start px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusBadgeClass(order.orderStatus)}`}>
                            {order.orderStatus || 'Order Received'}
                          </span>
                          {order.orderStatus !== 'Cancelled' && (
                            <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${statusBarClass(order.orderStatus)}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 relative" data-dropdown>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => printKOT(order)}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                            title="Print Kitchen Order Slip (KOT)"
                          >
                            <Utensils className="w-3.5 h-3.5 text-amber-400" />
                            KOT
                          </button>

                          <button
                            type="button"
                            onClick={() => printCustomerBill(order)}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-[#C68B45] hover:bg-[#a87337] text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                            title="Print Customer Bill (Ctrl+P)"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            Bill
                          </button>

                          {/* Status Dropdown */}
                          <div className="relative" data-dropdown>
                            <button
                              onClick={() => setOpenDropdownId(openDropdownId === order._id ? null : order._id)}
                              disabled={updatingOrderId === order._id}
                              className="flex items-center gap-1 text-xs font-bold text-stone-600 bg-white border border-stone-200 px-2.5 py-1.5 rounded-lg hover:bg-stone-50 transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
                            >
                              {updatingOrderId === order._id
                                ? <><Loader2 className="w-3 h-3 animate-spin" /> Updating…</>
                                : <>Status <ChevronDown className="w-3 h-3" /></>
                              }
                            </button>

                            {openDropdownId === order._id && (
                              <div className="absolute right-0 mt-1.5 w-44 bg-white border border-stone-200 shadow-xl rounded-xl z-30 py-1 overflow-hidden animate-scaleIn">
                                {STATUS_OPTIONS.map(status => (
                                  <button
                                    key={status}
                                    onClick={() => handleUpdateStatus(order, status)}
                                    disabled={updatingOrderId === order._id}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-[#C68B45]/10 hover:text-[#C68B45] transition-colors cursor-pointer ${
                                      order.orderStatus === status
                                        ? 'font-bold text-[#C68B45] bg-[#C68B45]/5'
                                        : 'text-stone-600 font-medium'
                                    }`}
                                  >
                                    {status}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
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

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default AdminOrders;