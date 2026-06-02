import { createContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem } from './types';

interface CartContextType {
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  updateQuantity: (id: number, delta: number) => void;
  removeFromCart: (id: number) => void;
  cartTotal: number;
  cartCount: number;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('byteShopCart');
    return saved ? (JSON.parse(saved) as CartItem[]) : [];
  });

  useEffect(() => {
    localStorage.setItem('byteShopCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        isCartOpen, setIsCartOpen,
        cartItems, addToCart,
        updateQuantity, removeFromCart,
        cartTotal, cartCount, clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
