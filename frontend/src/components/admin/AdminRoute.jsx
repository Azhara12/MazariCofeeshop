import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert } from 'lucide-react';
import Button from '../ui/Button';

const AdminRoute = ({ children, setActiveTab }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-500 font-medium">Verifying Admin Access...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user?.isAdmin) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-[#3D2817] mb-4">Access Denied</h1>
        <p className="text-stone-500 max-w-md mb-8">
          You do not have the required administrator privileges to view this page. Please log in with an admin account or return to the home page.
        </p>
        <Button onClick={() => setActiveTab('home')} size="lg">
          Return to Home
        </Button>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;
