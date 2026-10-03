import React from 'react';
import Header from '../components/common/Header';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Toast from '../components/ui/Toast';

const MainLayout = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="min-h-screen flex flex-col relative bg-white text-stone-900">
      <Header />
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-grow flex flex-col relative z-0 w-full overflow-hidden">
        {children}
      </main>
      
      <Footer setActiveTab={setActiveTab} />
      
      <Toast />
    </div>
  );
};

export default MainLayout;