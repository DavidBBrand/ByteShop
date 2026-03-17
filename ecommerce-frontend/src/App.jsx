import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "./ProductCard"; 
import CartDrawer from './CartDrawer';
import Checkout from './Checkout'; 
import Login from './Login';  
import { useCart } from './CartContext';
import { useAuth } from './AuthContext'; 

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { setIsCartOpen, cartCount } = useCart();
  const { user, logout } = useAuth(); 

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
        <CartDrawer />

        <nav className="sticky top-0 z-40 bg-gradient-to-r from-gray-900 via-gray-800 to-black p-4 border-b border-orange-500/30 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent tracking-tighter">
                ByteShop
              </h1>
            </Link>
            
            <div className="flex items-center gap-4">
              {/* 4. Conditional Auth Links */}
              {user ? (
                <>
                  <span className="text-gray-400 text-sm hidden md:block">Hi, {user.email}</span>
                  <button 
                    onClick={logout}
                    className="text-sm text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-sm text-orange-400 hover:text-orange-300 font-medium">
                  Login
                </Link>
              )}

              <button 
                onClick={() => setIsCartOpen(true)}
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-all border border-gray-700 shadow-lg shadow-orange-500/10"
              >
                🛒 Cart: <span className="text-orange-400 font-bold">{cartCount}</span>
              </button>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <main className="max-w-7xl mx-auto p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </main>
          } />

          <Route path="/checkout" element={<Checkout />} />
          
          {/* LOGIN ROUTE */}
          <Route path="/login" element={<Login />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;