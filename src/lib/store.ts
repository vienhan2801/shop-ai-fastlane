import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  price: number;
  listedPrice?: number;
  currency: 'VND';
  category: string;
  badges?: string[];
  thumbnail: string;
  images?: string[];
  shortDescription?: string;
  description?: string;
  stock?: number;
  related?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Survey {
  shopName: string;
  industry: string;
  brandTone: string;
  currency: string;
  useAiSuggestions: boolean;
}

interface AppState {
  survey: Survey | null;
  products: Product[];
  uploadedFile: File | null;
  setSurvey: (survey: Survey) => void;
  setProducts: (products: Product[]) => void;
  setUploadedFile: (file: File | null) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  survey: null,
  products: [],
  uploadedFile: null,
  setSurvey: (survey) => set({ survey }),
  setProducts: (products) => set({ products }),
  setUploadedFile: (file) => set({ uploadedFile: file }),
  reset: () => set({ survey: null, products: [], uploadedFile: null }),
}));

export const demoProducts: Product[] = [
  // Thể thao
  {
    id: '1',
    name: 'Giày Chạy Bộ Nike Air Zoom Pegasus',
    price: 2490000,
    listedPrice: 2990000,
    currency: 'VND',
    category: 'Thể thao',
    badges: ['Chính Hãng', 'Free Ship'],
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    stock: 50,
  },
  {
    id: '2',
    name: 'Bình Nước Thể Thao Lock&Lock',
    price: 190000,
    listedPrice: 250000,
    currency: 'VND',
    category: 'Thể thao',
    badges: ['Hot'],
    thumbnail: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=400&fit=crop',
    stock: 100,
  },
  {
    id: '3',
    name: 'Áo Thun Thể Thao Adidas',
    price: 450000,
    listedPrice: 590000,
    currency: 'VND',
    category: 'Thể thao',
    badges: ['Best Seller'],
    thumbnail: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=400&fit=crop',
    stock: 60,
  },
  // Phụ kiện công sở
  {
    id: '4',
    name: 'Túi Xách Công Sở Da Thật',
    price: 850000,
    listedPrice: 990000,
    currency: 'VND',
    category: 'Phụ kiện công sở',
    badges: ['Best Seller'],
    thumbnail: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    stock: 25,
  },
  {
    id: '5',
    name: 'Balo Laptop Công Sở Xiaomi',
    price: 650000,
    listedPrice: 850000,
    currency: 'VND',
    category: 'Phụ kiện công sở',
    badges: ['Best Seller'],
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop',
    stock: 55,
  },
  {
    id: '6',
    name: 'Ví Da Nam Công Sở',
    price: 390000,
    listedPrice: 490000,
    currency: 'VND',
    category: 'Phụ kiện công sở',
    badges: ['Chính Hãng'],
    thumbnail: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=400&fit=crop',
    stock: 40,
  },
  // Thiết bị điện tử
  {
    id: '7',
    name: 'Tai Nghe Bluetooth Sony WH-CH510',
    price: 1190000,
    listedPrice: 1490000,
    currency: 'VND',
    category: 'Thiết bị điện tử',
    badges: ['Chính Hãng', 'Free Ship'],
    thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
    stock: 38,
  },
  {
    id: '8',
    name: 'Đồng Hồ Thông Minh Apple Watch',
    price: 8990000,
    listedPrice: 9990000,
    currency: 'VND',
    category: 'Thiết bị điện tử',
    badges: ['Chính Hãng', 'Bảo hành 12 tháng'],
    thumbnail: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=400&fit=crop',
    stock: 15,
  },
  {
    id: '9',
    name: 'Chuột Không Dây Logitech M331',
    price: 350000,
    listedPrice: 420000,
    currency: 'VND',
    category: 'Thiết bị điện tử',
    badges: ['Best Seller'],
    thumbnail: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=400&fit=crop',
    stock: 70,
  },
  // ...bổ sung thêm sản phẩm nếu muốn...
];