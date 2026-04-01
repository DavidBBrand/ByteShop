import React, { useState, useEffect } from 'react';
import { CartContext } from './CartContext';

export const CartProvider = ({ children }) => {
  // State for opening/closing the sidebar
  const [isCartOpen, setIsCartOpen] = useState(false);

  // State for items (with LocalStorage persistence)
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('byteShopCart');
    return saved ? JSON.parse(saved) : [];
  });

  // Keep LocalStorage in sync
  useEffect(() => {
    localStorage.setItem('byteShopCart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Core logic functions
  const addToCart = (product) => {
    setCartItems(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true); // Auto-open when adding
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Derived state (math)
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      isCartOpen, setIsCartOpen, 
      cartItems, addToCart, 
      updateQuantity, removeFromCart, 
      cartTotal, cartCount 
    }}>
      {children}
    </CartContext.Provider>
  );
};