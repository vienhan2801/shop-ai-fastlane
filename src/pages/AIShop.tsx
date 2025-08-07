import { useState, useEffect } from 'react';
import { Send, ShoppingCart, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';

interface ChatMessage {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

export default function AIShop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Xin chào! Mình là trợ lý AI của bạn tại Mini Shop. Bạn cần tìm sản phẩm nào hôm nay? 😊',
      isBot: true,
      timestamp: new Date()
    },
    {
      id: '2',
      content: 'Mình đang tìm giày chạy bộ phù hợp cho người mới bắt đầu.',
      isBot: false,
      timestamp: new Date()
    },
    {
      id: '3',
      content: 'Nếu bạn mới bắt đầu, mình gợi ý đôi giày Nike Air Zoom Pegasus, giá chỉ 2.490.000đ, thiết kế nhẹ, êm ái, phù hợp cho người mới bắt đầu. Bạn muốn xem thêm chi tiết hay thêm vào giỏ hàng ngay không?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
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

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      isBot: false,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Cảm ơn bạn đã nhắn tin! Mình đang xử lý yêu cầu của bạn...',
        isBot: true,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botMessage]);
    }, 1000);
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
      <div className="w-1/3 border-r border-border flex flex-col bg-card">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">AI Trợ Lý</h2>
              <p className="text-sm text-muted-foreground">Mini Shop Assistant</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              {message.isBot && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.isBot
                    ? 'bg-muted text-foreground'
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              {!message.isBot && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Chat Input - Fixed at bottom */}
        <div className="p-4 border-t border-border bg-background">
          <div className="flex gap-2">
            <Input
              placeholder="Nhập tin nhắn..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
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
                  
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
                          {product.name}
                        </h3>
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