import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from './api';
import ProductCard from './ProductCard';
import CartDrawer from './CartDrawer';
import Checkout from './Checkout';
import Login from './Login';
import { useCart } from './useCart';
import { useAuth } from './AuthContext';
import Register from './Register';
import Orders from './Orders';
import ProtectedRoute from './ProtectedRoute';
import ProductDetail from './ProductDetail';
import { Product } from './types';
import { ProductGridSkeleton } from './SkeletonCard';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { setIsCartOpen, cartCount } = useCart();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Successfully logged out!');
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get<Product[]>('/products');
        setProducts(response.data);
      } catch {
        setError('Could not connect to the store. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500 font-bold bg-gray-900">
        {error}
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <CartDrawer />

        <nav className="sticky top-0 z-40 bg-linear-to-r from-gray-900 via-gray-800 to-black p-4 border-b border-orange-500/30 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <h1 className="text-3xl mr-8 font-extrabold bg-linear-to-r from-orange-500 to-rose-600 bg-clip-text text-transparent tracking-tighter">
                ByteShop
              </h1>
            </Link>

            <div className="flex items-center gap-8">
              {user?.email ? (
                <>
                  <span className="text-amber-500 font-bold text-lg hidden md:block">
                    Hello,{' '}
                    <span className="bg-linear-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent font-bold">
                      {user.email}
                    </span>
                    !
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-linear-to-r text-lg from-orange-400 to-rose-500 bg-clip-text text-transparent font-bold hover:text-rose-500 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : !user ? (
                <Link to="/login" className="text-lg text-orange-400 hover:text-orange-300 font-medium">
                  Login
                </Link>
              ) : null}

              {user && (
                <Link to="/orders" className="text-lg text-gray-400 hover:text-white">
                  My Orders
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
          <Route
            path="/"
            element={
              <main className="max-w-7xl mx-auto p-6">
                {loading ? (
                  <ProductGridSkeleton />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </main>
            }
          />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
