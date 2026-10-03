import React from 'react';
import { LayoutDashboard, ShoppingBag, Coffee, Users, Settings, LogOut, ArrowLeft, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const AdminSidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const { darkMode, toggleTheme } = useTheme();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'products', label: 'Products', icon: Coffee },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white text-black dark:bg-black dark:text-white border-r border-stone-200 dark:border-stone-800 min-h-screen flex flex-col justify-between p-5 transition-colors duration-300">
      
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-serif text-xl font-bold shadow-md">
            M
          </div>
          <div>
            <h2 className="font-serif font-bold text-lg text-black dark:text-white leading-tight">
              MazariCS
            </h2>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400">
              Admin Panel
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-md scale-[1.02]'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions Container */}
      <div className="space-y-3 pt-4 border-t border-stone-200 dark:border-stone-800">
        
        {/* Black & White Theme Toggle Card */}
        <div className="bg-stone-100 dark:bg-stone-900 p-3 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white text-black dark:bg-black dark:text-amber-400">
              {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </div>
            <div>
              <p className="text-xs font-bold text-black dark:text-white">Theme Mode</p>
              <p className="text-[10px] text-stone-500 dark:text-stone-400">{darkMode ? 'Dark (Black)' : 'Light (White)'}</p>
            </div>
          </div>

          {/* Switch Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 cursor-pointer ${
              darkMode ? 'bg-stone-700' : 'bg-stone-300'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white dark:bg-amber-400 shadow-md transform transition-transform duration-300 ${
                darkMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Return to Store */}
        <button
          onClick={() => window.location.href = '/'}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Store
        </button>

        {/* Sign Out */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

    </aside>
  );
};

export default AdminSidebar;