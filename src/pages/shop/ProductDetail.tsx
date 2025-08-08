import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import { ChatInterface } from '@/components/ChatInterface';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { toast } = useToast();
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setProduct(data);
      
      // Fetch related products (same category, excluding current product)
      if (data.category) {
        const { data: related } = await supabase
          .from('products')
          .select('*')
          .eq('category', data.category)
          .neq('id', data.id)
          .gt('stock', 0)
          .limit(4);
        
        setRelatedProducts(related || []);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch product details',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast({
        title: 'Added to cart',
        description: `${quantity} ${product.name}(s) added to your cart`
      });
    }
  };

  const adjustQuantity = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && product && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="h-screen flex bg-background">
        <div className="w-1/3">
          <ChatInterface />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg text-muted-foreground">Đang tải sản phẩm...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-screen flex bg-background">
        <div className="w-1/3">
          <ChatInterface />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Không tìm thấy sản phẩm</h1>
            <Link to="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại trang chủ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background">
      {/* Left Column - Sticky AI Chat Interface */}
      <div className="w-1/3">
        <ChatInterface />
      </div>

      {/* Right Column - Product Detail */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại trang chủ
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Chi tiết sản phẩm</h1>
            <div></div>
          </div>
        </div>

        {/* Product Content */}
        <div className="p-6 space-y-8">
          {/* Product Main Info */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImage] || product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Không có hình ảnh
                  </div>
                )}
              </div>
              
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 ${
                        selectedImage === index ? 'border-primary' : 'border-border'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold leading-tight">{product.name}</h1>
                  {product.category && (
                    <Badge variant="secondary" className="text-sm">
                      {product.category}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  <div className="flex gap-1">
                    <Badge variant="outline" className="text-xs">
                      Chính Hãng
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Free Ship
                    </Badge>
                  </div>
                </div>

                {product.description && (
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>

              <div className="space-y-4 border-t border-border pt-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Tồn kho:</span>
                  <span className="font-medium">{product.stock} sản phẩm</span>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium">Số lượng:</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => adjustQuantity(-1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => adjustQuantity(1)}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                </Button>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="space-y-4 border-t border-border pt-8">
              <h2 className="text-2xl font-bold">Sản phẩm liên quan</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {relatedProducts.map((relatedProduct) => (
                  <Card 
                    key={relatedProduct.id} 
                    className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  >
                    <Link to={`/product/${relatedProduct.id}`}>
                      <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                        {relatedProduct.images && relatedProduct.images.length > 0 ? (
                          <img
                            src={relatedProduct.images[0]}
                            alt={relatedProduct.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="text-muted-foreground">Không có hình ảnh</div>
                        )}
                      </div>
                    </Link>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
                          {relatedProduct.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">
                            {formatPrice(relatedProduct.price)}
                          </span>
                          <div className="flex gap-1">
                            <Badge variant="outline" className="text-xs">
                              Chính Hãng
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}