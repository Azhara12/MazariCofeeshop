import React, { useState, useRef, useEffect } from "react";
import {
  ShoppingBag,
  Menu,
  X,
  Heart,
  LogOut,
  ShieldCheck,
  Package,
} from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useScrollPosition } from "../../hooks/useScrollPosition";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import WishlistDrawer from "./WishlistDrawer";

const Navbar = ({ activeTab, setActiveTab }) => {
  const { totalItems } = useCart();
  const { scrolled } = useScrollPosition();
  const { user, isAdmin, logout } = useAuth();
  const { wishlist } = useWishlist();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);

  const prevItems = useRef(totalItems);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "menu", label: "Menu" },
    { id: "contact", label: "Contact" },
  ];

  useEffect(() => {
    if (totalItems > prevItems.current) {
      setCartBounce(true);
      const t = setTimeout(() => setCartBounce(false), 600);
      prevItems.current = totalItems;
      return () => clearTimeout(t);
    }
    prevItems.current = totalItems;
  }, [totalItems]);

  const navigate = (tab) => {
    setActiveTab(tab);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-lg shadow-md border-b border-amber-900/10"
            : "bg-[#FAF6F0]/90 backdrop-blur-md border-b border-amber-900/5"
        } py-0`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate("home")}
            className="flex items-center gap-2 group cursor-pointer"
            aria-label="MazariCS Home"
          >
            <div className="w-8 h-8 rounded-full bg-[#C68B45] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <span className="text-white text-sm font-bold">M</span>
            </div>
            <span
              className="text-xl font-bold text-[#3D2817] tracking-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              MazariCS
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                  activeTab === item.id
                    ? "text-[#C68B45] bg-amber-50 font-semibold"
                    : "text-stone-600 hover:text-[#3D2817] hover:bg-stone-100"
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C68B45]" />
                )}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">

            <button
              onClick={() => setShowWishlist(true)}
              className="relative w-9 h-9 flex items-center justify-center rounded-full text-stone-500 hover:text-[#C68B45] hover:bg-amber-50 transition-all cursor-pointer"
              aria-label="Open Wishlist"
            >
              <Heart
                className={`w-4.5 h-4.5 ${
                  wishlist.length > 0 ? "text-red-500 fill-red-500" : ""
                }`}
              />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-bounce">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate("cart")}
              className="relative w-9 h-9 flex items-center justify-center rounded-full text-[#3D2817] hover:text-[#C68B45] hover:bg-amber-50 transition-all cursor-pointer"
              aria-label={`Cart, ${totalItems} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span
                  className={`absolute -top-0.5 -right-0.5 bg-[#C68B45] text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm ${
                    cartBounce ? "animate-cartBounce" : ""
                  }`}
                >
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>

            {/* User Profile Badge & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100/80 text-[#3D2817] px-3 py-1.5 rounded-full border border-amber-200/60 transition-all font-medium text-xs sm:text-sm shadow-sm cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-[#C68B45] text-white flex items-center justify-center font-bold text-xs uppercase">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <span className="max-w-[90px] truncate hidden sm:inline">
                  {user?.name}
                </span>
                {isAdmin && (
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600 " />
                )}
              </button>

              {/* User Dropdown */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-stone-200/80 py-2 z-50">
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="text-xs font-bold text-stone-800 truncate">
                      {user?.name}
                    </p>
                    <p className="text-[11px] text-stone-500 truncate">
                      {user?.email}
                    </p>
                    {isAdmin && (
                      <span className="inline-block mt-1 text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-semibold">
                        Admin Account
                      </span>
                    )}
                  </div>

                  {/* Admin Dashboard Button */}
                  {isAdmin && (
                    <button
                      onClick={() => {
                        navigate("admin");
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-amber-700 hover:bg-amber-50 transition-colors text-left font-bold cursor-pointer border-b border-stone-50"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#C68B45]" />
                      Admin Dashboard
                    </button>
                  )}

                  {/* My Orders Button */}
                  <button
                    onClick={() => {
                      navigate("orders");
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-stone-700 hover:bg-amber-50 transition-colors text-left font-medium cursor-pointer"
                  >
                    <Package className="w-4 h-4 text-[#C68B45]" />
                    My Orders
                  </button>

                  {/* Sign Out Button */}
                  <button
                    onClick={() => {
                      logout();
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 transition-colors text-left font-medium border-t border-stone-100 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-[#3D2817] hover:bg-stone-100 transition-all cursor-pointer"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`mobile-drawer-backdrop ${mobileOpen ? "open" : ""}`}
        onClick={() => setMobileOpen(false)}
      />
      <div className={`mobile-drawer ${mobileOpen ? "open" : ""}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <span
              className="text-xl font-bold text-[#EAD0B3]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              MazariCS
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <nav className="flex flex-col gap-1 flex-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left font-medium cursor-pointer ${
                  activeTab === item.id
                    ? "bg-[#C68B45] text-white"
                    : "text-[#EAD0B3]"
                }`}
              >
                {item.label}
              </button>
            ))}

            {isAdmin && (
              <button
                onClick={() => navigate("admin")}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left font-bold cursor-pointer mt-2 ${
                  activeTab === "admin"
                    ? "bg-[#C68B45] text-white"
                    : "bg-[#4D3827] text-amber-200"
                }`}
              >
                <ShieldCheck className="w-5 h-5" /> Admin Dashboard
              </button>
            )}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/10 space-y-3">
            <button
              onClick={() => {
                logout();
                setMobileOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-red-600/80 text-white py-3 rounded-full font-semibold text-sm cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out ({user?.name})
            </button>
          </div>
        </div>
      </div>

      {/* Wishlist Side Drawer */}
      <WishlistDrawer
        isOpen={showWishlist}
        onClose={() => setShowWishlist(false)}
      />
    </>
  );
};

export default Navbar;