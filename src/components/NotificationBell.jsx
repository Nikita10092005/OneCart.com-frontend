import { useState, useEffect, useRef } from "react";
import { Bell, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const fetchNotifications = () => {
    if (!user) return;
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/api/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setNotifications(Array.isArray(data?.notifications) ? data.notifications : []))
      .catch(() => {});
  };

  // fetch on mount
  useEffect(() => {
    fetchNotifications();
  }, [user]);

  // re-fetch when dropdown opens
  useEffect(() => {
    if (open) fetchNotifications();
  }, [open]);

  // poll every 30 seconds so badge updates automatically
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const recent = notifications.slice(0, 10);

  const markAsRead = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${API_URL}/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch { /* fail silently */ }
  };

  const dismiss = async (e, id) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    // optimistic remove
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    try {
      await fetch(`${API_URL}/api/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // re-fetch to restore if delete failed
      fetchNotifications();
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <span className="font-semibold text-gray-700">Notifications</span>
            {notifications.length > 0 && (
              <span className="text-xs text-gray-400">{unreadCount} unread</span>
            )}
          </div>
          {recent.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-gray-500">No notifications yet</p>
          ) : (
            <ul className="max-h-96 overflow-y-auto divide-y divide-gray-100">
              {recent.map((n) => (
                <li
                  key={n._id}
                  onClick={() => !n.read && markAsRead(n._id)}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${
                    n.read ? "bg-white text-gray-700" : "bg-blue-50 text-gray-900 hover:bg-yellow-50"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-snug ${!n.read ? "font-semibold" : ""}`}>
                      {n.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {/* Always visible dismiss button */}
                  <button
                    onClick={(e) => dismiss(e, n._id)}
                    className="shrink-0 mt-0.5 p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    aria-label="Dismiss notification"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
