import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/Layout';
import { Product } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { toast } = useToast();
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setProduct(data);
      
      // Fetch related products (same category, excluding current product)
      if (data.category) {
        const { data: related } = await supabase
          .from('products')
          .select('*')
          .eq('category', data.category)
          .neq('id', data.id)
          .gt('stock', 0)
          .limit(4);
        
        setRelatedProducts(related || []);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch product details',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast({
        title: 'Added to cart',
        description: `${quantity} ${product.name}(s) added to your cart`
      });
    }
  };

  const adjustQuantity = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && product && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <Layout type="customer">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading product...</div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout type="customer">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Link to="/shop">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Shop
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
          <Link to="/shop">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Button>
          </Link>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImage] || product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Image Available
                  </div>
                )}
              </div>
              
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <h1 className="text-3xl font-bold">{product.name}</h1>
                  {product.category && (
                    <Badge variant="secondary">{product.category}</Badge>
                  )}
                </div>
                <div className="text-3xl font-bold text-primary mb-4">
                  ${product.price.toFixed(2)}
                </div>
                {product.description && (
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">In Stock:</span>
                  <span className="font-medium">{product.stock} units</span>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium">Quantity:</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => adjustQuantity(-1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => adjustQuantity(1)}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedProducts.map((relatedProduct) => (
                  <Card key={relatedProduct.id} className="overflow-hidden">
                    <Link to={`/product/${relatedProduct.id}`}>
                      <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                        {relatedProduct.images && relatedProduct.images.length > 0 ? (
                          <img
                            src={relatedProduct.images[0]}
                            alt={relatedProduct.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-muted-foreground">No Image</div>
                        )}
                      </div>
                    </Link>
                    <CardContent className="p-4">
                      <h3 className="font-semibold line-clamp-1">{relatedProduct.name}</h3>
                      <p className="text-lg font-bold text-primary">
                        ${relatedProduct.price.toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}