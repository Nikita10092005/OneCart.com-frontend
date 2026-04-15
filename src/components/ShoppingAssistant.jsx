import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, X, Send } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ShoppingAssistant() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  const addMessage = (msg) =>
    setMessages((prev) => [...prev, msg].slice(-10));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const query = input.trim();
    if (!query || loading) return;

    addMessage({ role: "user", text: query });
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/assistant/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();

      if (data.message) {
        addMessage({ role: "assistant", text: data.message });
      } else {
        addMessage({ role: "assistant", products: data.products || [] });
      }
    } catch {
      addMessage({
        role: "assistant",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Toggle Shopping Assistant"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 bg-white rounded-xl shadow-xl border z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white">
            <span className="font-semibold text-sm">🛍️ Shopping Assistant</span>
            <button
              onClick={() => setOpen(false)}
              className="hover:opacity-75 transition-opacity"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-80">
            {messages.length === 0 && (
              <p className="text-xs text-gray-400 text-center mt-4">
                Ask me anything! e.g. "Show me shoes under ₹2000"
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "user" ? (
                  <span className="bg-blue-600 text-white text-sm px-3 py-2 rounded-xl max-w-[75%]">
                    {msg.text}
                  </span>
                ) : msg.text ? (
                  <span className="bg-gray-100 text-gray-800 text-sm px-3 py-2 rounded-xl max-w-[75%]">
                    {msg.text}
                  </span>
                ) : (
                  <div className="flex flex-col gap-2 max-w-full">
                    {msg.products && msg.products.length > 0 ? (
                      msg.products.map((p) => (
                        <div
                          key={p._id}
                          onClick={() => navigate(`/product/${p._id}`)}
                          className="flex items-center gap-2 bg-gray-100 rounded-lg p-2 cursor-pointer hover:bg-gray-200 transition-colors"
                        >
                          <img
                            src={
                              p.image?.startsWith("http")
                                ? p.image
                                : `${API_URL}/uploads/${p.image}`
                            }
                            alt={p.name}
                            className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-800 truncate">
                              {p.name}
                            </p>
                            <p className="text-xs text-blue-600 font-semibold">
                              ₹{p.price}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="bg-gray-100 text-gray-800 text-sm px-3 py-2 rounded-xl">
                        No products found. Try a different query.
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <span className="bg-gray-100 text-gray-500 text-xs px-3 py-2 rounded-xl animate-pulse">
                  Searching...
                </span>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 border-t">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search products..."
              className="flex-1 text-sm border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              aria-label="Send"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
