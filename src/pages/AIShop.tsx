import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import { ChatInterface } from '@/components/ChatInterface';
import { Link } from 'react-router-dom';

export default function AIShop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .gt('stock', 0)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách sản phẩm',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };


  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: 'Đã thêm vào giỏ hàng',
      description: `${product.name} đã được thêm vào giỏ hàng của bạn`
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Left Column - Sticky AI Chat Interface */}
      <div className="w-1/3">
        <ChatInterface />
      </div>

      {/* Right Column - Product Grid */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Mini Shop AI</h1>
            <p className="text-muted-foreground">Khám phá sản phẩm tuyệt vời với giá cả hấp dẫn</p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-muted-foreground">Đang tải sản phẩm...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card 
                  key={product.id} 
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                >
                  <Link to={`/product/${product.id}`}>
                    <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-muted-foreground">Không có hình ảnh</div>
                      )}
                    </div>
                  </Link>
                  
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Link to={`/product/${product.id}`}>
                          <h3 className="font-semibold text-sm line-clamp-2 leading-tight hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        {product.category && (
                          <Badge variant="secondary" className="text-xs">
                            {product.category}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
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
                      
                      <div className="text-sm text-muted-foreground">
                        Còn {product.stock} sản phẩm
                      </div>
                      
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Thêm vào giỏ
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {products.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Không có sản phẩm nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}