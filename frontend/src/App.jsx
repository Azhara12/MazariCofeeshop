import React, { useState, Suspense, lazy } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import './index.css';

// ── Eager imports (always needed on first load) ────────────────────────────────
import SignIn        from './pages/SignIn';
import SignUp        from './pages/SignUp';
import ForgotPassword  from './pages/ForgotPassword';
import VerifyOtpReset  from './pages/VerifyOtpReset';

// ── Lazy imports (code-split) ─────────────────────────────────────────────────
const MainLayout     = lazy(() => import('./layouts/MainLayout'));
const Home           = lazy(() => import('./pages/Home'));
const About          = lazy(() => import('./pages/About'));
const Menu           = lazy(() => import('./pages/Menu'));
const Contact        = lazy(() => import('./pages/Contact'));
const Cart           = lazy(() => import('./pages/Cart'));
const Orders         = lazy(() => import('./pages/Orders'));

const AdminLayout    = lazy(() => import('./components/admin/AdminLayout'));
const AdminRoute     = lazy(() => import('./components/admin/AdminRoute'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminOrders    = lazy(() => import('./pages/admin/AdminOrders'));
const AdminProducts  = lazy(() => import('./pages/admin/AdminProducts'));
const AdminUsers     = lazy(() => import('./pages/admin/AdminUsers'));
const AdminSettings  = lazy(() => import('./pages/admin/AdminSettings'));

// ── Full-page loader ──────────────────────────────────────────────────────────
const PageLoader = () => (
  <div
    style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #3D2817 0%, #2A1B10 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
    }}
  >
    <div style={{ fontSize: 40, animation: 'float 2s ease-in-out infinite' }}>☕</div>
    <p style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-sans)', fontSize: 14 }}>
      Loading MazariCS…
    </p>
  </div>
);

// ── App Content ───────────────────────────────────────────────────────────────
function AppContent() {
  const [activeTab, setActiveTab]           = useState('home');
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard');
  const [authView, setAuthView]             = useState('login');
  const [authPageState, setAuthPageState]   = useState(null);

  const { isAuthenticated, loading } = useAuth();

  const navigateAuth = (view, state = null) => {
    setAuthView(view);
    setAuthPageState(state);
  };

  // ── 1. Wait for localStorage session restore ──────────────────────────────
  if (loading) return <PageLoader />;

  // ── 2. Not authenticated → Auth pages (no lazy: must load immediately) ─────
  if (!isAuthenticated) {
    const authProps = { onNavigate: navigateAuth };
    switch (authView) {
      case 'register':      return <SignUp {...authProps} />;
      case 'forgot-password': return <ForgotPassword {...authProps} />;
      case 'verify-otp':    return <VerifyOtpReset {...authProps} pageState={authPageState} />;
      default:              return <SignIn {...authProps} />;
    }
  }

  // ── 3. Admin Panel ────────────────────────────────────────────────────────
  if (activeTab === 'admin') {
    return (
      <Suspense fallback={<PageLoader />}>
        <AdminRoute setActiveTab={setActiveTab}>
          <AdminLayout
            activeAdminTab={activeAdminTab}
            setActiveAdminTab={setActiveAdminTab}
            setActiveTab={setActiveTab}
          >
            <ErrorBoundary key={activeAdminTab}>
              {activeAdminTab === 'dashboard' && <AdminDashboard setActiveAdminTab={setActiveAdminTab} />}
              {activeAdminTab === 'orders'    && <AdminOrders />}
              {activeAdminTab === 'products'  && <AdminProducts />}
              {activeAdminTab === 'users'     && <AdminUsers />}
              {activeAdminTab === 'settings'  && <AdminSettings />}
            </ErrorBoundary>
          </AdminLayout>
        </AdminRoute>
      </Suspense>
    );
  }

  // ── 4. Main Store Pages ───────────────────────────────────────────────────
  const renderPage = () => {
    switch (activeTab) {
      case 'home':    return <Home setActiveTab={setActiveTab} />;
      case 'about':   return <About />;
      case 'menu':    return <Menu />;
      case 'contact': return <Contact />;
      case 'cart':    return <Cart setActiveTab={setActiveTab} />;
      case 'orders':  return <Orders />;
      default:        return <Home setActiveTab={setActiveTab} />;
    }
  };

  return (
    <Suspense fallback={<PageLoader />}>
      <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        <ErrorBoundary key={activeTab}>
          <div className="page-enter">
            {renderPage()}
          </div>
        </ErrorBoundary>
      </MainLayout>
    </Suspense>
  );
}

// ── Root App with all providers ───────────────────────────────────────────────
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <WishlistProvider>
              <CartProvider>
                <AppContent />
              </CartProvider>
            </WishlistProvider>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;