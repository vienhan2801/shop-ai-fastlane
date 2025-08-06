-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  category TEXT,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  order_notes TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'New',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (making it public for demo)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policies (public for demo)
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Products are insertable by everyone" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Products are updatable by everyone" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Products are deletable by everyone" ON public.products FOR DELETE USING (true);

CREATE POLICY "Orders are viewable by everyone" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Orders are insertable by everyone" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Orders are updatable by everyone" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Orders are deletable by everyone" ON public.orders FOR DELETE USING (true);

CREATE POLICY "Order items are viewable by everyone" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Order items are insertable by everyone" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Order items are updatable by everyone" ON public.order_items FOR UPDATE USING (true);
CREATE POLICY "Order items are deletable by everyone" ON public.order_items FOR DELETE USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data
INSERT INTO public.products (name, price, description, stock, category, images) VALUES
('Wireless Headphones', 89.99, 'High-quality wireless headphones with noise cancellation', 50, 'Electronics', '{"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"}'),
('Coffee Mug', 19.99, 'Premium ceramic coffee mug perfect for your morning brew', 25, 'Home & Kitchen', '{"https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400"}'),
('Running Shoes', 129.99, 'Comfortable running shoes for daily workouts', 30, 'Sports', '{"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"}'),
('Smartphone Case', 24.99, 'Protective case for your smartphone with elegant design', 100, 'Electronics', '{"https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400"}');