import React, { createContext, useState, useCallback, useContext } from 'react';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('mazari_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch { 
      return []; 
    }
  });

  // Toggle wishlist item (expects full product object or at least object with id)
  const toggleWishlist = useCallback((product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      const next = exists
        ? prev.filter(item => item.id !== product.id)
        : [...prev, product];
      localStorage.setItem('mazari_wishlist', JSON.stringify(next));
      return next;
    });
  }, []);

  // Remove single item by ID
  const removeFromWishlist = useCallback((productId) => {
    setWishlist(prev => {
      const next = prev.filter(item => item.id !== productId);
      localStorage.setItem('mazari_wishlist', JSON.stringify(next));
      return next;
    });
  }, []);

  // Check if product is in wishlist
  const isWishlisted = useCallback((productId) => {
    return wishlist.some(item => item.id === productId);
  }, [wishlist]);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, removeFromWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);