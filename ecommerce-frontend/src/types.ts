export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image_url: string;
  stock_quantity: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
  product?: { title: string };
}

export interface Order {
  id: number;
  total_price: number;
  created_at: string;
  items?: OrderItem[];
}

export interface User {
  email: string;
}
