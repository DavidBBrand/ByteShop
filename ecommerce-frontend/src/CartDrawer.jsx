import React from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom'; // Import the hook

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate(); // initialize the hook
  
  // create a function to handle checkout button click
    const handleCheckout = () => {
        setIsCartOpen(false); // Close the cart drawer
        navigate('/checkout'); // Navigate to the checkout page
    }
  return (
    <>
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsCartOpen(false)} />
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-gray-900 border-l border-gray-800 z-50 transform transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full p-6 text-white">
          <div className="flex justify-between items-center border-b border-gray-800 pb-4">
            <h2 className="text-xl font-bold uppercase tracking-widest">Cart</h2>
            <button onClick={() => setIsCartOpen(false)} className="text-2xl">&times;</button>
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex gap-4 mb-4 bg-gray-800/50 p-3 rounded">
                <img src={item.image_url} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{item.title}</h4>
                  <p className="text-orange-400">${item.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQuantity(item.id, -1)} className="bg-gray-700 px-2 rounded">-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="bg-gray-700 px-2 rounded">+</button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id)}>✕</button>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-4">
            <div className="flex justify-between font-bold text-xl mb-4">
              <span>Total:</span>
              <span className="text-orange-500">${cartTotal.toFixed(2)}</span>
            </div>
            <button className="w-full py-4 bg-orange-600 font-bold uppercase hover:bg-orange-500 transition-colors" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}