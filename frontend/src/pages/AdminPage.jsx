import React, { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('orders');

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };

  return (
    <div className="flex min-h-screen bg-stone-100 text-stone-900 transition-colors duration-300">
      {/* Sidebar Container */}
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
      />

      {/* Main Right Side Content */}
      <main className="flex-1 p-8 bg-stone-100 text-stone-900 transition-colors duration-300 min-h-screen">
        {activeTab === 'dashboard' && <AdminDashboard />}
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'users' && <AdminUsers />}
      </main>
    </div>
  );
};

export default AdminPage;