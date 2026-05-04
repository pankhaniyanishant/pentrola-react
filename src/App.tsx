import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { WishlistProvider } from './context/WishlistContext'
import CartDrawer from './components/CartDrawer'
import Home from './components/Home'
import Products from './components/Products'
import Checkout from './components/Checkout'
import OrderSuccess from './components/OrderSuccess'
import About from './components/About'
import Contact from './components/Contact'
import SignIn from './components/SignIn'
import CreateAccount from './components/CreateAccount'
import ForgotPassword from './components/ForgotPassword'
import AdminLogin from './admin/AdminLogin'
import AdminLayout from './admin/AdminLayout';
import AdminProducts from './admin/AdminProducts';
import AdminOrders from './admin/AdminOrders';
import AdminCustomers from './admin/AdminCustomers';
import AdminInventory from './admin/AdminInventory';
import AdminAnalytics from './admin/AdminAnalytics';
import AdminSettings from './admin/AdminSettings';

import AdminDashboard from './admin/AdminDashboard';
import AdminActivity from './admin/AdminActivity';
import OrderHistory from './components/OrderHistory';
import Invoice from './components/Invoice';
import Wishlist from './components/Wishlist';

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <BrowserRouter>
            <CartDrawer />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<CreateAccount />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/invoice/:id" element={<Invoice />} />

              {/* Admin Portal Nested Layout */}
              <Route path="/admin/dashboard" element={
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              } />
              <Route path="/admin/activity" element={
                <AdminLayout>
                  <AdminActivity />
                </AdminLayout>
              } />
              <Route path="/admin/products" element={
                <AdminLayout>
                  <AdminProducts />
                </AdminLayout>
              } />
              <Route path="/admin/orders" element={
                <AdminLayout>
                  <AdminOrders />
                </AdminLayout>
              } />
              <Route path="/admin/customers" element={
                <AdminLayout>
                  <AdminCustomers />
                </AdminLayout>
              } />
              <Route path="/admin/inventory" element={
                <AdminLayout>
                  <AdminInventory />
                </AdminLayout>
              } />
              <Route path="/admin/analytics" element={
                <AdminLayout>
                  <AdminAnalytics />
                </AdminLayout>
              } />
              <Route path="/admin/settings" element={
                <AdminLayout>
                  <AdminSettings />
                </AdminLayout>
              } />
              <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

            </Routes>
          </BrowserRouter>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  )
}

export default App
