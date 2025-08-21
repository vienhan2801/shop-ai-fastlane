import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAppStore, Survey, demoProducts } from '@/lib/store';
import Papa from 'papaparse';

export default function Onboard() {
  const navigate = useNavigate();
  const { setSurvey, setProducts, setUploadedFile } = useAppStore();
  
  const [formData, setFormData] = useState<Survey>({
    shopName: '',
    industry: '',
    brandTone: '',
    currency: 'VND',
    useAiSuggestions: true,
  });
  
  const [uploadedFile, setUploadedFileState] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');
  const [filePreview, setFilePreview] = useState<any[]>([]);

  const handleFormChange = (field: keyof Survey, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateFile = (file: File): string | null => {
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type) && !file.name.endsWith('.csv')) {
      return 'Chỉ chấp nhận file CSV hoặc Excel (.csv, .xlsx)';
    }
    if (file.size > maxSize) {
      return 'File không được vượt quá 5MB';
    }
    return null;
  };

  const handleFileUpload = (file: File) => {
    const error = validateFile(file);
    if (error) {
      setFileError(error);
      return;
    }

    setFileError('');
    setUploadedFileState(file);
    setUploadedFile(file);

    // Parse CSV for preview
    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setFilePreview(results.data.slice(0, 3));
        },
        error: () => {
          setFileError('Không thể đọc file CSV');
        }
      });
    }
  };

  const downloadSampleFile = () => {
    const sampleData = [
      {
        product_id: 'P001',
        name: 'Giày thể thao Nike',
        price: '2490000',
        category: 'Thể thao',
        short_description: 'Giày chạy bộ thoải mái',
        description: 'Giày chạy bộ Nike với công nghệ đệm khí tiên tiến',
        stock: '50',
        image_url: 'https://example.com/nike-shoes.jpg'
      }
    ];
    
    const csv = Papa.unparse(sampleData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-products.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = () => {
    if (!formData.shopName || !formData.industry || !formData.brandTone) {
      setFileError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setSurvey(formData);
    navigate('/analyze');
  };

  const handleSkipDemo = () => {
    setSurvey({
      shopName: 'Mini Shop Prometheus',
      industry: 'Tổng hợp',
      brandTone: 'Thân thiện',
      currency: 'VND',
      useAiSuggestions: true,
    });
    setProducts(demoProducts);
    navigate('/analyze');
  };

  return (
    <div className="min-h-screen bg-muted/30 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Tạo Mini Shop trong 3 bước</h1>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">1</div>
            <div className="w-12 h-0.5 bg-border"></div>
            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">2</div>
            <div className="w-12 h-0.5 bg-border"></div>
            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">3</div>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-0">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left Panel - Survey Form */}
              <div className="p-8 border-r">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Thông tin cửa hàng</CardTitle>
                  <CardDescription>Điền thông tin để AI tối ưu shop cho bạn</CardDescription>
                </CardHeader>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="shopName">Tên shop *</Label>
                    <Input
                      id="shopName"
                      placeholder="VD: Thời trang Minh Anh"
                      value={formData.shopName}
                      onChange={(e) => handleFormChange('shopName', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Ngành hàng *</Label>
                    <Select value={formData.industry} onValueChange={(value) => handleFormChange('industry', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn ngành hàng" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fashion">Thời trang</SelectItem>
                        <SelectItem value="beauty">Mỹ phẩm</SelectItem>
                        <SelectItem value="tech">Công nghệ</SelectItem>
                        <SelectItem value="accessories">Phụ kiện</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Giọng điệu thương hiệu *</Label>
                    <Select value={formData.brandTone} onValueChange={(value) => handleFormChange('brandTone', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giọng điệu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="friendly">Thân thiện</SelectItem>
                        <SelectItem value="professional">Chuyên nghiệp</SelectItem>
                        <SelectItem value="dynamic">Năng động</SelectItem>
                        <SelectItem value="minimal">Tinh gọn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Đơn vị tiền tệ</Label>
                    <Select value={formData.currency} onValueChange={(value) => handleFormChange('currency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VND">VND (₫)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ai-suggestions"
                      checked={formData.useAiSuggestions}
                      onCheckedChange={(checked) => handleFormChange('useAiSuggestions', checked)}
                    />
                    <Label htmlFor="ai-suggestions" className="text-sm">
                      Dùng ảnh và mô tả AI gợi ý nếu thiếu thông tin
                    </Label>
                  </div>
                </div>
              </div>

              {/* Right Panel - File Upload */}
              <div className="p-8">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Tải danh sách sản phẩm</CardTitle>
                  <CardDescription>File Excel/CSV chứa thông tin sản phẩm</CardDescription>
                </CardHeader>

                <div className="space-y-6">
                  {/* Download Sample */}
                  <Button variant="outline" onClick={downloadSampleFile} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Tải file mẫu
                  </Button>

                  {/* Upload Area */}
                  <div 
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm font-medium mb-2">Thả file vào đây hoặc click để chọn</p>
                    <p className="text-xs text-muted-foreground">CSV, XLSX - Tối đa 5MB</p>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                    />
                  </div>

                  {/* File Info */}
                  {uploadedFile && (
                    <div className="bg-muted rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="font-medium">{uploadedFile.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {(uploadedFile.size / 1024).toFixed(1)} KB • {filePreview.length > 0 ? `${filePreview.length} dòng preview` : 'Đã tải lên'}
                      </p>
                    </div>
                  )}

                  {/* File Error */}
                  {fileError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{fileError}</AlertDescription>
                    </Alert>
                  )}

                  {/* File Preview */}
                  {filePreview.length > 0 && (
                    <div className="bg-muted rounded-lg p-4">
                      <h4 className="font-medium mb-2">Preview dữ liệu:</h4>
                      <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
                        {filePreview.map((row, idx) => (
                          <div key={idx} className="text-muted-foreground">
                            {Object.entries(row).slice(0, 3).map(([key, value]) => (
                              <span key={key} className="mr-4">{key}: {String(value)}</span>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t p-6 flex justify-between">
              <Button variant="ghost" onClick={handleSkipDemo}>
                Bỏ qua - dùng data demo
              </Button>
              <Button onClick={handleSubmit} className="min-w-40">
                Bắt đầu phân tích với AI
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}