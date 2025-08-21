import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Send, Bot, User, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Product } from '@/lib/store';

interface ChatMessage {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

interface PurchaseHistoryItem {
  productId: string;
  price: number;
  timestamp: Date;
  attribute: string; // Thông tin đặc trưng: size, màu sắc, phiên bản, v.v.
}

interface ChatInterfaceProps {
  onSelectSuggestion: Dispatch<SetStateAction<string>>;
  product?: Product | null;
  lastPurchase?: PurchaseHistoryItem | null;
}

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    content: 'Xin chào! Mình là trợ lý AI của bạn tại Mini Shop. Bạn cần tìm sản phẩm nào hôm nay? 😊',
    isBot: true,
    timestamp: new Date(),
  },
];

export function ChatInterface({ onSelectSuggestion, product, lastPurchase }: ChatInterfaceProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isBotLoading, setIsBotLoading] = useState(false);

  const suggestions = [
    { id: 's1', text: 'Sản phẩm khuyến mãi', keyword: 'Sản phẩm khuyến mãi' },
    { id: 's2', text: 'Sản phẩm hot', keyword: 'Sản phẩm hot' },
    { id: 's3', text: 'Sản phẩm best seller', keyword: 'Sản phẩm best seller' },
  ];

  // Hiển thị tin nhắn chào và lịch sử mua khi vào trang ProductDetail
  useEffect(() => {
    if (product) {
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        content: `Bạn đang xem sản phẩm ${product.name}... Bạn muốn tìm hiểu thêm về sản phẩm này hay khám phá các sản phẩm tương tự?`,
        isBot: true,
        timestamp: new Date(),
      };
      setChatMessages([welcomeMessage]);

      // Hiển thị lịch sử mua hàng nếu có
      if (lastPurchase) {
        const historyMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: `Bạn đã mua sản phẩm này vào ${lastPurchase.timestamp.toLocaleString('vi-VN')} với giá ${formatPrice(lastPurchase.price)} (${lastPurchase.attribute}). Bạn có muốn mua lại?`,
          isBot: true,
          timestamp: new Date(),
        };
        setTimeout(() => {
          setChatMessages((prev) => [...prev, historyMessage]);
          setShowSuggestions(true);
        }, 1000);
      }
    } else {
      setChatMessages(initialMessages);
      setShowSuggestions(true);
    }
  }, [product, lastPurchase]);

  const checkForKeywords = (message: string) => {
    const lowercaseMessage = message.toLowerCase();
    for (const suggestion of suggestions) {
      if (lowercaseMessage.includes(suggestion.keyword.toLowerCase())) {
        return suggestion.keyword;
      }
    }
    return message;
  };

  const getRandomSuggestion = (excludeKeyword: string) => {
    const otherSuggestions = suggestions.filter(s => s.keyword !== excludeKeyword);
    if (otherSuggestions.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * otherSuggestions.length);
    return otherSuggestions[randomIndex];
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      isBot: false,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setNewMessage('');
    setIsBotLoading(true);
    setShowSuggestions(false);

    const keyword = checkForKeywords(newMessage);
    onSelectSuggestion(keyword);

    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `Khám phá ngay ${keyword} với chất lượng vượt trội từ Mini Shop! Bạn muốn tìm thêm sản phẩm nào nữa?`,
        isBot: true,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, botMessage]);

      const otherSuggestion = getRandomSuggestion(keyword);
      if (otherSuggestion) {
        setTimeout(() => {
          const additionalBotMessage: ChatMessage = {
            id: (Date.now() + 2).toString(),
            content: `Ngoài ra, bạn đã thử khám phá ${otherSuggestion.text} chưa? Những món này đang rất được ưa chuộng đấy!`,
            isBot: true,
            timestamp: new Date(),
          };
          setChatMessages((prev) => [...prev, additionalBotMessage]);
          setShowSuggestions(true);
          setIsBotLoading(false);
        }, 1000);
      } else {
        setShowSuggestions(true);
        setIsBotLoading(false);
      }
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: { text: string; keyword: string }) => {
    setIsBotLoading(true);
    setShowSuggestions(false);
    onSelectSuggestion(suggestion.keyword);
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        content: suggestion.text,
        isBot: false,
        timestamp: new Date(),
      },
    ]);
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `Khám phá ngay ${suggestion.keyword} với chất lượng vượt trội từ Mini Shop! Bạn muốn tìm thêm sản phẩm nào nữa?`,
        isBot: true,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, botMessage]);

      const otherSuggestion = getRandomSuggestion(suggestion.keyword);
      if (otherSuggestion) {
        setTimeout(() => {
          const additionalBotMessage: ChatMessage = {
            id: (Date.now() + 2).toString(),
            content: `Ngoài ra, bạn đã thử khám phá ${otherSuggestion.text} chưa? Những món này đang rất được ưa chuộng đấy!`,
            isBot: true,
            timestamp: new Date(),
          };
          setChatMessages((prev) => [...prev, additionalBotMessage]);
          setShowSuggestions(true);
          setIsBotLoading(false);
        }, 1000);
      } else {
        setShowSuggestions(true);
        setIsBotLoading(false);
      }
    }, 1000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="w-full h-full border-r border-border flex flex-col bg-card relative">
      <div className="p-4 border-b border-border bg-[#0abf86]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 overflow-hidden rounded-full bg-primary/10 flex items-center justify-center">
            <img src="https://console.easyaichat.app/storage/bots/easychatgptio-ujc/logo-chat-1-f1kvea.png" alt="ai" />
          </div>
          <div>
            <h2 className="font-semibold text-lg text-white">Easy AI Chat</h2>
            <p className="text-sm text-white">Mini Shop Assistant</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col justify-between">
        <div className='space-y-4'>
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              {message.isBot && (
                <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center shrink-0">
                  <img src="https://console.easyaichat.app/storage/bots/easychatgptio-ujc/logo-chat-1-f1kvea.png" alt="ai" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.isBot
                    ? 'bg-muted text-foreground'
                    : 'bg-[#0abf86] text-primary-foreground'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
          {isBotLoading && (
            <div className="flex justify-start gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center shrink-0">
                <img src="https://console.easyaichat.app/storage/bots/easychatgptio-ujc/logo-chat-1-f1kvea.png" alt="ai" />
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        {showSuggestions && (
          <div className="flex items-end flex-col gap-2 ml-auto">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-2.5 pb-1 pt-0.5 w-fit border border-[#0abf86] text-[#0abf86] text-sm rounded-xl hover:bg-[#0abf86] hover:text-white cursor-pointer transition-colors"
              >
                {suggestion.text}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-4 border-t border-border bg-background">
        <div className="flex gap-2 relative">
          <Input
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              setShowSuggestions(false);
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 h-11 focus:!ring-0 focus:!outline-none !outline-none !ring-0 relative pr-16"
          />
          <div className="flex items-center space-x-3 absolute right-1 top-1/2 -translate-y-1/2">
            <Mic className="w-6 h-6 text-gray-400" />
            <Button onClick={handleSendMessage} size="icon" className="bg-gray-200 pr-1 size-[36px]">
              <Send className="w-4 h-4 text-gray-400 rotate-45" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center w-full px-4 flex-col text-center space-y-[1px] pt-2 pb-[2px]">
          <div className="flex-1 pr-2 pb-0">
            <div className="text-[10px] text-gray-500 font-medium leading-[120%]">Đối tác triển khai ứng dụng AI hàng đầu cho doanh nghiệp</div>
          </div>
          <a
            href="https://easyaichat.app/"
            target="_blank"
            className="text-[10px] text-gray-500 font-medium flex items-center space-x-1 px-2 py-[2px] hover:bg-gray-100 rounded-3xl"
          >
            <span>Powered by</span>
            <div className="flex items-center space-x-0.5">
              <div className='inline-flex items-center'>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVUAAABlCAYAAAD9AXA3AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAEBUSURBVHgB7X3br13Hed/vm3OOTNsxfFRbvjQXbvWCOkgBHRcuEqApdOjEtziOyCQ2kqIoqT+gkJSn9iXn0C996IOkvPShD6RQoIktO6TsNHISJzwqWsAt0ogqenGRojpqEl9iGz5OJZsSuffXWTPfde1NXSiS4mV9Es/ee61ZM7Nmzfzm911mFnCd5Y7P/PWjG4//8MOYZJJJJrlGcvS752ZHv/Xlc8MnrrMUXEdpYLqGM4Xw4Js+994HMMkkk0xyDYQvzStxo3txafHs0W/94Q6uoxCugxw6854ZX6JTDGxTIQbTIMACRy588s/3MMkkk0xyleQXKogS8y6hIo5AXCl0+o61cvK37jyyj2ss1xxUDz3+nu058NsEupMoFlmPEPZRNo5cOLa/j0kmmWSS1ymf+OaXjxLxGRpwpqLq8Hf4XuGVC2h/sU4fPHuNgfWaqv93PP6unQX4XL2xO9FmjeEvcwfUdqOHeX7pzOaZ2SYmmWSSSV6HDPZTKjhVwYUbjta/A5i2Lxi+8910afF/fvFbf/ggrqFcE6Y6gOQLl144M9g0Gh+1WaN/l1mDWKpQAfb0hV/6s/sxySSTTHIFcvTr52aLtfm5+vVwp6bciJtwuYGvcjUJEJUC4XWnF2vlocpaD3CV5aoz1UHdf+HiC0/Xm9luB1j+cOeoKn6v7ceJQ2d+7LoakyeZZJJbQypD3VysXaokjmcYGKkAzfDBnbW6KAhVzFmb89O/cg2iA64qqL7pc3c9MOc2W8waM2302+GzTxzMQsXbzQ6fwxRSv+y++cyPTREBk0wyyWuSixfnD1eU2WL0/xpRFUW4m1W7DMc4MTueXazA+stX2RxwVdT/Qd1//uL3T9UbOCqHututAWtpd+dOKrUG2PeahrploP0uJy784v5jmGSSSSZ5Bfn5b/3BTkWbpuUSRVTpdI4GtX8Al2YOaKmCq7wDbbuG6dFL6zh5NcwBrxtUNz5711at5pkFFodJq93uQcIZmsG4Hin9U4HWSxayrA1CdFAulSMvfGr/PCaZZJJJLiM/VwG1MrYdZaMUALP9pqYQkx5V0NVAK/9uYVf7awVHXm/Y1etS/yugPlBr/Uf134zCPKAUW2YAIpkSfGpQDq63pd8aO6/2kcW5t56ZbWGSSSaZZIUMgIoF77g1sR9n8383VV895Nz94i2ZBCDFKFa1wfLh+Rx/8slvnzuB1yFXxFTFuz/QbrVFsIKqito2eimBcLd7kZkDRZmt8FqJFGjHyn7NdIphnWSSSZJ8/C9/73jFy9OJlcpnyTBk7LThZrVE0qJDFfl5M8OWgIf1+COffceRh3AF8ppBdVgdNb8ozihhzz24tjueEH1tovpLJeGkG35D6KurLLzKYliHaYaeq5dPwDrJJJM06YCK0x1PBH+C74mIEgBF+6kkYFJzqrl6iC1GoJ0XtZqwX67AHPCa1P+Nz911/NLFS09DvPuprp1P6+8eSNX4J4+Q2zT/Hi3WUnWrcs+ye/DQLAeodlqcq8x4hkkmmeS2lo8KoA7fO2owBQAyXd49/3IqcLkOqGwHWZgqK3pxD1rivmTg8GKBP/rUd586jtcgrxpUNx6/62Es6gwB6quf2A2i7P9xvCbOGazg6QcomTXEFKthrcNfubvZi6BzhyZgnWSS21YGQK24cIqJEshwQCIyVLXVm07RhNOaA30Az+Y0ZxLASUy1mQq4Qe3dmC9Of+o753bwKuUV1X9R98/Ur1uwJV/qVqPmiBKwNHBUcjocLygUIlVlirBpg80swGJGoGgC6LZaCY3Yr/lNpoBJJrnNpAHqgk8H1V2wxAI0Wf34JWvPQPDt9GtY1htJDJIqzgJpoMLi2oKaGAgSZA+cr6ePvZI54GWZ6h2fedfRpu4T7oGVrdjZIsAyoMLugfWmul7PLA6qYNoIJgOzZ0BsAMZ6++qIns2MJsY6ySS3lXz4L58cVP5T4ZDS0I54Tb3tWEttGRHD12uGT3XT+E+KS1g7R+y0rscseQZS0PBvixd07lPfPnf05ep8WVAd1H0u/NtN3VegJF+w0EsU2yfMeMokrLNX1l1P2gBO0Ps11kLCTLGwG28cXeYhPTarzLcC6/tmmGSSSW5p+chf/v4DtKDTDoYcrKM8Ss09WrOxNeKlzNRuOkjXjoMHSNYHuOVAxcpjj7uaFSq//Svfeeqy5oAl9b+p+5fmp2op2z1ulJHCpWQFFINX5RdZ68gkQMpy2eaCvtoBQIoQsFUD0gBMyWTQPg8K1o68cOxPpwUCk0xyC8qHv/nkTkWNXQ15IvXgkNtOi/BNhUf9o0FUhHhcj3V7qmvcEKYKMz6qeJrhZOkbsoRNWqiUPab5/WNzQGKqw2Yoi4uLc/WibXV/jeNPEfE9Op7c6cTI4ComAdZ1t9TJdWe0Zh6AMOxlsPaZyQn75gLzp9/6xN88jkkmmeSWkg9/8/caoLYfQWU3EhYcUbCTMPRhTpZGpC1IOGn2QYQrdo6nEZ6CSOSmA722lbXYrkz63D/+1rntmJOB6vrj79qxzVBenWTAHUVOGeBanFSOIFOVX4wG1O2uzJRAlKWJ2BpEWrQ1Li9w+i1n/tYOJplkkltCPvLNJ08xL3Y7wSILjxqkbb3UgSPskmK+bAVeeAirJXKfFXoagxTNA1E9BhS7CWNOCQPsvl0rZvNC5/5RMAeQ7X2qW/WNheAVdibaAHKBvjzBHFK5bFrKR9b+w+ysBLPDyt1SCCrrewhoHfo1tgGCrMZqUmj3+/f975OYZJJJbko5+uyZzecPHTpTh/z28NtUdvFXm/EveP0NNSBOcYoq/8gEYMCrDqmEn/lT1f6RuSGdV+ZMcFCmcvYOmj9E65+961y1TWxrAb51lqn/0LX66hNTz/wKMA2bqaySGCrVgZHD5tXxhrSp/BgF9b/AbtfS1xvil+4/OLZ/1TednWSSSa6dfPTrT84uEp9rjmhaBXbRv+LelX6oA28FNOG2CglKTXN++poVyKZVAY8ceYa8mCVpAPGUVsJcrT4kmxDgkYHuPVRd7t9tQUzUc5IlBgqgHr7gXvu+b4rH4UaKjlXSa9hPFoS8c75ukcWY+kqILDuV7ROGWgf46Et0x9ObU2TAJJPcNPKzX39y+yLhT+oYPiysT22mYz+82DUdV2WDf2OgiXM6nKjH3zNlV5SNjCIGYDFGEQQkCwd6HcQCKUtCtTrDdfs/KIuT5eKnvnW+Iuun5SgFoNPctKSxSdTAlkxtD7bU0BjGaBPTdcNEdIgtiJnN6cWN0kvlw84InW9bTJqBOx9+iYYdrn5i2uFqkklucPmZb3zpgeEddnUg3+k0kFjX+wjEsECjklIDSjYGpjtQKV6w5FMci3i05xOz8loDD9N6uVNGcnjjvnzVYZvHPwgHXPjIsB9r06Nf/OS3H6mXPKJJ4o1bDKoWtmyC6DcjQfpje0UGYwV79qnEFgboz3YLGvuqiCtQypo/qRF5FJ0w/JiBLj795jN/55q+3GuSSSa5cvng13734eqQGjBHSBSrDbVhDEcccn+9urspbC/q1gGOsZdAjmtFB9K4Q8kgi0W3E0BfEugycpAj2CgNsgSkhn8PaWhVzH7YH/VcPXKv2VKxWpVP5cr92BGZKRTsQj5uh6Vg+h2/EJBKX0vGuibN7ClIe87IAl0tU+4sRxgUeuSFX/hfV7R91ySTTHL1ZbvaT4kXZ+ow3RIbXtghyl4IygoIZAbUqGjLdW5XFZ+P7S4F8MixBEeIricLr6vX5qWtUpotdCLzfy3lZ/YCPvlbdx3ZzXmIHPrN98yGDaK5v0BLhVek5Xx/K51T2SYhjaYmAAvqd8++pBMzsDeD5tDpOeeFAGHvALm62AK0BrqEZzfm+ODBsa/uY5JJJnnDZPvrX9yug3N4y/Im6XpQkI9otlVAy+pw3+5eoi79nKyg6s6qiBVweA0MU3w68Kh6AfUV5QnVU4TWRQi6pLU7s0rB2d/8a9vH4n2m4P8Lv/qN/TIvR+rX6EHvqCXxpiPXWrc+YKV3Su2kAVBBwYbgNtX+RfLUnQB1pYBXgxeiFmg0glzogD4UsujeOalZPXD3pUJPv+133ncck0wyyRsi21/7nYcr3JyrXzeD0gwgLEvvlkxVa9XB5JnwgnwX/35Ot+mTBB5WZfsAZHMACXpoIcOm1VHtt/LVDSS2V0/AZnitOe//gPj+8b0SVsjaZ95xtKrhZ/Aa5TImg8RqWzoqgOwEkMwESaUnuTcy9uq/ex4c8uuWZGO+7aVYUJpvM1h55Plf+O+TOWCSSa6TDOo+86VTkLDNwC4ZsrWHjdOXCXVaFQqlohZOsSR25mnsdZxW8xIrA4/MAzGlLIFVxtqjAvpy1QpTz1ZD5QdX7VhFl2uMjcff+WDN8uFRajaIZCtndbwq4u4r2fdVAa/fcVPPh6mgiAVB3gLQtpspgrMKlIVinmo+yJ673oStfCp+i5pfb+D9tfniyGQOmGSSayv/8GtfOFrR51QdtZumSLsN09V/xVABzJamcyRJSzFeSgyF6RhrQD7ZaU0rvho9LtfC41nzHgEjcwGZMYIlt1bWQcXWv3e5LQAvC6qDrH/mnbs1g50IjGRa+7LGn2yrCuztBVQZXNWWoMCoCwyEpYbtEYyhSrmjOcXmGdLWsPwwYr5hFYRcy7vPf+J/nMQkk0xyVWX72TObizet7TDKA0KbDGgM8VrAvtkph6ONWnG2DRjekCCDHR8BohzlAnY4zc6sYHflqPkibrACBWB1oFGqdzs2B459/p1HzuIy8rKgOsjG43edrnU4jmD9hC26ohD6lHauyo6sJbaqDRWbjszB1CIAeg5uDlgCWM1HrAMI5J3kHa7cMpMdaLKJVz731jc27j/42Pl9TDLJJK9bfro6oyqJOlWV5JnSRhrBjAJrhzW4Q0g4WXEXvQHbOB9alZef9Q2o2w7+kFRApIWBiQpeBS04Aa2Cc+PVJz8bPP2r5BVBFWc2NzcubpzDsPO/AGmvUmSdq1V/KBAHU0FME+YdDveclq3CQqmMmYICuc/pY56xDG2UVKbabb5b/5184RP/7VFMMskkVyQDO724sbZTh9SDqrGS7m/Krt4PaQ0gHQ3YAi3VDOBsFnoNPFKAgkMlAeBIVZckZDqqlQgldb5yqjjbkxAtuFt++DVffPpz7/6ZXbyCvDKoDjIA60sbwxsAZmzbwrDbO9nzWlbz+TIl6yxkYMhmYJGgBJspmtNJPXvDf7JnQFj0AFtYS2IU0MAJMr6fTQDhWP+xt76+PrHWSSZ5jfLTf1bZ6RqfwvB2jgSG/n0MNDRioQjxqmHE9rQClAIPqpgub54iAO6Ms6ryPWaLaQSqMFsuuSkCjiZSR4fcBZ98NYAar39FiTGsY7B8OfCUWWspAsCaIjDHzh5dIVBmCoBcvSf3DKqGL+kVaN1zSBSa0u2vlPLWVu/22EK7f/Xx/3oSk0wyycuKstM6jB7UAZ54JTngAdn41s/LL9dTofGfCrTtgzOxJddQtTQ1uSbGa1EAvXhOO1Q515X8c5B/4ruFTn/+HUfux6uUVw2qgwzAOi/zc7W2hymDOqtDKojfSVDtkynAdvXPQJrUf5BNTQFoKdpQe8SAMV8HU2+2ni+F7QLV5DB2ZvUC9teIjh18/Pz0ZoFJJlkhP/m1Jx4ow878Le7UgxkHIbcQ9qFpA1XCkURlhzuSXGtVMJRyIpomRkswFqkhWjFvM8tqhUcrp0I+wcMPRyNLWM5+/q4jx/Aa5DWB6iCJsartBGYIaWnG3n4pyW2qsrLKZgNpFHBSxxUcWZdd5HkpAq3OhgqS2kClMfsijDakF1uvZqQPt1hdZTXW6VJwcjIJTDJJl7//52e21kAP13G6HdhRO6dUZxj/xUxt6COzkIVM2Xhjp6AUXr4noKDMkXXvevekJB7pIK4AHfFhWPXkNl6E8gHPN0YhtDMSynV+/jwdOXv3kde0nehrBtVBArAeFhZJC16wzSpxy4JkeAbSPgCupiObAYa/xVhuT5dANbBfMsWe43Frem00BeylsjxSQF6hHeszxLXWWjz6Vz//J49gkkluUxlU/R9slJ06UB5UUNSxG0e9K9cxnjy+28kD6AMYgiIIozuNGFGFz6xTqJGMf7PhChADlEjp2Jsvx00zBkUg7/dQAXWd2q5TeI1yRaA6SALWnM+S/VQZbTofIgkUzPQYO1M0M4HPJIqZCpCQhQLskQHREeXpA2D6rY/ZLlFYUGAmiXZun0vZ/X8f+y+PYZJJbiP5ya+deYDnvFsZ36aPGyUso1hRcQ7ZT7Vh6jUEN9OlAHwOWqkxRfOLk/nFtRgf17pQYPgZPfjGcPV3oFMI+TgcGIM+zy+svWaG6nm+DlFgrV9nqzz+BqYpnKIH+sMUcF0vVvy8XOvtQ8rUzV4q5XB4e4CS5rRpSz9YNNP4MKwJxGagjNkWsMlSVwpAPtT3CaKNhw4+9pV9TDLJLSw/9WePb1fluXn1+9CyMRNIkB9O7BDI6VneHq3s1d8t5Qo/AljrAU4sdhTMr54lihH/TPZ6E2LY6E4UK9VUgEgiC/gZfv7KATXnfYWyYmerFZ7+l6kAlVQdA7jBqaQBwGrBRp6hWusXEkCV3WaD3QTJFOAMVb8nMJdHao8gMWMp3hyLw1RaThesnZzAdZJbTRqYMnYwrNdXGqfjTTZ+jquf0tZ5mg4BWG0kRsjMwBv5b3cqyUrMyITziFa3Sx//utFJtJumuHirXwTUANIt//N44fUBaizrdUkE1uTt72Jhuv3PyIGlIFdgDDOp+e1Af5DBjqrTXLCtllDeAMklGNFlDurGneCrHDe1A6+Cp5ZnNtkwa/Ytbag6syZwneTmlwamwE79d29wKsG1x7CfRj8XYkXtL5NxRyVFSyMq5iLjPzDMESypRU6ZlQFtsIdGJxMaGrgTLSC+bx9IlEKqapqrAqjxvl63aLhVzXHmmfcbM+4/cmCZ/VTtpoZqUdVA+O2xqAqxNu+pTTQsDFD/U8+C2Ju3iO+LAuQXf/DuQCPd0NZ8WQGke7ZqOiiP1V8TuE5y08kHnv3NbVqjnTpCtsM4lK2S4pjUWFBjH3BnEynbs5FblGCaeW5k40xhVW4iADKwRkaLFc4oR/UQogUE5xgQTAQwaqSslekxeqE8dDUA1apytaQB69q82VixymFlLN7srIamoOgYgjud5Mr+MRyzLWahDJP9Wme0Mn8llqlRAtDZL+SfnGEwNqyMNM3O/bHFztZz7l9OT+A6yc0gA5iurWFn0V5Pn2ymDlc2HopvELdivFAct9G5NBrFUfvrgKZpuuJpgDuk00UAoVbq2FLY97wk/Ery7G9XleGudl+zzw5xlrrIgE4/8a6fvR9XUa4qqA6iwForOzM1PziqRhKsL3rDemAw31BfnRqdVv0BdPtpUftNYpeIZgKoQR3GNGX+7R1j2PiazIYLm/ZGYA0D+/a8zL7Kdq4VVygA9+l6aALXSW44+akKpovCv1776BGA7PXImZkCS0AbxiGjB9NLPJR8J6OanfqYw5qzOUGzdPYo6TTwXhRJ2Sd5xFqLIbq8SlqvVfQAHJwtwN+nCc2n/tn9wl0fOomrLFcdVJuc2dxcv7g+AOuWRgAs21KtBgabSyo84kSlDz2y1g6knSVKPmkfVZhJgdKsSxy2ZkAAXKj6oyAdwFyOufoT0gh5he0DC+tc5bE7+I6T3/jY3j4mmeQNlA88+2+2a7/cqf313k7rinvPWbdqqkdK8VAmBC2tiY6l/l3Hmb+ixAgSI210Ms5F/i6HOkmdSguVagf0egfdPv4V3ztjTosHjNFa3CkCotYyF/j0F979oV1cA7k2oCqy/vg7H67Vf3BFqWl1VVx7nxhhcgyZv499O0B0EGyXFDWwdlsJ6xKOBrIxb0jXAZObCzRsS1V5rShSeZKFdQNTR7QusE4HZBss0V7N5fR3PvIfH8Mkk1wn2X721ObzWDtRR8Lx2j23sORaMnKAHpQPiuRDqQbHDUj6ILNgf+SVUjbKEMKbkLINnnka2UH7QQdD1dtBivocUd7DpgCfCEYjXf02IjXZQ//uPR+6Zot5rimoDnLHZ961W+/o1+WnAamaiWNMqzbX0KKlrdM3cDITAGU7aFMPSn/ZH8KsGm2c0shFL3WTgKjw5tkcLzDQDmdc1MEz2pBC/Smd9zRB6Sn7RIvdjcXGUxN7neRaSQfT8sACeKACyp2d2RV329j4UUdxGWtgQFfng1msOBclIwuyoqlEKiGOaU5ga7bNAKo20iJXxXid/kh9F9qjmioF+JTKst2jmBhLnywOiBf3f/HdHzmLayjXHFQHqYx18CzuLoGpfAx/7NXUQd3oDd3eZwVlklBaT/rIMwiOQazZZZQZU97AhUY2Ue8vRR9YAEgggypg+Q31CnZWZbZuUhCThsCz/q7fThOtPfbtD+3tYZJJroJ84NlTLca0dsV7KfgbBgmbDknq4inMTFd8jCGDbReDXuRxateAbE1PcFpBRmwgmkRLe5nGLUSMQvGIlkCjDcA0trcirdTSY4M5Y/FcTX3sd9/14Wu+SdJ1AdVB1j73jqNlQafq7b4dq5xWNhs5qJrt0wCL3IIp5oCFMc7EHrs6IewxePyR7D6jDVTYzA79IMjKVTtrAM5gqtDy2mdYzKB233BvaZb3sp+rMH5ybY69ib1O8lplYKV/VRlpRZ9hC763O4yatgQgcD0FqwqqQlklp5gGzbaaQdjYqdgvS0htSpo5sUJOcewZsKZz0DESPf4UbL5sCFuUISsrRowyCOYEIl0UcH6+WBz70ns/to/rINcNVAexZa2E2Xj5aq8NmZe+e/gMKEN1Kc6MCLMg1Byg9tXu1oexSX9LiyoPCRRHqr6y2ZLKlj0G5KGFZaxaTmLOykiFKcRO66aLdH09cBpzPPGdj+xdUxVlkptbtiqQYvHSidph7qs/t8mAhhBBMPQ3iTki8xzAwwYR2KPQAzMBSHbBdBDsqp0tdm2wj1lkuyoCgxyKWogip/ZR22yJbfz7oIrQizEIK01JNKmZDoevtlcAnb7j+y88dPbuY1clBvXVyHUF1UFayNX6/BRabBwUWOPcEuY4U7NhsaUycyr4Gtss3fPOurFKm0hVHSk0ZqpmNjDn18iUMPJJUuys9vADW1UPJHkkgXdMyUFZc2SuEci1o1ED4v36Y6/2jWoe+PIeJpmkygf+9F9vXyqLf1L7x1Esqq0UbveXcWEW0BUroORD+7kTEo7LQduhorFKyM4rY69my3KQ0/FicByQdWRE83HIfsxssKAQt+NZUNhoGkK+NKsS9xPoL1AmOvmld39kF9dZrjuoqtzxeHVgoTqw0kYrMYwqd4A+ExaKIIikUpCtpFL2GVWOnmPRTKFlUOpwVibnyS+lJwTALH3PVssj5mdMODiwkNh3AOn49gEsAe+zNZcnhpUf3/rwH0wbZ99msvWn/2q79rT7ag85UfvBZmKjtoRbO5vHimIMZe5T0Gul72nHl7yC/QsRpBVAffywFx1Do5Rt+i+pTU6jTFVqirRaCmbqU5OCXstGeUgTeTxq85nRd3m++LWq7p/GGyBvGKgOsvH4Ox+szfAwek1s/y732kf12x1QxjrbdRTe1VL6EXiTQwzm8M1XyO2qht+sBvpeBwp1ACnoIav2ccaXfiVgHKIF1HI/TAgcZ183MUA7OodVXGqysO5s+0tUBktljxcDg/3SHia55aSp9pee36rGoeO1W95HC7rTQQc+TJSnNTAUTAlhUUkxbt3SJ/2k3iOr+4gOLenLHExzUaMTcqPlw0gSeQQANHVgw5GmaPocyC+mhajBhSWw5BqhKYMN7xnP1XyOXC/76Sp5Q0F1kLhnALlNNAFftKFGNupsVWHJAa4/FGe9DnKs4AdEALOQYel4g3NsYchsQNj1j+JACKuHRSSAxktgAwOFdn+xtwIY2Y5ZlSrkAWAmCt+Qp+zX43t1Zn7iLXjT3v6Rs9fNbjTJ1ZWtZx/eXLy4dqI+y8FGulWf9Sbnvu+sEKMJvR9xJhhNSqHP9aB+ILpLR9fbd6IMe040xAk1zjvUScBV6yM8gox9GrFgQcm85LUDr9fTa6iM1ZbB6jW6fpbOvvn737//etpPV8kbDqqDDMB6ae3S8IqG+yJz006jE54uD1VQ6v1HZ6rMEM12aRH+iQXCJ0wvI3bSMBsb2DoAk3eMFcDXD2hkgapXiZ3SKqCFzcrLkwl0MtG8ZX6wdG0c0VMVps+uA0/9xZHfncwEN7AMIIoL2JrXPl+f3nZ9gFvOKrurBbF/woGtp9EZuDj7q6Ap72UK7JGMFjQcC+kjE0XS3DQcqv7pQBwsArS0cbwDKwlh4UhFLE8HS9ioQtp+j4IpwyqZ82DbekNVfYnOxK/93ns+ekO8neOGAFWVYaFArdGOz6yqHhf3ucdHpbMlsbC+2CksgTNaaLwoRjMxRTutxdK2LtDUKAdSmCFcbaCyZxm7vdauDYxabcLucOvHIHXxMjKQDtcswmtl7JxOHHEikfsXuvLd+vepeu3ZO8DPTCD7xsvf/Z//crtw2aoq+n31gW/V57M5HHctiNyD7ii24jlj1E/acfZOasAcJuxi1qw80YcJPcIYRWhwlmqq24h8JHNZP8Oj3izpEADVSltipcZ0jc5wTut57C8Y93/5vR/bww0iNxSoDrLx2buq6lPO1JrNvHok3n0KWndgtAJSzti8+X2mE7YHdWgV0g6lgNrDMRwcl1ZSITNgCKha5UXtp8hIEdit5Bs6ZABtqy57FITmo8wDkPKM7UJnaxiwkrVZKo8O6oDdWxTeo0V55htHzu5hkmsmW8/ubl668NYKnLgXnYneU5/Nne2kgCB6pwyrliJgUo5UCfbROKnqb+1p/TIyR46vfCcLe7I8KIEoe94K5rYHAMKbUBFBNpTeQbAPRi4yflK8qt03Z9gWe61vNF2ywwrCgMfvtaqk4a0/+MGxN1rdH8sNB6qDtHjWjcVOtWmeAGn3IHlL4zADa5O7nXERbJsGohbC1GNX+0IC0ogPaMei8L1/W93JENV/ZaMN02SWlnmVyRVz2EY+Bm6kZfRRVQL+kXJSHzDttgUsQ/ltApBVaP1SWt7kOytbCINXj+/Vv+dpsfYU3VH2/+IfPD6x2SuQWQXQt37/LTOixb21i1Y1fgDRclgQ0/cLJrIV8xxsgix2dOt5et57BiKI5vPaV8nO2DZ9SP0OSOp1zqN3khGAa2yr+CcMGA08R9E6YxW/Hzc7r+1aZaQCiJOJs1i5OGmnsSVawQ99+T0/d0O+jPOGBFWVNz3+7gcXVHbq09ukkSIRWWIAJxZVSdqdevSAq+LoD8hAR/JS+1CxzmX5q91B2XBPL5cREB93YAWSwAA72k0pNTvBGerwrUCxLw4kraczbWHt7McRGLfcpzHcnpZcq1QVs780ERLve1AzOF9rMIDrc0Tr59d/6ML5/fdPDjCV9z39L2b0pktba/NyeEEKoDTT5zy2iWc7e3ae9o/isOLPJkzsYaIMefdjafUeuxpnK5EQ+2fRfliK5zVmyCx1kgmgjyfO5WqfVSDVSIHk3Q9Dk1LoFK+4U8AiXnglOIf735+XxbG9d338hiUANzSoDjKwVt6gc/XrDAgAATLg7E+EzQElYCI5CIglG2ch12UcMBWUFWCH/DlusiJzejTMy6OX/kje4bSzhoD/HlbFWPVaip5lYNkU7iWkzYMvMlqJ2FK2aiaBcK3vGavMhmicD0wT5RDXW0G1Ai3xeeK1/VrSc4s1qsz2396SzLYzT8zm8/lWvd/N2hD31Pap32lWv28u2ThJVeG4Fl0m0OZdhdsw26kwsRZZqeTeb1iA/ZCqkG2dKX1CJtYUMAV/xmb7pPwb3o9KsQ2k4SarsNoQdl9u2yRZVoMQ+ic21qYIFo76meTBoqt53xYVv1i9OI8qmRdIi4ogzfzo/MWXdvduMHV/LDc8qKocevyv71anyw6ljmW2FcAA0gFPOykr8HFmDMk5BWg4VAZOe3eWHC9ieVATes8PgbXyuGOyKTU6MMIMbk64FYAsvw2IaWyf1eiGwIrChNOr5htnx+u0vSjcb7+rALwKGhwnKYQBPkipDjE8U38eDCyietWe47K2Xyt6wGs42NjA/v77T98wg+B9T/+zmXytn2XGpby99qtZ9ZtXwCyzyuYOY7B92sTln0nT0PbWmNDw3PqHbzkZtJSssqtZQHJdJgJ6affYK6iFtlfAs/jQvBig/ybNw/a2HJfZu4ssuzbw1hSjOgX2He47bRgvV7TjhdXAEVgti5GspyMPT++2hvHeAbRfMK/OqE/s4SaQmwZUBzl0prLW+cBay2z4HR+y/KbEAjSgv53UDgMkNhEGikYRYAyCCl6ioltHBiGElaTogU6GHcSlEAXcrJ7L9C8J2CcJ7XDBfkWhboCBsIKumEIMVY2la3SEsVR4eYnBh7bESP2MiwfJEnpUQ2xXY/DCdhn7Ve08qJ8HPb+yXy87wBzfaxPXfPE9rK8b+K7Vg/Oafl3SR6lPaTakGP6v17fPWtjhsiiyDJ1mi94OlVW2FUgzafbDEFZm7d/bibWePpFpim57dCdJ7jukQ9/y9AZIfZEcdIxf2itKEsg5kBr6ZVCH/wqgmCcAA7xxf1+etNVuGoFc742QlPUwMQhgIrQCwmThfIYo1aqV7yo+2Y5zdkNM3umYFvPfWLx46YZnp1FuKlBVGVhrbfAdTnYkhSXSZ67zpk+NMWwp/W7Z8ngZqzHWsBWgzt2cHGOxUyVA1vf6cN7oOnd8XfAQQNXTaj1U1bIz8oaBEBGh9273MLpHB9HiHZgEMbT8nnkwjYycc7FeRPF+VtgLQ8SClKd18zujAECiVbACH7xcbUM34+SgnTE4WPmE+JCz40bYuHIyKy5NiFrv3oLN0am//Rn2r2FPUpiPO+3olCd9L9PrHGysVn5Ia/cARJA0U4TXefQ7lmfOU4oA60614WxBsufDQTebCfy+Qz9V5IytajXQ8vW1KAWh25jRalg5uLh/7yZhp1EKbkK58Mmv7WJtfnd9As91s6d0qjazD7/zG8MawNoggXIw/y0jqQ8yyGH70jpAH0e8XBnPh9NvaM30ZP/V9lRlH/piLxNmKVOB7uCll9p3Sav3wpaJ3AlSHSm1ggBfHzl9a9dGQ5ZeKd4HDKd7lGzZb1qGTQfuPHC0zjLQKORCdhtaRctatitfwOcvTUQ6iDm27zAa9UZgOm2/SU6X+n2FO9C21oaxnONbKSwXhan2zrTebn3q1FpBcom5azP0GFFvBW8QOd5UJGZVSCSHzpDjNWx9RsGx91yKeUqLsOYi3yhUoNVf7UUca8HQC2Qk+QBrv7jXkmLdh5qzPr/wCpT+JLgRGg71a0035MGai5XTky34Ubz40vtvRkAdhHCTy5s//8MPLlB26o1sIjicfB5WtQ4yE5NP0JEx6NtXxowFo9CRyL702na4dPNBjjFNeftsDyjkwE0OgKjbvcJuQ9Xy9ZPGTFc4AZujLTFnvQ9gvLxX6w0N2iqOOt6WWLofANlGS0uruyDlRUeatpvtJAZjWr1ecQGFoBXckaKBGJzfYRbbYvQ82jdtX7L2DPVG0kBsakhsV54LCNEmas+c3OkDipM0AntmbUVEVb8/Z9t5TUvulxZVv5wFhjz9Wch1sgQV1vHJbKkAp3ay/qD1CFpB75p5k5Zo+nE2CnsmkHjWbioptkm0tK1MQj7eKDDiCED1wH49dVOy0yg3PagOcujMbFant536BI83U48CkA98927Ki/m8d6vdUAadOnBNjTF7qYLhyLYGaOc2QFkF3KqOi2OqkFNRrwN8kHtHRkAmJDCy4imChaj0BiLCJ0aAygFY4oBGNnNImX3EqOqd6m1AAa+DA++oDWTS6KynZzmyx4otWp8Nh1A3uWeWSvt6cf3evYoIZolQL59Uxe5qk4+AUOfnCuZYMTlScjS1fiH7/rICZv9Rsg12BMZ6PYV8gRHQOloGRLR2EIoY4kxplDdre4XnjNCHRpNkAE9/7rGNNT9yB5uDtj37PonY85Dx5YE2ffIOLwSUDnJQUz3673/4E7u4BYRwC8mhz//oifqQd+rXGY06cPum4CVDe+QUYukp1gP6TCwQSAEolEHRsHWvO3egE3mzqohG33Jyj3pikhQAy4ZVP9V/FkT2BU73gjRIEZia2x2VEZpNOQyczES9nQSU4Yz81dhV1bJXiI2+jScgBfPe5HljHIR6ab5MKUKDQqyxp/VntwTmI4eUsdf0/Av5fUgbl2h3BqdVcxF0LgOYkc2FcpOZxZaRBpv8KtaIEIvq59OMutwXRhMOCQAL2FJ6HjIRxAlQ+56eC/n6cw/HXIug3C/0mLgNKF1r97O3RmuVnb5xu0pdbSHcgnLo8z+2Wx/WDiE+5M5iQMmx5CFIgYUFldjANYIer1AjbRAEgOORStvyKKZ6AcqGoEDg4B/jY3OnzWVA1XTLw4Fb6orIuEwlawPM6AYi89L83Zxg9x70OSJXUaNZwtpEDQkGzGJJttnGf/Xi2AAwsTjLhZSpaugbUXpO+ux6W3MEIANmf2B6NwaYwTnnbeXJKe4J4c9AK2+waMCXoNLM30uTQ6tzcv5QYK6Rjdok3JIOm6dw6CMIbe/qe39lCkUkDc9H2CXZDRgwcnDykbYBUhpGbAtjr0QwQEX/LAGcZb6t5/Z5Tvf/hx+9uVX9VXJTOqpeSS780v/drQ/v7vo8HwOp2X4hqke3rGuHgTqGFiAzozMHADPPEuyk+AtyqZ3TimlevhKxuQ00D1Z/A6ltnhGdC+iG/OL5t9EjNdEah7RNAtMQdGYdA2pajGkNYcjLkEEIcUeIoVDXVPigsCHcai/tawxejRqsw01GGCtisVdI2kqvkucBcWFY63vLS9t14ld/LxDZH0SxqMe1zQHYdvCM4JiCbdHj2M/w2pF+V9yw5s6Pnc3EYPgirIy1b1mXY1gEB/vlrRuQuKq0LE3E1itVnxaXqSgUafLySvWy+xyudfCWhN0htMdC+4vdn9yDtS773wVrl/R7JEN+ORlHCHN0SH6v/jm59uL8/bcioA5CuMWl2lu3a786Vf/NVL3pQkjMM7IHVQs5gNVYDRv+hTeoGpMQhhlZso0GBFtntLsKM1ZbrA88S2BMqZMIfQeXMupihKnlUdzMkeJlQRipxqR16ac1uCWw8Z7YTALhGAhef6GD0mJkdUEwQQTYhNhSOajdEipKWKp3v2cKbN3qPrZxJ3MEqSE4qt6hbXt7cHxIHgAf0zg7BkVNAzQ2fyCYAyxEqfUV/540DnmuLeDdH47NMTCnDo36LhDNQbE/S810NiSF/MhC3VE0/PGNU5QdhwaBLxxYMkX0eV5XhdmdkWtNKXU5vfHSxYduppjTK5FbHlRVKrieqF1pp3buw8FehnGH006QOqvQBBkdDl4BhIOdlFcBiAMvwgolA1tA+GNcZ92zLyEfGThMQZuSuvswYCQAUaIpYOxX2f0ZMLiNcjTZGNADS9ep5ufAI3l3qtuhwq9bmpyAoIoG0GyDMJap7mW3hYd8cxywtCrZPcEG/MgpKOWHfLwdbGIMANtvIQTtZ5tjUNU1f3+WrPGcRMaHrb/FukWPv6rhox2ifMIPTi4HN1saCjESx/pkcjHczxrbI/Hc4OMgOtK83duEZDfj/RHmsDMH3h7P5ye/8qPH9nAbCOE2k7ec+Ru79Xkfr19n/opd7RDFO1wazLJmH8G5kVgSYCRUPdfekUcgh94ZLYymD1oFVgRGG1mZqde0wrkyWunkdYYDhAxOL1eUTHYnnF6fBnyuo7PVMMAcPKw85ImFdIS3330Flphg5C0KaaBfLhpC7JGcw9CcgYltwAY9lu+LDChyHqAIqvmZCYaxsusSDMGw5gxtMAIYuMNNAXGJeXJwGMU8EsDphtGOfVJ3jxBg8xNIb3QUtPuM/d3F71tTsy1xldBC5tB+qe3ZeS15XkRP4TYCU5XbDlQHOXTmfbNCF3fqIDnB7sQIKbSDwcEBPsBL3ADYWI6zOVNrY3jWiMm6Ct4AeGlwRyDDKucGCAF4pTrmnHJ1t6vRsFgXCnvGBmCUegCZ9XYGirCEsyCFVSHVQc0EGjS2Io2pmAlEW/1t1zG7b5m4rF0S8Hk7pefg7Ujxe6fd3p7tD4n9vORnTO6IMyBpJ0fRGFgCFwFRq5R73I3xEfxRSOMnFR/mzEoRBJdpA07ryjyNYLd0M2IztFBuI3trarCZe318hVjor6R9z9tLorOVnRI9Vx/l7lfee99juA3ltgRVlQ6u8wqudKIdUFaV7Xf9VFBR5UC200FBqX0dq7OhM2sZCrpjoHCQSButoINCtCEqiEfbWrKZmk0zA3dibVI3L0MYlSMdp7qMTCdWB+S6x7y01DCBsZXL3k6s7R9sj2xt3cdsMdtuceAKkRLjZ2MTHJw9a7gXJPwragTWKsrapF3NtVli3GguU1synltisbYBs4OwgazayZWMh2t6s3r8qj2Thn1mBkDqkzaBtYkjxJfKM3A7adA+3EtqgAlvX4+x1rpbBxzq+d3qxvr0f/qRX7oh9zm9XnJbg6rKAK5rtNiprXFcOvuI8ZHN0t5kxgJgk7mwSUGyxIr6JZRjQ8Nvhzgdb2SbuPggiGwjAVh0bMjQiMBj+VqIl9jDAps2+6mwOMTyNCierN4IwDcyS0hamPqLCOpal1WT0ygPBzgogKt2wHDr3xJLRZjMwsQBNa0EWzHEVILxPShYGbeUvJqqUmKIkD+LBrpuZlHbZ2SHVJIZRrCruA1SibFu/yfb9DGNwdz60LgveFlhMtRnAqkjjeNPlRWLa0lfEjicK/AQAwV2Dtby+n1wPD3ylkvl0VvdCfVqZALVIA1cgV0UPr5KFQZix6UIRHpWWzSBA8X0CbBGg4FWsyXJWh1BHjsqTKoBaDIPNALSFVeLQkyvfYGClOBEfH8W7CZgK4ZAhRLT0UnDQFWBbOTsgt1HA1ZNyNpeBnJhMvM6BpOG1k0nhlDO8sQlN2YRBBHraVSvMFHpsw4Tmt0/kCZZASOzOSqIqjecQmfoZekqK99YxY00AfQiiAaTgKXR79IeIejeJ3keg60/H7eX64TnU0bcYlCul96dN+LTe6+ZHdQn8RuHLq0/MoGpywSqK6QzV+xUIDmByJBSx+6/ecRuYJ5jWMeUtA4monoKWnlewb7bBjESe+U4UOJ2e8mG6gPGa6kqrH3vThpWzRCjvVrJ84lgBk6ADwOXniaw5Q6gbM4wvacMCpE9jhlXsku3Y3ljbzPHKE4IQPt53+rRjrWbHNUj3KvWKZ/3a+M5DiYJfdoRJPs9EPtDiWo2EqCzrnaCNngAZdK+keuh0tvFp87xxKjPSmJkwwRg92eGHZ8NHaRj/wnttI+1td3//CO//BgmWZIJVF9GBnBdLzgxRAvUzjtDZKZuq4QNbrZRkBkNFJii1z+BmDGyfoLCEk9AbX8wD3zYJKTnnjp+Ll+OBWAmjx8VJ8YwNmV1FCy6QS7NTrKs0q5iTJIOJBt6KzAa4EgreQSAgJXfv5Yb70HrIW/Y1VKs3XTi0JYknQh1OWhcLQZgDKKBGcMnDmXlyHbX0jGOtTmGVMvquT+XDpoyCZKnCKCW+oY7qOCv+DHDkRw3Vmn3KyzZnoXGv3ZQD+Ff9vzUIQjRzEK8qnr/Cb5obQiN4pN/fPev7mGSy8oEqq9S3vaFnzhRe9cOQ8AVFGgSJTZn4OLquw9OA72gbo/UTsRhZ+pcUHd9sMLG2chhw8ugbVfG8lOdlUcpYMrgDOzH2CGFuljZPfIMxoigw3MMYFofb8JiG2QnYE4gFUPg2BwuwraXmGkA3hIAK9pOjeUWe0bGkp1RGjDDTTABGgPYukfff7Nq8fp81TdHvjBA2zdPujC7avtZWsnu7Q9tYDKaXGPeoV1h05dNJjpBLYd2NbCmvVqvCUxfpUyg+hplANfa8Y5X/rCtgKogYYOyMQaKAGEwLJe4kwgKtME+N2JUSw4IyVK/cxqYQU0PdlDNicfqtrJvuxdhmQ6c6j2nPGkYOzUCRsgDugMUJ+97MmmE+7D626ST8nIgD1ENyxOQmQhkHii2XSACYELZujyLDrC9rmpWQZj8fJAUr1J8ZpAJx6ikO/a0XsODKEsbq6Q2kOcvjLKMQTduwKI1KHDHnYY12cwIA2BKDqugU+RnoH+l2IN60aPrWD/9lbt/dR+TvGqZQPUKZfPM1my+Md+pvfxEZgdpcCOAxHggsbHMwHo7K5KwFgMxpLApwTBE8Ep524AfM70MYAlglVeON5NRgM0mg+TAc/Dye3NTSGdyccJBd7aRl+mMXtvC70PSpygJOT5uEznuTrQc3J7uw4CVEpiztajkPWa/Bu6j7f1WtbM7ggTZO9UMNuMOwGNgtggAsgnPQpukHlGt51E9Yvnqqk92WmCZ0ZL2PTpfJ+PTb1285bHJ+XRlMoHq65TNJ7dmWGB7wbxTm3MGUxGFvSojHds5xx7rBCbBqUTuGQcQfAkhJAqGiw6GfgDREWUmiCYhmJ2QGLKxOgSn2Ch209JCfSRNVXYgXzITLNuaEzM2h1aoExvDBMIE4upvv7gVy3nisNsVdqrbNFo7CHNLTB3a1LksBMCWfU31Qcgkoohv2oMxT29UXWOvr4BWnMsTYPdV6eop7x9al9QeWhPSUK1XAfQWxWFgPpzfA+ZVxb9/D5O8LplA9SrKD31xa7uO7RO1ix73QVvCYAcQ7HJABpmOkQIkgbG2hLCBobjIvlx1tLGKjWFa2pPA7bo26JbBXc8FRZMCKCoAhjrJ5cEjzyP7ZLCjyg9zWOm17sgRoIWDSC+czRZqoVJxUgimCWsHWmlbNsaH2K4NDQuBwoqwdk0JbagNZaFtpDX2gHgQUphV0Cxi1IC3u4C7OpZGk5/VT0BzRYjTmHlGrUEZMuLzGkK3FvxMLeeJRcEj5+++f2KlV0kmUL0GouyVee2B2v/vSapwthdSYEGZhY7thcNAKuC4GTCNmOUyO4kxkYDbOH1jFR+6PhgZYzaHtFzUAI/8Oq33GBjNW68slOFhaJ3SOWiG+xgzZa3u2CZpLLdlnmNoU71TPdq1OZ8AQjbjJC1hBNDtfDEXYg+Wj8xTEV+KK8H7bi/3k/YzbC22E5mUKU2ik2lrMFIALzQCXWBUftHH4fVptlJ6rCzo7B//7YmVXguZQPUaSwfYtZ3aq7dpeM88AgMJ78WKDFJVd9jvxlqzAyuojMERYTvBOkPq6TnYNWMe8gXxHCtDTkPfBn+yf2JkxohAZWDVQAf+Opt+ujmFFl15R3jjKrJTL04UkntSYclts1ZHw2uvA7kDT8uX1xSIcypMLiOtIkxi2pZWfw7tX7Rt0wQHv5bgDqXYTqGNOUYFyNQUtRQ/ESYzhLAutyqwzx7NxPEUL+gxbJSzEyu9tjKB6nWUzS9+YBvrdLx29+3a4w9ntRu2rp4iW8oMyeCDw3Ed1G0Ilqx6K2DGfNT+qauF5Mr22VhfK2G0/wHlxQoINtAOmpSX1UI5nPJZBQEDRogd0gCRFQjYquxvTvD7Sm1D1n6XB3ZLaaDHcUKATiQlvCBQJw5hwPD8gOiINBsBw0Atl03wyQvK9t00YO3qbJT8xjLQEjmAIrQduaff69WO7dUvT6Csn56A9PrJBKpvkGw++VPbdXgcr49guz6EGRxUiAIYOFZQtHFGtdDYDMZ2UxjDQQZnIDCkdI0Mxna8X14C4Kn2XiiBsIKoAVIHHnJqm2yxClq0VK/IKOHLTEds1dIHu3I8704ZKbffnIV2Gfsk6GtrdHNv2yo8gTGs3f2YBt/DJ0H7HuM8Q52SloLAxgVoe34eDmYTWUjTLxztPZDKrEBacBblTY9NQPrGyASqN4AMAFuH0Ik6mu+tj+QwoGQls0sBGDcDKLgMR0pfBglDAGU5yw4sU5UDCGqepF990CcHE8bscwTMGejCxNAH/hCrOQb1UUC+lCkB/dnOipXs1qeDEXC16vp7aTLYdtVf36JgmCh5xmXA43az4xJLumQLjgx/FYhSSWYXawEF6lXM1F41PVq51SfSp7DGFUjfMgHpDSATqN5gsvnkT2/XsXpfHUHbdbBsCZ6NAvT1022yri4rs2vDk3VjZYi2uRx50FmlXKxgwgFEDRAtDwXgBCDOMt2GKRlovCbpikfSgtP2hOF1Lj6pYMyGI6Al9mvtFMBdklNyXEXmS6HecofRvu2Or8BekVarkTPKCMy9XcMkh5GaTgb6+lgzAHv4FY3yqHIAWjtLmD+FjbdNNtIbTCZQvYGlMtjZGja2F4Xvq4Nsuw7ZzaQKj1ihssw+kntIFiRqYPWqKW42y2R2oOyIosgokWx5BhgpzVL8rQFCBiIEFhjYclS3HZycnVOcVLQMUeHZ60ihnqGtArCCltlkZPAIk8UoDbJ3X0KoSrKbRsejt4XUXiYTsyHb9BXbZfhSDKTr/+fr770ypyfO//g/3cMkN6xMoHoTyTsri2UqR1HKPfXndmamgwhQyFBUFhfDpBzERPUkU+/lrKzBX3T1W7IFkMAJAS1c9YV73DXfIh52C6lyoLH6yI78cmUJ+DJi3xJFAH8FDI8AupfBKa5X8+11aj/9TQYcUlj0AyG+qQE0Cr63SAEJ4oe9PJT8/VWWp96HAjAFG40BKnQTHV0pVdt+f07YKws8tXYIlY0+NLHRm0QmUL1JZfPM9uba26qJYI57K0ZsV6DY0gHsoOCMKzpRus1wjXxLojETjYM9A3c8b6xP08S9BtRxouFPUHCCMc4Ur9rNBUgvSeyVxyqWDYp5kAF3KcXexbzENIN6Pmavwu7llvv9clsK4O8na/bZzKARgTNNXNrePa9uK9XSQ5tonWo5+/Vzr6Z85iV66exXf/yf72OSm1ImUL1FZHZue/P5S+tbddzfWwfsdh2s99ThemdimG4vFGJFCCuTcuTACLT6henNruQgjABYRRMoABvLg3vge5lLDh3KQFi6XTTUuQMd0ibVUu/AChFV+85S3c5qEwTHV8MowIt9gImSs81/ewSGfCgD1QqsCtg3lIU5FZnOV7B+ao3K+Ysvzfe++v4JRG8VmUD1Fpa7fv9DW1jDVkWnAWgrk62OLwxj23ZvgmMVUXzRXd/QhbN5oflNZEnsyKwgjpmeTh1WYZmsAXQH6xigHllotMciMz6YLdKPBRMEItj1SYHNLaYrDwz+hEHCvf8RjAmXWTKb6tXrGl5XrWFOHNloT79f/+6Vsnb+0pyfufBDL57fv3t3UudvUZlA9TaTd/7BR7fXCg2M9vAAtBUl76kocCeE83V22A2yHZt67KYwV8GVMnopIQLYsKQdMz1Xi+Fe+CXnUWaTnp5We+2hanchrbMBsV8PB2W3vWaPvwJ2UOWdsQvDhP222Fv18ktthhff8XMVys/X3J6plTp/4dL8/P77JwC9nWQC1Ukqo/25rbWNslnRcKt2iHtqr5hxtdFWqNiEAQrg9kxE7/UyczSASqYBY34SoqQgHe2ZSHZYyVNsFc4UyVR3i+HFiDl3IKSR9p2A1j4Fj3m8FWBbwkq6mXfaV6CCJD1X052vgHq+JnuO5zj/1ffv7mOS214mUJ3ksjI7d3TzAlDBFZtVzd2qKHO4osysfs4q7sxs02Zke6bo2bx6G0BS9gsHML0WjsvKCsVs0BX2UX7KXqPDTB1DEfTNMQQktiq/ATdRyNeDBpw02D3poFo8ztMC31sDzr+AO/Yn5jnJy8kEqpNcsXTQXd/aWCubC9CsItnbq+NlVoFosxK6zYprswpOb6/d7E5VlXW3KFrekpDJADWBJ0as0tV0Cuq9g7FeJHZiA+t9SVkBsezX4wdc+ACL8lzF6gO+xPvr65f2L2DzYALNSV6PTKA6yXWR2dMnNnHhwmYFsc1L9d9wjMr6TM/TYONdoDt+7CDdWT39b+8/yvcqvT1ooLzg51A9cE3aR2kf83nZxzqwwYuDtY07GjBWpl1B8pEJJCe5bvL/AYGeyU5sBUqhAAAAAElFTkSuQmCC" alt="easy-ai-chat-logo" className="h-[6px]"></img>
              </div>
              <div className="font-bold tracking-tight">Easy AI Chat</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}