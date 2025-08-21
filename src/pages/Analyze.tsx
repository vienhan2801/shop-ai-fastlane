import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAppStore, demoProducts, Product } from '@/lib/store';
import Papa from 'papaparse';

interface AnalysisStep {
  id: string;
  title: string;
  completed: boolean;
  timestamp?: string;
}

const initialSteps: AnalysisStep[] = [
  { id: '1', title: 'Kiểm tra cấu trúc file & cột bắt buộc', completed: false },
  { id: '2', title: 'Phân tích danh mục – mapping category', completed: false },
  { id: '3', title: 'Chuẩn hoá giá & số lượng tồn kho', completed: false },
  { id: '4', title: 'Tối ưu tiêu đề & mô tả ngắn (brand tone)', completed: false },
  { id: '5', title: 'Kiểm tra & tối ưu ảnh sản phẩm (tỷ lệ, kích thước)', completed: false },
  { id: '6', title: 'Gợi ý badge (Chính hãng / Best seller / Freeship)', completed: false },
  { id: '7', title: 'Tạo gợi ý sản phẩm liên quan (related)', completed: false },
  { id: '8', title: 'Dựng Mini Shop UI (chat trái, sản phẩm phải)', completed: false },
];

export default function Analyze() {
  const navigate = useNavigate();
  const { survey, uploadedFile, setProducts } = useAppStore();
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [steps, setSteps] = useState<AnalysisStep[]>(initialSteps);
  const [logs, setLogs] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [stats, setStats] = useState({ validProducts: 0, skipped: 0 });

  useEffect(() => {
    // If no survey data, load demo and continue
    if (!survey) {
      setProducts(demoProducts);
    }
  }, [survey, setProducts]);

  useEffect(() => {
    if (currentStepIndex < steps.length) {
      const timer = setTimeout(() => {
        processStep(currentStepIndex);
      }, currentStepIndex === 0 ? 100 : 1200);

      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, steps.length]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString('vi-VN')}: ${message}`]);
  };

  const processStep = (stepIndex: number) => {
    // Update step completion
    setSteps(prev => prev.map((step, idx) => 
      idx === stepIndex 
        ? { ...step, completed: true, timestamp: new Date().toLocaleTimeString('vi-VN') }
        : step
    ));
    
    // Add relevant log messages
    switch (stepIndex) {
      case 0:
        addLog(uploadedFile ? `Đã đọc file ${uploadedFile.name}` : 'Sử dụng dữ liệu demo');
        break;
      case 1:
        addLog('Phân loại sản phẩm theo danh mục...');
        break;
      case 2:
        addLog('Chuẩn hoá giá VND...');
        setStats({ validProducts: 10, skipped: 0 });
        break;
      case 3:
        addLog(`Tối ưu mô tả theo tone: ${survey?.brandTone || 'Thân thiện'}...`);
        break;
      case 4:
        addLog('Tối ưu kích thước ảnh sản phẩm...');
        break;
      case 5:
        addLog('Tạo badge tự động...');
        break;
      case 6:
        addLog('Phân tích sản phẩm liên quan...');
        break;
      case 7:
        addLog('Hoàn tất dựng Mini Shop!');
        processUploadedFile();
        break;
    }
    
    // Update progress
    const newProgress = ((stepIndex + 1) / steps.length) * 100;
    setProgress(newProgress);
    
    // Move to next step or complete
    if (stepIndex < steps.length - 1) {
      setCurrentStepIndex(stepIndex + 1);
    } else {
      setIsComplete(true);
      setProgress(100);
      setTimeout(() => {
        navigate('/shop');
      }, 800);
    }
  };

  const processUploadedFile = () => {
    if (!uploadedFile) {
      setProducts(demoProducts);
      return;
    }

    if (uploadedFile.name.endsWith('.csv')) {
      Papa.parse(uploadedFile, {
        header: true,
        complete: (results) => {
          const products: Product[] = results.data
            .filter((row: any) => row.name && row.price)
            .map((row: any, index: number) => ({
              id: row.product_id || `product-${index + 1}`,
              name: row.name,
              price: parseInt(row.price) || 0,
              currency: 'VND' as const,
              category: row.category || 'Tổng hợp',
              thumbnail: row.image_url || row.thumbnail || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
              images: row.images ? [row.images] : [row.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop'],
              shortDescription: row.short_description || 'Sản phẩm chất lượng cao',
              description: row.description || row.short_description || 'Mô tả chi tiết sản phẩm',
              stock: parseInt(row.stock) || 10,
              badges: generateBadges(row.category, index),
              related: []
            }));
          
          setProducts(products);
          setStats({ validProducts: products.length, skipped: results.data.length - products.length });
        }
      });
    }
  };

  const generateBadges = (category: string, index: number): string[] => {
    const badges = ['Chính Hãng'];
    if (index % 3 === 0) badges.push('Best Seller');
    if (index % 2 === 0) badges.push('Free Ship');
    return badges;
  };

  return (
    <div className="min-h-screen bg-muted/30 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/onboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">AI đang phân tích & dựng Mini Shop</h1>
            <p className="text-muted-foreground">Đừng tắt trang nhé. Mất khoảng 10–20 giây.</p>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Tiến trình xử lý</CardTitle>
                <CardDescription>
                  Shop: {survey?.shopName || 'Mini Shop Prometheus'} • Ngành: {survey?.industry || 'Tổng hợp'}
                </CardDescription>
              </div>
              <Badge variant="secondary">{Math.round(progress)}%</Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={progress} className="h-3" />
              <p className="text-center text-sm text-muted-foreground">
                {isComplete ? 'Hoàn thành!' : `Bước ${currentStepIndex + 1}/${steps.length}`}
              </p>
            </div>

            {/* Steps Timeline */}
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    step.completed 
                      ? 'bg-green-500 text-white' 
                      : index === currentStepIndex
                        ? 'bg-primary text-primary-foreground animate-pulse'
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${step.completed || index === currentStepIndex ? 'font-medium' : ''}`}>
                      {step.title}
                    </p>
                    {step.timestamp && (
                      <p className="text-xs text-muted-foreground">{step.timestamp}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Logs Console */}
            {logs.length > 0 && (
              <div className="bg-muted rounded-lg p-4">
                <h4 className="text-sm font-medium mb-2">Console log:</h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {logs.map((log, index) => (
                    <p key={index} className="text-xs text-muted-foreground font-mono">
                      {log}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            {stats.validProducts > 0 && (
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  Đã xử lý {stats.validProducts} sản phẩm hợp lệ
                  {stats.skipped > 0 && `, bỏ qua ${stats.skipped} dòng thiếu thông tin`}
                </AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            <div className="flex justify-center pt-4">
              {isComplete ? (
                <Button onClick={() => navigate('/shop')} size="lg">
                  Xem Mini Shop
                </Button>
              ) : (
                <Button disabled size="lg">
                  Đang xử lý...
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}