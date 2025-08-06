import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Package, ClipboardList, Store } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

interface LayoutProps {
  children: ReactNode;
  type?: 'admin' | 'customer';
}

export function Layout({ children, type = 'customer' }: LayoutProps) {
  const location = useLocation();
  const { getItemCount } = useCart();

  if (type === 'customer') {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/shop" className="flex items-center space-x-2">
                <Store className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Mini Shop</span>
              </Link>
              <Link to="/cart">
                <Button variant="outline" size="sm" className="relative">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                  {getItemCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getItemCount()}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </header>
        <main>{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/admin" className="flex items-center space-x-2">
              <Store className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Shop Admin</span>
            </Link>
            <nav className="flex space-x-4">
              <Link to="/admin">
                <Button
                  variant={location.pathname === '/admin' ? 'default' : 'ghost'}
                  size="sm"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Products
                </Button>
              </Link>
              <Link to="/admin/orders">
                <Button
                  variant={location.pathname === '/admin/orders' ? 'default' : 'ghost'}
                  size="sm"
                >
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Orders
                </Button>
              </Link>
              <Link to="/shop">
                <Button variant="outline" size="sm">
                  <Store className="h-4 w-4 mr-2" />
                  View Shop
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}