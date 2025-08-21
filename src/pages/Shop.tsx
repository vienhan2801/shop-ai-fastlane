import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, RotateCcw, Maximize, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import { ChatInterface } from '@/components/ChatInterface';
import { useAppStore, Product } from '@/lib/store';

export default function Shop() {
  const navigate = useNavigate();
  const { survey, products, reset } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Handle filter changes with loading
  useEffect(() => {
    if (filter) {
      setFilterLoading(true);
      const timer = setTimeout(() => setFilterLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [filter]);

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

  const handleReset = () => {
    reset();
    navigate('/onboard');
  };

  const filteredProducts = filter
    ? products.filter((p) => {
        const lowercaseFilter = filter.toLowerCase();
        if (lowercaseFilter === 'sản phẩm khuyến mãi') {
          return p.listedPrice && p.listedPrice > p.price && p.price > 0;
        }
        if (lowercaseFilter === 'sản phẩm hot') {
          return p.badges?.some((badge) => badge.toLowerCase() === 'hot');
        }
        if (lowercaseFilter === 'sản phẩm best seller') {
          return p.badges?.some((badge) => badge.toLowerCase() === 'best seller');
        }
        return (
          p.category.toLowerCase().includes(lowercaseFilter) ||
          p.name.toLowerCase().includes(lowercaseFilter)
        );
      })
    : products;

  return (
    <div className="h-screen flex bg-background">
      {/* Left Column - Sticky AI Chat Interface */}
      <div className="w-1/3">
        <ChatInterface onSelectSuggestion={setFilter} />
      </div>

      {/* Right Column - Product Grid */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 p-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/analyze')}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{survey?.shopName || 'Mini Shop Prometheus'}</h1>
                <p className="text-sm text-muted-foreground">
                  {survey?.industry || 'Tổng hợp'} • {products.length} sản phẩm
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleReset}>
                Tạo lại từ đầu
              </Button>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-muted-foreground">Khám phá sản phẩm tuyệt vời với giá cả hấp dẫn</p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="p-6">
          {loading || filterLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-muted-foreground">
                {loading ? 'Đang tải sản phẩm...' : 'Đang lọc sản phẩm...'}
                <div className="mt-4 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                >
                  <Link to={`/shop/${product.id}`}>
                    <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden relative">
                      {product.listedPrice && product.listedPrice > product.price && (
                        <span
                          className="absolute top-2 right-2 z-10 px-2 py-1 rounded-lg bg-red-600 text-white text-xs font-bold shadow-lg animate-pulse"
                          style={{ pointerEvents: 'none' }}
                        >
                          -{Math.round(100 - (product.price / product.listedPrice) * 100)}%
                        </span>
                      )}
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop';
                        }}
                      />
                    </div>
                  </Link>
                  
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <div className='mb-1'>
                          {product.category && (
                          <Badge variant="secondary" className="text-xs">
                            {product.category}
                          </Badge>
                        )}
                        </div>
                        <Link to={`/shop/${product.id}`}>
                          <h3 className="font-semibold text-sm line-clamp-2 leading-tight hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-primary">
                            {formatPrice(product.price)}
                          </span>
                          {product.listedPrice && product.listedPrice > product.price && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(product.listedPrice)}
                            </span>
                          )}
                        </div>
                        <div className='flex items-center'>
                          {product.badges && product.badges.length > 0 && (
                          <div className="flex gap-1">
                            {product.badges.slice(0, 2).map((badge, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        )}
                        </div>
                      </div>
                      
                      <div>
                        <Badge variant="destructive" className="text-xs px-2 py-1">
                          Còn {product.stock ?? 10} sản phẩm
                        </Badge>
                      </div>
                      
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
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

          {products.length === 0 && !loading && !filterLoading && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Không có sản phẩm nào</p>
              <Button variant="outline" className="mt-4" onClick={handleReset}>
                Tạo shop mới
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}