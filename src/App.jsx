import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import AuthProvider from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import UserLayout from "./components/UserLayout";
import PublicInfoLayout from "./components/PublicInfoLayout";
import AdminLayout from "./pages/admin/AdminLayout";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import ProductDetails from "./pages/ProductDetails";
import Search from "./pages/Search";
import Wishlist from "./pages/Wishlist";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Privacy from "./pages/Privacy";
import Returns from "./pages/Returns";
import TrackOrder from "./pages/TrackOrder";
import Verify from "./pages/Verify";
import Profile from "./pages/Profile";
import MoodShop from "./pages/MoodShop";
import PriceAlerts from "./pages/PriceAlerts";
import Comparison from "./pages/Comparison";
import Rewards from "./pages/Rewards";

import About from "./pages/About";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Science from "./pages/Science";
import Sell from "./pages/Sell";
import SellUnder from "./pages/SellUnder";
import Affiliate from "./pages/Affiliate";
import Advertise from "./pages/Advertise";
import BusinessCard from "./pages/BusinessCard";
import ReloadBalance from "./pages/ReloadBalance";
import CurrencyConverter from "./pages/CurrencyConverter";
import Shipping from "./pages/Shipping";
import Conditions from "./pages/Conditions";
import InterestAds from "./pages/InterestAds";

import SellerRoute from "./components/SellerRoute";
import SellerDashboard from "./pages/SellerDashboard";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AddProduct from "./pages/admin/AddProduct";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import EditProduct from "./pages/admin/EditProduct";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminQueries from "./pages/admin/AdminQueries";
import AdminPriceAlerts from "./pages/admin/AdminPriceAlerts";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminFinancial from "./pages/admin/AdminFinancial";
import AdminSellerApplications from "./pages/admin/AdminSellerApplications";
import AdminJobApplications from "./pages/admin/AdminJobApplications";

function AppWrapper() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <App />
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

        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/price-alerts" element={<PriceAlerts />} />
        <Route path="/comparison" element={<Comparison />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/press" element={<Press />} />
        <Route path="/science" element={<Science />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/sell-under" element={<SellUnder />} />
        <Route path="/affiliate" element={<Affiliate />} />
        <Route path="/advertise" element={<Advertise />} />
        <Route path="/business-card" element={<BusinessCard />} />
        <Route path="/reload-balance" element={<ReloadBalance />} />
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
        <Route path="/admin/jobs" element={<AdminJobApplications />} />
      </Route>

    </Routes>
    </>
  );
}

export default AppWrapper;
