import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import { ChatInterface } from '@/components/ChatInterface';
import { useAppStore, Product } from '@/lib/store';

interface PurchaseHistoryItem {
  productId: string;
  price: number;
  timestamp: Date;
  attribute: string; // Thông tin đặc trưng: size, màu sắc, phiên bản, v.v.
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { products } = useAppStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const { addToCart } = useCart();

  // Dữ liệu giả lập lịch sử mua hàng cho tất cả sản phẩm trong demoProducts
  const mockPurchaseHistory: PurchaseHistoryItem[] = [
    {
      productId: '1', // Giày Chạy Bộ Nike Air Zoom Pegasus
      price: 2490000,
      timestamp: new Date('2025-08-20T14:30:00'),
      attribute: 'Size 42',
    },
    {
      productId: '2', // Bình Nước Thể Thao Lock&Lock
      price: 190000,
      timestamp: new Date('2025-08-19T10:15:00'),
      attribute: 'Màu xanh dương',
    },
    {
      productId: '3', // Áo Thun Thể Thao Adidas
      price: 450000,
      timestamp: new Date('2025-08-18T09:00:00'),
      attribute: 'Size L',
    },
    {
      productId: '4', // Túi Xách Công Sở Da Thật
      price: 850000,
      timestamp: new Date('2025-08-17T15:45:00'),
      attribute: 'Màu đen',
    },
    {
      productId: '5', // Balo Laptop Công Sở Xiaomi
      price: 650000,
      timestamp: new Date('2025-08-16T11:30:00'),
      attribute: 'Màu xám',
    },
    {
      productId: '6', // Ví Da Nam Công Sở
      price: 390000,
      timestamp: new Date('2025-08-15T08:20:00'),
      attribute: 'Màu nâu',
    },
    {
      productId: '7', // Tai Nghe Bluetooth Sony WH-CH510
      price: 1190000,
      timestamp: new Date('2025-08-14T16:10:00'),
      attribute: 'Phiên bản Bluetooth 5.0',
    },
    {
      productId: '8', // Đồng Hồ Thông Minh Apple Watch
      price: 8990000,
      timestamp: new Date('2025-08-13T13:25:00'),
      attribute: 'Dung lượng 32GB',
    },
    {
      productId: '9', // Chuột Không Dây Logitech M331
      price: 350000,
      timestamp: new Date('2025-08-12T10:00:00'),
      attribute: 'Màu đen',
    },
  ];

  const combos = [
    {
      id: 1,
      name: 'Combo 3 Học Tập và Làm Việc',
      products: [
        {
          id: 'c1-1',
          name: 'Tai nghe dây chống ồn có mic',
          price: 275000,
          listedPrice: 440000,
          thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop',
        },
        {
          id: 'c1-2',
          name: 'Chuột không dây Targus W600',
          price: 245000,
          listedPrice: 319000,
          thumbnail: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=200&h=200&fit=crop',
        },
        {
          id: 'c1-3',
          name: 'Giá đỡ tản nhiệt ICore LS102 Bạc',
          price: 279000,
          listedPrice: 399000,
          thumbnail: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=200&h=200&fit=crop',
        },
      ],
    },
    {
      id: 2,
      name: 'Combo 2 Học Tập và Làm Việc',
      products: [
        {
          id: 'c1-1',
          name: 'Tai nghe dây chống ồn có mic',
          price: 275000,
          listedPrice: 440000,
          thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop',
        },
        {
          id: 'c1-2',
          name: 'Chuột không dây Targus W600',
          price: 245000,
          listedPrice: 319000,
          thumbnail: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=200&h=200&fit=crop',
        },
      ],
    },
  ];

  const [selectedCombo, setSelectedCombo] = useState(combos[0]);

