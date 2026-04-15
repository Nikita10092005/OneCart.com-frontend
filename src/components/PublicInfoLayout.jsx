import { Outlet, useNavigate } from "react-router-dom";
import { HiSparkles } from "react-icons/hi";
import { FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function PublicInfoLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogoClick = () => {
    if (!user) navigate("/");
    else if (user.role === "admin") navigate("/admin");
    else navigate("/home");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Minimal top bar */}
      <header className="bg-amazon-header border-b border-white/10 px-6 py-3 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="text-white/50 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
        >
          <FaArrowLeft size={12} /> Back
        </button>
        <div
          onClick={handleLogoClick}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-6 h-6 rounded-lg bg-amazon-accent flex items-center justify-center">
            <HiSparkles className="text-amazon-text text-[10px]" />
          </div>
          <span className="text-white font-black text-sm">
            One<span className="text-amazon-accent">Cart</span>
          </span>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
