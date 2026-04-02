import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "./ProductCard";
import CartDrawer from "./CartDrawer";
import Checkout from "./Checkout";
import Login from "./Login";
import { useCart } from "./useCart";
import { useAuth } from "./AuthContext";
import Register from "./Register";
import Orders from "./Orders";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  const { setIsCartOpen, cartCount } = useCart();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout(); // Call the original function from AuthContext
    setShowLogoutAlert(true);
    setTimeout(() => setShowLogoutAlert(false), 3000); // Hide after 3 seconds
  };

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

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-xl text-white bg-gray-900">
        Loading ByteShop...
      </div>
    );
  if (error)
    return (
      <div className="flex h-screen items-center justify-center text-red-500 font-bold bg-gray-900">
        {error}
      </div>
    );

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <CartDrawer />

        <nav className="sticky top-0 z-40 bg-linear-to-r from-gray-900 via-gray-800 to-black p-4 border-b border-orange-500/30 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <h1 className="text-3xl mr-8 font-extrabold bg-linear-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tighter">
                ByteShop
              </h1>
            </Link>

            <div className="flex items-center gap-8">
              {/* Conditional Auth Links */}
              {user && user.email ? (
                <>
                  <span className="text-amber-500 font-bold text-sm hidden md:block">
                    Hello, <span className="bg-linear-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent font-bold">{user.email}</span>!
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-linear-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent font-bold hover:text-rose-500 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : !user ? (
                <Link
                  to="/login"
                  className="text-sm text-orange-400 hover:text-orange-300 font-medium"
                >
                  Login
                </Link>
              ) : null}
              {user && (
                <Link
                  to="/orders"
                  className="text-sm text-gray-400 hover:text-white"
                >
                  My Orders
                </Link>
              )}

              <button
                onClick={() => setIsCartOpen(true)}
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-all border border-gray-700 shadow-lg shadow-orange-500/10"
              >
                🛒 Cart:{" "}
                <span className="text-orange-400 font-bold">{cartCount}</span>
              </button>
            </div>
          </div>
        </nav>

        {showLogoutAlert && (
          <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
            Successfully logged out!
          </div>
        )}

        <Routes>
          <Route
            path="/"
            element={
              <main className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </main>
            }
          />

          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          {/* LOGIN ROUTE */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
