import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../services/api";
import { io } from "socket.io-client";
import { Send, MessageSquare, Search } from "lucide-react";

const SOCKET_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

function AdminMessages() {
  const [messages, setMessages]       = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [reply, setReply]             = useState("");

  useEffect(() => {
    fetchMessages();
    socket.emit("joinAdmin");
    const handleMessage = (msg) => setMessages(prev => [...prev, msg]);
    socket.on("receiveMessage", handleMessage);
    return () => socket.off("receiveMessage", handleMessage);
  }, []);

  const fetchMessages = async () => {
    const res = await API.get("/messages");
    setMessages(res.data);
  };

  const users = [...new Map(messages.map(m => [m.userId, m])).values()];
  const filteredMessages = messages.filter(m => m.userId === selectedUser);

  const sendReply = () => {
    if (!reply.trim() || !selectedUser) return;
    const u = users.find(u => u.userId === selectedUser);
    socket.emit("sendMessage", { userId: selectedUser, userEmail: u?.userEmail, text: reply, sender: "bot" });
    setReply("");
  };

  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div className="pb-5 border-b border-amazon-section">
        <h2 className="text-2xl font-black text-amazon-text">Customer Messages</h2>
        <p className="text-amazon-accent text-sm mt-0.5">Respond to customer support queries</p>
      </div>

      <div className="flex flex-col md:flex-row h-[65vh] bg-amazon-section/30 rounded-2xl overflow-hidden border border-amazon-border">

        {/* SIDEBAR */}
        <div className={`${selectedUser ? "hidden md:flex" : "flex"} w-full md:w-72 border-r border-amazon-border flex-col bg-white`}>
          <div className="p-4 border-b border-amazon-section">
            <h3 className="text-sm font-black text-amazon-text flex items-center gap-2 mb-3">
              <MessageSquare size={16} className="text-amazon-accent" />
              Conversations
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-amazon-text-secondary" size={13} />
              <input type="text" placeholder="Search customers..."
                className="w-full pl-8 pr-3 py-2 bg-amazon-section/50 border border-amazon-border rounded-xl text-xs font-bold text-amazon-text placeholder-amazon-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-amazon-accent/30 transition" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {users.map((u, i) => (
              <motion.div key={i}
                whileHover={{ x: 3 }}
                onClick={() => setSelectedUser(u.userId)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all
                  ${selectedUser === u.userId
                    ? "bg-amazon-section border border-amazon-border shadow-sm"
                    : "hover:bg-amazon-section/50"}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0
                  ${selectedUser === u.userId ? "bg-amazon-accent text-white" : "bg-amazon-section text-amazon-accent"}`}>
                  {u.userEmail ? u.userEmail[0].toUpperCase() : "?"}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className={`text-xs font-black truncate ${selectedUser === u.userId ? "text-amazon-text" : "text-amazon-accent"}`}>
                    {u.userEmail || "Anonymous"}
                  </p>
                  <p className="text-[10px] font-bold text-amazon-text-secondary uppercase tracking-widest">Open Thread</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CHAT AREA */}
        <div className={`${selectedUser ? "flex" : "hidden md:flex"} flex-1 flex-col bg-white`}>
          {!selectedUser ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
              <div className="w-16 h-16 bg-amazon-section text-amazon-accent rounded-2xl flex items-center justify-center mb-4">
                <MessageSquare size={28} />
              </div>
              <h3 className="text-lg font-black text-amazon-text">Select a Conversation</h3>
              <p className="text-amazon-text-secondary text-sm mt-1 max-w-[220px]">Click a user from the sidebar to start replying</p>
            </div>
          ) : (
            <>
              {/* CHAT HEADER */}
              <div className="p-4 border-b border-amazon-section flex items-center gap-3">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="md:hidden text-amazon-accent mr-1 font-bold text-lg leading-none"
                  aria-label="Back"
                >
                  ←
                </button>
                <div className="w-9 h-9 bg-amazon-accent text-white rounded-xl flex items-center justify-center font-black text-sm">
                  {users.find(u => u.userId === selectedUser)?.userEmail?.[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-black text-amazon-text text-sm leading-none mb-0.5">
                    {users.find(u => u.userId === selectedUser)?.userEmail}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-amazon-text-secondary uppercase tracking-widest">Online</span>
                  </div>
                </div>
              </div>

              {/* MESSAGES */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-amazon-section/20">
                <AnimatePresence>
                  {filteredMessages.map((m, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`flex ${m.sender === "user" ? "justify-start" : "justify-end"}`}>
                      <div className="max-w-[70%]">
                        <p className={`text-[10px] font-bold text-amazon-text-secondary uppercase tracking-widest mb-1 ${m.sender === "user" ? "text-left" : "text-right"}`}>
                          {m.sender === "user" ? "Customer" : "Admin Support"}
                        </p>
                        <div className={`px-4 py-3 rounded-2xl text-sm font-medium shadow-sm
                          ${m.sender === "user"
                            ? "bg-white text-amazon-text border border-amazon-border rounded-tl-none"
                            : "bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text rounded-tr-none"}`}>
                          {m.text}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* INPUT */}
              <div className="p-4 bg-white border-t border-amazon-section">
                <div className="flex items-center gap-3 bg-amazon-section/40 border border-amazon-border rounded-xl px-4 py-2 focus-within:border-amazon-accent focus-within:ring-2 focus-within:ring-amazon-accent/20 transition">
                  <input value={reply} onChange={e => setReply(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendReply()}
                    placeholder="Type a reply..."
                    className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-amazon-text placeholder-amazon-text-secondary/60" />
                  <motion.button onClick={sendReply}
                    whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                    className="bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text p-2.5 rounded-xl shadow-md shadow-black/10">
                    <Send size={15} strokeWidth={2.5} />
                  </motion.button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminMessages;
