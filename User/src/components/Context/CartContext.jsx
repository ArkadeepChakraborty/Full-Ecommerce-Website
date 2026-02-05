import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const getCartCount = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/cart/getCartByUser`, {
        method: 'GET',
        credentials: 'include' // ✅ Important: sends cookies
        //  withCredentials: true,
      });

      const json = await res.json();

      if (json.success && json.data && json.data.cartItems) {
        setCartCount(json.data.cartItems.length);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartCount(0);
    }
  };

  const updateCartCount = () => {
    getCartCount();
  };

  useEffect(() => {
    getCartCount(); // ✅ Always try to fetch on mount
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
};
