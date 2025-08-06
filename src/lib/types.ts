export interface Product {
  id: string;
  name: string;
  price: number;
  description: string | null;
  stock: number;
  category: string | null;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  order_notes: string | null;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
  product?: Product;
}

export interface CartItem {
  product: Product;
  quantity: number;
}