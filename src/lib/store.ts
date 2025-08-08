import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  price: number;
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

// Demo products
export const demoProducts: Product[] = [
  {
    id: '1',
    name: 'Giày Chạy Bộ Nike Air Zoom Pegasus',
    price: 2490000,
    currency: 'VND',
    category: 'Thể thao',
    badges: ['Chính Hãng', 'Free Ship'],
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop'],
    shortDescription: 'Giày chạy bộ nhẹ nhàng, êm ái cho người mới bắt đầu',
    description: 'Nike Air Zoom Pegasus là lựa chọn hoàn hảo cho những người mới bắt đầu chạy bộ. Với thiết kế nhẹ nhàng, đệm êm ái và độ bền cao.',
    stock: 50,
    related: ['2', '3']
  },
  {
    id: '2',
    name: 'Túi Xách Công Sở Cao Cấp',
    price: 850000,
    currency: 'VND',
    category: 'Phụ kiện',
    badges: ['Best Seller'],
    thumbnail: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop'],
    shortDescription: 'Túi xách da thật, thiết kế sang trọng',
    description: 'Túi xách công sở được làm từ da thật cao cấp, thiết kế tinh tế phù hợp với môi trường công sở hiện đại.',
    stock: 25,
    related: ['1', '3']
  },
  {
    id: '3',
    name: 'Đồng Hồ Thông Minh Apple Watch',
    price: 8990000,
    currency: 'VND',
    category: 'Công nghệ',
    badges: ['Chính Hãng', 'Bảo hành 12 tháng'],
    thumbnail: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&h=800&fit=crop'],
    shortDescription: 'Theo dõi sức khỏe và thể thao toàn diện',
    description: 'Apple Watch Series mới nhất với đầy đủ tính năng theo dõi sức khỏe, thể thao và kết nối thông minh.',
    stock: 15,
    related: ['1', '2']
  }
];