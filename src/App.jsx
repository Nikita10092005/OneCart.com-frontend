import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import AuthProvider from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import UserLayout from "./components/UserLayout";
import PublicInfoLayout from "./components/PublicInfoLayout";
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const Landing = lazy(() => import('./pages/Landing'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const Home = lazy(() => import('./pages/Home'));
const Cart = lazy(() => import('./pages/Cart'));
const Orders = lazy(() => import('./pages/Orders'));
const Checkout = lazy(() => import('./pages/Checkout'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Search = lazy(() => import('./pages/Search'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Returns = lazy(() => import('./pages/Returns'));
const TrackOrder = lazy(() => import('./pages/TrackOrder'));
const Verify = lazy(() => import('./pages/Verify'));
const Profile = lazy(() => import('./pages/Profile'));
const MoodShop = lazy(() => import('./pages/MoodShop'));
const PriceAlerts = lazy(() => import('./pages/PriceAlerts'));
const Comparison = lazy(() => import('./pages/Comparison'));
const Rewards = lazy(() => import('./pages/Rewards'));

const About = lazy(() => import('./pages/About'));
const Careers = lazy(() => import('./pages/Careers'));
const Press = lazy(() => import('./pages/Press'));
const Science = lazy(() => import('./pages/Science'));
const Sell = lazy(() => import('./pages/Sell'));
const SellUnder = lazy(() => import('./pages/SellUnder'));
const Affiliate = lazy(() => import('./pages/Affiliate'));
const Advertise = lazy(() => import('./pages/Advertise'));
const BusinessCard = lazy(() => import('./pages/BusinessCard'));
const ReloadBalance = lazy(() => import('./pages/ReloadBalance'));
const CurrencyConverter = lazy(() => import('./pages/CurrencyConverter'));
const Shipping = lazy(() => import('./pages/Shipping'));
const Conditions = lazy(() => import('./pages/Conditions'));
const InterestAds = lazy(() => import('./pages/InterestAds'));

import SellerRoute from "./components/SellerRoute";
const SellerDashboard = lazy(() => import('./pages/SellerDashboard'));

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AddProduct = lazy(() => import('./pages/admin/AddProduct'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const EditProduct = lazy(() => import('./pages/admin/EditProduct'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));
const AdminQueries = lazy(() => import('./pages/admin/AdminQueries'));
const AdminPriceAlerts = lazy(() => import('./pages/admin/AdminPriceAlerts'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminFinancial = lazy(() => import('./pages/admin/AdminFinancial'));
const AdminSellerApplications = lazy(() => import('./pages/admin/AdminSellerApplications'));
const AdminPeople = lazy(() => import('./pages/admin/AdminPeople'));
const AdminJobApplications = lazy(() => import('./pages/admin/AdminJobApplications'));

function AppWrapper() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<div role="status" className="min-h-screen grid place-items-center">Loading…</div>}><App /></Suspense>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

function App() {
  return (
    <>
      <Routes>

      {/* PUBLIC */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/verify/:token" element={<Verify />} />

      {/* PUBLIC INFO PAGES — accessible without login */}
      <Route element={<PublicInfoLayout />}>
        <Route path="/about" element={<About />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/conditions" element={<Conditions />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
      </Route>

      {/* USER LAYOUT */}
      <Route element={<UserLayout />}>
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/track" element={<TrackOrder />} />
        <Route path="/mood-shop" element={<MoodShop />} />

        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
        <Route path="/price-alerts" element={<ProtectedRoute><PriceAlerts /></ProtectedRoute>} />
        <Route path="/comparison" element={<ProtectedRoute><Comparison /></ProtectedRoute>} />
        <Route path="/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
        <Route path="/press" element={<Press />} />
        <Route path="/science" element={<Science />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/sell-under" element={<SellUnder />} />
        <Route path="/affiliate" element={<Affiliate />} />
        <Route path="/advertise" element={<Advertise />} />
        <Route path="/business-card" element={<BusinessCard />} />
        <Route path="/reload-balance" element={<ProtectedRoute><ReloadBalance /></ProtectedRoute>} />
        <Route path="/currency-converter" element={<CurrencyConverter />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/interest-ads" element={<InterestAds />} />
        <Route path="/seller/dashboard" element={<SellerRoute><SellerDashboard /></SellerRoute>} />
      </Route>

      {/* ADMIN LAYOUT */}
      <Route element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/product/:id/edit" element={<EditProduct />} />
        <Route path="/admin/messages" element={<AdminMessages />} />
        <Route path="/admin/queries" element={<AdminQueries />} />
        <Route path="/admin/price-alerts" element={<AdminPriceAlerts />} />
        <Route path="/admin/financial" element={<AdminFinancial />} />
        <Route path="/admin/sellers" element={<AdminSellerApplications />} />
        <Route path="/admin/customers" element={<AdminPeople key="customers" role="user" />} />
        <Route path="/admin/seller-accounts" element={<AdminPeople key="sellers" role="seller" />} />
        <Route path="/admin/jobs" element={<AdminJobApplications />} />
      </Route>

    </Routes>
    </>
  );
}

export default AppWrapper;
