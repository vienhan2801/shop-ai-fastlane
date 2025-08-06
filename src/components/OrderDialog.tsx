import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order, OrderItem } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OrderDialogProps {
  open: boolean;
  onClose: () => void;
  order?: Order | null;
  onUpdated: () => void;
}

export function OrderDialog({ open, onClose, order, onUpdated }: OrderDialogProps) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (order) {
      setStatus(order.status);
      fetchOrderItems();
    }
  }, [order]);

  const fetchOrderItems = async () => {
    if (!order) return;
    
    setItemsLoading(true);
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          *,
          product:products(*)
        `)
        .eq('order_id', order.id);

      if (error) throw error;
      setOrderItems(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch order items',
        variant: 'destructive'
      });
    } finally {
      setItemsLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!order) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', order.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Order status updated successfully'
      });
      onUpdated();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details - #{order.id.slice(0, 8)}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Customer Details</h4>
                  <p>{order.customer_name}</p>
                  <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Order Status</h4>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-1">Delivery Address</h4>
                <p className="text-sm">{order.customer_address}</p>
              </div>

              {order.order_notes && (
                <div>
                  <h4 className="font-medium mb-1">Order Notes</h4>
                  <p className="text-sm">{order.order_notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              {itemsLoading ? (
                <div className="text-center py-4">Loading items...</div>
              ) : (
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center overflow-hidden">
                        {item.product?.images && item.product.images.length > 0 ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-xs text-muted-foreground">No Image</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium">{item.product?.name}</h5>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <div className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total:</span>
                      <span>${order.total_amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status Update */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Update Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleStatusUpdate}
                  disabled={loading || status === order.status}
                >
                  {loading ? 'Updating...' : 'Update Status'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}