import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "./ProductCard"; 
import CartDrawer from './CartDrawer';
import Checkout from './Checkout'; // Make sure to create this file!
import { useCart } from './CartContext';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pull what we need from Context
  const { setIsCartOpen, cartCount } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://127.0.0.1:8000/products");
        setProducts(response.data);
      } catch (err) {
        setError("Could not connect to the store. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center text-xl text-white bg-gray-900">Loading ByteShop...</div>;
  if (error) return <div className="flex h-screen items-center justify-center text-red-500 font-bold bg-gray-900">{error}</div>;

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        
        {/* 1. GLOBAL UI ELEMENTS (Visible on all routes) */}
        <CartDrawer />

        <nav className="sticky top-0 z-40 bg-gradient-to-r from-gray-900 via-gray-800 to-black p-4 border-b border-orange-500/30 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent tracking-tighter">
                ByteShop
              </h1>
            </Link>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-all border border-gray-700 shadow-lg shadow-orange-500/10"
            >
              🛒 Cart: <span className="text-orange-400 font-bold">{cartCount}</span> items
            </button>
          </div>
        </nav>

        {/* 2. DYNAMIC CONTENT AREA */}
        <Routes>
          {/* HOME ROUTE */}
          <Route path="/" element={
            <main className="max-w-7xl mx-auto p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            </main>
          } />

          {/* CHECKOUT ROUTE */}
          <Route path="/checkout" element={<Checkout />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;