  const getComboSummary = (combo) => {
    const totalPrice = combo.products.reduce((sum, p) => sum + p.price, 0);
    const totalListed = combo.products.reduce((sum, p) => sum + (p.listedPrice || p.price), 0);
    const saving = totalListed - totalPrice;
    const percent = Math.round((saving / totalListed) * 100);
    return { totalPrice, totalListed, saving, percent };
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id, products]);

  const fetchProduct = () => {
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      const related = products
        .filter(p => p.id !== id && p.category === foundProduct.category)
        .slice(0, 4);
      setRelatedProducts(related);
    }
    setLoading(false);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast({
        title: 'Đã thêm vào giỏ hàng',
        description: `${quantity} ${product.name}(s) đã được thêm vào giỏ hàng của bạn`,
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

  // Lấy lần mua gần nhất từ mockPurchaseHistory
  const lastPurchase = mockPurchaseHistory.find(item => item.productId === id) || null;

  if (loading) {
    return (
      <div className="h-screen flex bg-background">
        <div className="w-1/3">
          <ChatInterface onSelectSuggestion={() => {}} />
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
          <ChatInterface onSelectSuggestion={() => {}} />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Không tìm thấy sản phẩm</h1>
            <Link to="/shop">
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
      <div className="w-1/3">
        <ChatInterface onSelectSuggestion={() => {}} product={product} lastPurchase={lastPurchase} />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between">
            <Link to="/shop">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại trang chủ
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Chi tiết sản phẩm</h1>
            <div></div>
          </div>
        </div>
        <div className="p-6 space-y-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden relative">
                {product.listedPrice && product.listedPrice > product.price && (
                  <span className="absolute top-2 right-2 z-10 px-2 py-1 rounded-lg bg-red-600 text-white text-xs font-bold shadow-lg animate-pulse">
                    -{Math.round(100 - (product.price / product.listedPrice) * 100)}%
                  </span>
                )}
                <img
                  src={product.thumbnail}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=800&fit=crop';
                  }}
                />
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  {product.category && (
                    <Badge variant="secondary" className="text-sm">
                      {product.category}
                    </Badge>
                  )}
                  <h1 className="text-3xl font-bold leading-tight">{product.name}</h1>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  {product.listedPrice && product.listedPrice > product.price && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(product.listedPrice)}
                    </span>
                  )}
                  {product.listedPrice && product.listedPrice > product.price && (
                    <Badge variant="destructive" className="text-xs font-bold ml-2">
                      Tiết kiệm {formatPrice(product.listedPrice - product.price)}
                    </Badge>
                  )}
                </div>
                {product.badges && product.badges.length > 0 && (
                  <div className="flex gap-1">
                    {product.badges.map((badge, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                )}
                {product.shortDescription && (
                  <p className="text-muted-foreground leading-relaxed">
                    {product.shortDescription}
                  </p>
                )}
                {product.description && product.description !== product.shortDescription && (
                  <p className="text-muted-foreground leading-relaxed text-sm">
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
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-red-600 text-lg font-bold">🔥 Giảm thêm khi mua kèm</span>
              <div className="flex gap-2">
                {combos.map((combo, idx) => (
                  <Button key={idx} variant={selectedCombo.id === combo.id ? "secondary" : "outline"} size="sm" onClick={() => setSelectedCombo(combo)}>
                    {combo.name}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {selectedCombo.products.map((p) => (
                <div key={p.id} className="bg-muted rounded-lg p-3 flex items-center w-full space-x-2">
                  <img src={p.thumbnail} alt={p.name} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <div className="text-sm font-semibold line-clamp-1">{p.name}</div>
                    <div className='flex items-center space-x-2'>
                      <div className="text-base font-bold text-primary">{formatPrice(p.price)}</div>
                      <div className="text-xs text-muted-foreground line-through">{formatPrice(p.listedPrice)}</div>
                    </div>
                    <div className="text-xs text-green-600 font-semibold">
                      Tiết kiệm: {formatPrice((p.listedPrice || p.price) - p.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {(() => {
              const summary = getComboSummary(combos[0]);
              return (
                <div className="flex items-center justify-between border-t pt-4 mt-2">
                  <div>
                    <div className="text-lg font-bold text-primary">
                      Tổng tiền: {formatPrice(summary.totalPrice)}
                      <span className="text-muted-foreground text-base ml-2 line-through">{formatPrice(summary.totalListed)}</span>
                      <span className="text-green-600 font-semibold ml-2">- {summary.percent} %</span>
                    </div>
                    <div className="text-green-600 font-semibold">Tiết kiệm: {formatPrice(summary.saving)}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="lg">
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Thêm vào giỏ hàng
                    </Button>
                    <Button variant="destructive" size="lg">
                      Chọn mua kèm
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
          {relatedProducts.length > 0 && (
            <div className="space-y-4 border-t border-border pt-8">
              <h2 className="text-2xl font-bold">Sản phẩm liên quan</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {relatedProducts.map((relatedProduct) => (
                  <Card 
                    key={relatedProduct.id} 
                    className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  >
                    <Link to={`/shop/${relatedProduct.id}`}>
                      <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                        <img
                          src={relatedProduct.thumbnail}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop';
                          }}
                        />
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
                          {relatedProduct.badges && relatedProduct.badges.length > 0 && (
                            <div className="flex gap-1">
                              {relatedProduct.badges.slice(0, 1).map((badge, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {badge}
                                </Badge>
                              ))}
                            </div>
                          )}
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