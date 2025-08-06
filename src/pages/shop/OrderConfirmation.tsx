import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/Layout';

export default function OrderConfirmation() {
  const location = useLocation();
  const { orderId, orderNumber } = location.state || {};

  return (
    <Layout type="customer">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Thank you for your order. We've received your order and will start processing it soon.
              </p>
              
              {orderNumber && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium">Order Number</p>
                  <p className="text-lg font-bold">#{orderNumber}</p>
                </div>
              )}

              <div className="space-y-2 pt-4">
                <Link to="/shop">
                  <Button className="w-full">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}