import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  LayoutDashboard, Package, PlusCircle, ShoppingCart, MessageSquare,
  ShieldCheck, Bell, BarChart3, DollarSign, Inbox, Store, Briefcase,
  ChevronRight, ChevronDown, Menu, X, Users
} from "lucide-react";
import AdminNavbar from "./AdminNavbar";

const MENU_GROUPS = [
  {
    group: "Overview",
    items: [
      { label: "Dashboard",   path: "/admin",             icon: LayoutDashboard },
      { label: "Analytics",   path: "/admin/analytics",   icon: BarChart3 },
    ]
  },
  {
    group: "Catalogue",
    items: [
      { label: "Products",    path: "/admin/products",    icon: Package },
      { label: "Add Product", path: "/admin/add-product", icon: PlusCircle },
    ]
  },
  {
    group: "Operations",
    items: [
      { label: "Orders",      path: "/admin/orders",      icon: ShoppingCart },
      { label: "Price Alerts",path: "/admin/price-alerts",icon: Bell },
      { label: "Financial",   path: "/admin/financial",   icon: DollarSign },
    ]
  },
  {
    group: "Support",
    items: [
      { label: "Messages",    path: "/admin/messages",    icon: MessageSquare },
      { label: "Queries",     path: "/admin/queries",     icon: Inbox },
    ]
  },
  {
    group: "People",
    items: [
      { label: "Customers", path: "/admin/customers", icon: Users },
      { label: "Seller Accounts", path: "/admin/seller-accounts", icon: Store },
      { label: "Seller Applications", path: "/admin/sellers", icon: Store },
      { label: "Jobs",        path: "/admin/jobs",        icon: Briefcase },
    ]
  },
];

const PAGE_LABELS = {
  "/admin":              "Dashboard",
  "/admin/analytics":    "Analytics",
  "/admin/products":     "Products",
  "/admin/add-product":  "Add Product",
  "/admin/orders":       "Orders",
  "/admin/price-alerts": "Price Alerts",
  "/admin/financial":    "Financial",
  "/admin/messages":     "Messages",
  "/admin/queries":      "Queries",
  "/admin/sellers":      "Seller Applications",
  "/admin/customers":    "Customers",
  "/admin/seller-accounts": "Seller Accounts",
  "/admin/jobs":         "Jobs",
};

function AdminLayout() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageLabel = PAGE_LABELS[location.pathname] || "Admin";

  const sidebarContent = (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 py-5 border-b border-white/8 ${collapsed ? "justify-center px-3" : ""}`}>
        <div className="w-8 h-8 rounded-lg bg-amazon-accent flex items-center justify-center flex-shrink-0 shadow-md">
          <ShieldCheck size={15} className="text-amazon-text" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-white font-black text-sm leading-none">OneCart</p>
            <p className="text-[9px] text-amazon-accent font-bold uppercase tracking-widest mt-0.5">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5">
        {MENU_GROUPS.map(group => (
          <div key={group.group}>
            {!collapsed && (
              <p className="text-[9px] font-black text-white/25 uppercase tracking-[0.18em] px-3 mb-1.5">{group.group}</p>
            )}
            <div className="space-y-0.5">
              {group.items.map(item => {
                const active = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.path}
                    whileHover={{ x: active ? 0 : 3 }}
                    onClick={() => { navigate(item.path); setMobileOpen(false); }}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150
                      ${active
                        ? "bg-amazon-accent text-amazon-text shadow-sm shadow-amazon-accent/30"
                        : "text-white/55 hover:text-white hover:bg-white/8"
                      } ${collapsed ? "justify-center" : ""}`}
                  >
                    <Icon size={16} className="flex-shrink-0" />
                    {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
                    {!collapsed && active && <div className="w-1.5 h-1.5 rounded-full bg-amazon-text/40" />}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="hidden md:block p-3 border-t border-white/8">
        <button
          onClick={() => setCollapsed(c => !c)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-white/30 hover:text-white/60 hover:bg-white/5 transition text-xs font-bold"
        >
          {collapsed ? <ChevronRight size={14} /> : <><ChevronDown size={14} /><span>Collapse</span></>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F5F7] font-sans antialiased">
      <AdminNavbar onMenuToggle={() => {setCollapsed(false);setMobileOpen(o => !o);}} />

      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 56px)" }}>

        {/* Desktop Sidebar */}
        <motion.aside
          animate={{ width: collapsed ? 64 : 240 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="hidden md:flex flex-col bg-[#0F1923] overflow-hidden flex-shrink-0 border-r border-white/5"
        >
          {sidebarContent}
        </motion.aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 md:hidden" />
              <motion.aside
                initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="fixed left-0 top-0 bottom-0 w-60 bg-[#0F1923] z-50 md:hidden flex flex-col"
              >
                <div className="flex items-center justify-between px-4 py-4 border-b border-white/8">
                  <p className="text-white font-black text-sm">Admin Panel</p>
                  <button aria-label="Close admin menu" onClick={() => setMobileOpen(false)} className="text-white/40 hover:text-white">
                    <X size={18} />
                  </button>
                </div>
                {sidebarContent}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          {/* Breadcrumb bar */}
          <div className="sticky top-0 z-10 bg-[#F4F5F7] border-b border-gray-200 px-6 py-3 flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium">Admin</span>
            <ChevronRight size={12} className="text-gray-300" />
            <span className="text-xs font-bold text-gray-700">{pageLabel}</span>
          </div>

          <div className="p-3 sm:p-6 max-w-[1500px] mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 sm:p-7 min-h-[600px]"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
