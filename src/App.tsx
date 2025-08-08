import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProductManagement from "./pages/admin/ProductManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import ProductListing from "./pages/shop/ProductListing";
import ProductDetail from "./pages/shop/ProductDetail";
import Cart from "./pages/shop/Cart";
import Checkout from "./pages/shop/Checkout";
import OrderConfirmation from "./pages/shop/OrderConfirmation";
import Onboard from "./pages/Onboard";
import Analyze from "./pages/Analyze";
import Shop from "./pages/Shop";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/onboard" replace />} />
          <Route path="/onboard" element={<Onboard />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:id" element={<ProductDetail />} />
          <Route path="/admin" element={<ProductManagement />} />
          <Route path="/admin/orders" element={<OrderManagement />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
