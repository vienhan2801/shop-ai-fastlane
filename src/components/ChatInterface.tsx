import { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatMessage {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

const initialMessages: ChatMessage[] = [
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
];

export function ChatInterface() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');

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

  return (
    <div className="w-full h-full border-r border-border flex flex-col bg-card">
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
  );
}