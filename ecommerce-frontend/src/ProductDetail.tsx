import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from './useCart';
import { api } from './api';
import { Product } from './types';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get<Product>(`/products/${id}`);
        setProduct(response.data);
      } catch {
        toast.error('Product not found.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 mt-10 grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
        <div className="aspect-square bg-gray-700 rounded-2xl" />
        <div className="space-y-4">
          <div className="h-8 bg-gray-700 rounded w-3/4" />
          <div className="h-6 bg-gray-700 rounded w-1/4" />
          <div className="h-4 bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-700 rounded w-5/6" />
          <div className="h-12 bg-gray-700 rounded-xl mt-6" />
        </div>
      </div>
    );
  }

  if (!product) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`Added ${quantity} × ${product.title} to cart`);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10">
      <Link to="/" className="text-gray-400 hover:text-white text-sm mb-8 inline-flex items-center gap-1">
        ← Back to store
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
        {/* Image */}
        <div className="rounded-2xl overflow-hidden bg-gray-800 border border-gray-700">
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover"
            onError={e => {
              (e.target as HTMLImageElement).src =
                'https://placehold.co/600x600/111827/4ade80?text=Byte+Coming+Soon';
            }}
          />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-2">{product.title}</h1>
            <span className="text-4xl font-black text-orange-400">${product.price.toFixed(2)}</span>
          </div>

          <p className="text-gray-300 leading-relaxed">{product.description}</p>

          {product.stock_quantity > 0 ? (
            <p className={`text-sm font-semibold ${product.stock_quantity < 5 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
              {product.stock_quantity < 5
                ? `⚠️ Only ${product.stock_quantity} left!`
                : `✓ In stock (${product.stock_quantity} available)`}
            </p>
          ) : (
            <p className="text-rose-500 font-bold uppercase tracking-widest text-sm">Out of Stock</p>
          )}

          {/* Quantity selector */}
          {product.stock_quantity > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">Quantity:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="bg-gray-700 hover:bg-gray-600 w-8 h-8 rounded-full font-bold transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock_quantity, q + 1))}
                  className="bg-gray-700 hover:bg-gray-600 w-8 h-8 rounded-full font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
              product.stock_quantity === 0
                ? 'bg-gray-700 cursor-not-allowed text-gray-500'
                : 'bg-linear-to-r from-orange-400 to-rose-600 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-500/20 text-white'
            }`}
          >
            {product.stock_quantity === 0 ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
