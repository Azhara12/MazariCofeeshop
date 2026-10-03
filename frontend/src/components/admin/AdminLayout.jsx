import React, { useEffect } from 'react';
import { LayoutDashboard, ShoppingCart, Package, Users, LogOut, Coffee, Settings, ArrowLeft, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children, activeAdminTab, setActiveAdminTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // ── Keyboard Shortcuts ────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      // Ctrl+P → Print (handled inside Orders page natively)
      // Esc → Close any open modal (handled at component level)
      if ((e.ctrlKey || e.metaKey) && e.key === '1') {
        e.preventDefault();
        setActiveAdminTab('dashboard');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '2') {
        e.preventDefault();
        setActiveAdminTab('orders');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '3') {
        e.preventDefault();
        setActiveAdminTab('products');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setActiveAdminTab]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard, shortcut: '⌃1' },
    { id: 'orders',    label: 'Orders',     icon: ShoppingCart,    shortcut: '⌃2' },
    { id: 'products',  label: 'Products',   icon: Package,         shortcut: '⌃3' },
    { id: 'users',     label: 'Users',      icon: Users,           shortcut: '' },
    { id: 'settings',  label: 'Settings',   icon: Settings,        shortcut: '' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex">

      {/* ── Sidebar ───────────────────────────────────────────────────────────── */}
      <aside className="w-64 bg-white border-r border-stone-200 flex flex-col fixed h-full z-10">
        
        {/* Brand */}
        <div
          className="p-6 flex items-center gap-3 cursor-pointer group"
          onClick={() => setActiveAdminTab('dashboard')}
        >
          <div className="bg-[#C68B45] text-white p-2 rounded-xl group-hover:scale-105 transition-transform">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-serif text-black">MazariCS</h1>
            <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeAdminTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveAdminTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#C68B45] text-white shadow-md'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-black'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </span>
                {item.shortcut && (
                  <span className="text-[10px] font-mono opacity-40">{item.shortcut}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-stone-200 space-y-2">

          <button
            onClick={() => setActiveTab ? setActiveTab('home') : (window.location.href = '/')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-600 hover:bg-stone-100 hover:text-black transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Store
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────────────────────────────── */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">

        {/* Top Header */}
        <header className="bg-white border-b border-stone-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-serif font-bold text-black capitalize">
              {activeAdminTab}
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button
              className="relative p-2 text-stone-500 hover:text-black hover:bg-stone-100 rounded-xl transition-all cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C68B45] rounded-full animate-pulse" />
            </button>

            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-black">{user?.name || 'Admin User'}</p>
                <p className="text-xs font-medium text-stone-500">{user?.email || 'admin@mazarics.com'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#C68B45]/15 text-[#C68B45] flex items-center justify-center font-bold text-lg border-2 border-[#C68B45]/30">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-8 bg-stone-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
