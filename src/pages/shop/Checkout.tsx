import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function Checkout() {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    orderNotes: ''
  });
  const [loading, setLoading] = useState(false);
  const { items, getTotal, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_name: formData.customerName,
          customer_phone: formData.customerPhone,
          customer_address: formData.customerAddress,
          order_notes: formData.orderNotes || null,
          total_amount: getTotal(),
          status: 'New'
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update product stock
      for (const item of items) {
        const { error: stockError } = await supabase
          .from('products')
          .update({ stock: item.product.stock - item.quantity })
          .eq('id', item.product.id);

        if (stockError) throw stockError;
      }

      clearCart();
      
      toast({
        title: 'Order placed successfully!',
        description: `Your order #${order.id.slice(0, 8)} has been received.`
      });

      navigate('/order-confirmation', { 
        state: { orderId: order.id, orderNumber: order.id.slice(0, 8) }
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to place order. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <Layout type="customer">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
            <p className="text-muted-foreground">Add some products to checkout!</p>
            <Link to="/shop">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout type="customer">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Link to="/cart">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cart
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Checkout</h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerName">Full Name *</Label>
                      <Input
                        id="customerName"
                        value={formData.customerName}
                        onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerPhone">Phone Number *</Label>
                      <Input
                        id="customerPhone"
                        type="tel"
                        value={formData.customerPhone}
                        onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="customerAddress">Delivery Address *</Label>
                    <Textarea
                      id="customerAddress"
                      value={formData.customerAddress}
                      onChange={(e) => setFormData(prev => ({ ...prev, customerAddress: e.target.value }))}
                      required
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="orderNotes">Order Notes (Optional)</Label>
                    <Textarea
                      id="orderNotes"
                      value={formData.orderNotes}
                      onChange={(e) => setFormData(prev => ({ ...prev, orderNotes: e.target.value }))}
                      placeholder="Any special instructions..."
                      rows={2}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? 'Processing...' : 'Confirm Order'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center overflow-hidden">
                        {item.product.images && item.product.images.length > 0 ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-xs text-muted-foreground">No Image</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          ${item.product.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                      <div className="font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total:</span>
                    <span>${getTotal().toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Free delivery within the city</p>
                  <p>• Payment on delivery (Cash/Card)</p>
                  <p>• Order processing time: 1-2 business days</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}