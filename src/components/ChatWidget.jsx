import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000");

function ChatWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef();

  useEffect(() => {
    if (user?._id) socket.emit("joinRoom", user._id);
    const handleMessage = (msg) => {
      if (msg.userId !== user?._id) return;
      setMessages((prev) => {
        if (prev.some(m => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
      if (!open) { setUnread((prev) => prev + 1); new Audio("/ping.mp3").play().catch(() => {}); }
      if (msg.sender === "bot") setTyping(false);
    };
    socket.off("receiveMessage");
    socket.on("receiveMessage", handleMessage);
    return () => socket.off("receiveMessage", handleMessage);
  }, [user, open]);

  // Listen for external open trigger (e.g. from sidebar)
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('openChat', handler);
    return () => window.removeEventListener('openChat', handler);
  }, []);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        { text: "👋 Hi! Welcome to OneCart Support", sender: "bot" },
        { text: "How can I help you today?", sender: "bot" }
      ]);
    }
  }, [open]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { if (open) setUnread(0); }, [open]);

  const sendMessage = () => {
    if (!text.trim()) return;
    socket.emit("sendMessage", { userId: user?._id, userEmail: user?.email, text, sender: "user" });
    setTyping(true);
    setText("");
  };

  const sendQuick = (val) => { setText(val); setTimeout(sendMessage, 100); };

  return (
    <>
      {/* FLOATING BUTTON */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text flex items-center justify-center cursor-pointer shadow-xl shadow-black/10 z-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {unread > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {unread}
              </motion.span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHAT BOX */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 w-80 h-[460px] bg-white rounded-2xl shadow-2xl shadow-black/10 border border-amazon-border flex flex-col z-50 overflow-hidden">

            {/* HEADER */}
            <div className="bg-amazon-accent text-amazon-text px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="font-bold text-sm">OneCart Support</span>
              </div>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => setOpen(false)}
                className="text-amazon-text/80 hover:text-amazon-text text-lg leading-none">✕</motion.button>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-amazon-section/30">
              {messages.map((m, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className={`flex gap-2 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className="w-6 h-6 rounded-full bg-amazon-section border border-amazon-border flex items-center justify-center text-xs flex-shrink-0">
                    {m.sender === "user" ? "🧑" : "🤖"}
                  </div>
                  <div className={`px-3 py-2 rounded-2xl text-sm max-w-[70%] shadow-sm
                    ${m.sender === "user"
                      ? "bg-amazon-accent text-amazon-text rounded-tr-sm"
                      : "bg-white text-amazon-text border border-amazon-border rounded-tl-sm"}`}>
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {messages.length <= 2 && (
                <div className="flex gap-2 flex-wrap mt-2">
                  {["📦 Order", "🔄 Return", "💳 Payment"].map(q => (
                    <motion.button key={q} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                      onClick={() => sendQuick(q.split(" ")[1].toLowerCase())}
                      className="text-xs bg-white border border-amazon-border text-amazon-accent px-3 py-1.5 rounded-full hover:border-amazon-border transition shadow-sm">
                      {q}
                    </motion.button>
                  ))}
                </div>
              )}

              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex gap-1 items-center px-3 py-2 bg-white rounded-2xl w-fit border border-amazon-border">
                  {[0,1,2].map(i => (
                    <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, delay: i * 0.15, duration: 0.5 }}
                      className="w-1.5 h-1.5 rounded-full bg-amazon-text-secondary" />
                  ))}
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* INPUT */}
            <div className="flex border-t border-amazon-border bg-white">
              <input value={text} onChange={e => setText(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                className="flex-1 px-4 py-3 text-sm text-amazon-text placeholder-amazon-text-secondary focus:outline-none bg-transparent" />
              <motion.button onClick={sendMessage} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="px-4 text-amazon-accent hover:text-amazon-accent-hover transition font-bold text-lg">
                ➤
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ChatWidget;
