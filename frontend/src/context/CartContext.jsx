import React, { createContext, useState, useEffect, useCallback } from "react";

export const CartContext = createContext();

const PROMO_CODES = {
  COFFEE10: { discount: 0.1, label: "10% off your order" },
  MAZARI20: { discount: 0.2, label: "20% off your order" },
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("mazari_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoLabel, setPromoLabel] = useState("");
  const [promoError, setPromoError] = useState("");

  // ── Read Dynamic Admin Store Settings ──────────────────────────────────────────
  const [storeSettings, setStoreSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("mazari_store_settings");
      return saved
        ? JSON.parse(saved)
        : {
            deliveryFee: "2.50",
            freeDeliveryThreshold: "25.00",
            currency: "$",
          };
    } catch {
      return {
        deliveryFee: "2.50",
        freeDeliveryThreshold: "25.00",
        currency: "$",
      };
    }
  });

  // Settings change event capture karne ke liye listener
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem("mazari_store_settings");
        if (saved) setStoreSettings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load store settings", e);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    localStorage.setItem("mazari_cart", JSON.stringify(cart));
  }, [cart]);

  // ── Cart Actions ─────────────────────────────────────────────────────────────
  const addToCart = useCallback((product, customization = {}) => {
    const {
      size = product.sizes?.[0]?.label || null,
      sizeDelta = 0,
      milk = "Whole Milk",
      sweetness = "100%",
      extraShots = 0,
      syrups = [],
      quantity = 1,
    } = customization;

    const extraPrice = sizeDelta + extraShots * 0.75 + syrups.length * 0.5;
    const finalPrice = product.price + extraPrice;
    const customKey = `${product.id}-${size}-${milk}-${sweetness}-${extraShots}-${syrups.join(",")}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.cartKey === customKey);
      if (existing) {
        return prev.map((item) =>
          item.cartKey === customKey
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [
        ...prev,
        {
          ...product,
          price: finalPrice,
          basePrice: product.price,
          quantity,
          cartKey: customKey,
          customization: { size, milk, sweetness, extraShots, syrups },
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((cartKey) => {
    setCart((prev) => prev.filter((item) => item.cartKey !== cartKey));
  }, []);

  const updateQuantity = useCallback((cartKey, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartKey === cartKey) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setPromoCode("");
    setPromoDiscount(0);
    setPromoLabel("");
    setPromoError("");
  }, []);

  // ── Promo Engine ─────────────────────────────────────────────────────────────
  const applyPromo = useCallback((code) => {
    const upper = code.trim().toUpperCase();
    if (!upper) {
      setPromoError("Please enter a promo code.");
      return false;
    }
    const found = PROMO_CODES[upper];
    if (found) {
      setPromoCode(upper);
      setPromoDiscount(found.discount);
      setPromoLabel(found.label);
      setPromoError("");
      return true;
    } else {
      setPromoError("Invalid promo code. Try COFFEE10 or MAZARI20.");
      return false;
    }
  }, []);

  const removePromo = useCallback(() => {
    setPromoCode("");
    setPromoDiscount(0);
    setPromoLabel("");
    setPromoError("");
  }, []);

  // ── Dynamic Derived Calculations ──────────────────────────────────────────────
  const baseDeliveryFee = parseFloat(storeSettings.deliveryFee || 2.5);
  const freeThreshold = parseFloat(storeSettings.freeDeliveryThreshold || 25.0);
  const currencySymbol = storeSettings.currency || "$";

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  // Dynamic Shipping Fee Calculation
  const shippingFee =
    subtotal >= freeThreshold || subtotal === 0 ? 0 : baseDeliveryFee;
  const taxAmount = subtotal * 0.08;
  const discountAmount = subtotal * promoDiscount;
  const totalPrice = subtotal + shippingFee + taxAmount - discountAmount;

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItems,
        subtotal,
        shippingFee,
        taxAmount,
        discountAmount,
        totalPrice,
        promoCode,
        promoDiscount,
        promoLabel,
        promoError,
        currencySymbol,
        freeThreshold,
        baseDeliveryFee,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyPromo,
        removePromo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
