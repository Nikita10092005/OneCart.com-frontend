import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { HiSparkles } from "react-icons/hi";
import { LogOut, Menu, Bell, Settings } from "lucide-react";

function AdminNavbar({ onMenuToggle }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <header className="h-14 bg-[#0F1923] border-b border-white/8 flex items-center px-4 gap-4 flex-shrink-0 z-30">

      {/* Mobile menu toggle */}
      <button aria-label="Open admin menu" onClick={onMenuToggle}
        className="md:hidden text-white/50 hover:text-white transition p-1.5 rounded-lg hover:bg-white/8">
        <Menu size={18} />
      </button>

      {/* Brand */}
      <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/admin")}>
        <div className="w-7 h-7 rounded-lg bg-amazon-accent flex items-center justify-center shadow-sm">
          <HiSparkles className="text-amazon-text text-xs" />
        </div>
        <span className="text-white font-black text-sm tracking-tight hidden sm:block">
          One<span className="text-amazon-accent">Cart</span>
          <span className="text-white/25 text-[10px] ml-0.5 font-normal">.com</span>
        </span>
      </div>

      {/* Divider */}
      <div className="h-5 w-px bg-white/10 hidden sm:block" />

      {/* Live badge */}
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Live</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <button aria-label="Price alerts" onClick={() => navigate('/admin/price-alerts')} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition">
          <Bell size={16} />
        </button>
        <button aria-label="Financial settings" onClick={() => navigate('/admin/financial')} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition">
          <Settings size={16} />
        </button>

        <div className="h-5 w-px bg-white/10 mx-1" />

        {/* Admin badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/8">
          <div className="w-6 h-6 rounded-md bg-amazon-accent flex items-center justify-center text-[10px] font-black text-amazon-text">
            A
          </div>
          <div className="hidden md:block">
            <p className="text-[11px] font-bold text-white leading-none">Admin</p>
            <p className="text-[9px] text-white/30 font-medium">Root Access</p>
          </div>
        </div>

        <motion.button
          aria-label="Logout"
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={() => { logout(); navigate("/"); }}
          className="ml-1 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white text-xs font-bold transition-all duration-200"
        >
          <LogOut size={13} />
          <span className="hidden sm:block">Logout</span>
        </motion.button>
      </div>
    </header>
  );
}

export default AdminNavbar;
