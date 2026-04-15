import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../services/api";
import { Mail, Clock, CheckCircle, XCircle, Send, ChevronDown, ChevronUp, Search, AlertTriangle, RefreshCw } from "lucide-react";

const STATUS_CONFIG = {
  open:    { label: "Open",    color: "bg-amber-100 text-amber-700 border-amber-200",   dot: "bg-amber-400" },
  replied: { label: "Replied", color: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-400" },
  closed:  { label: "Closed",  color: "bg-gray-100 text-gray-500 border-gray-200",      dot: "bg-gray-400" },
};

function getPriority(query) {
  const age = (Date.now() - new Date(query.createdAt)) / 3600000; // hours
  if (query.status === "open" && age > 48) return { label: "Urgent", cls: "bg-red-50 text-red-500 border-red-200", icon: "🔴" };
  if (query.status === "open" && age > 24) return { label: "High",   cls: "bg-orange-50 text-orange-500 border-orange-200", icon: "🟠" };
  if (query.status === "open")             return { label: "Normal",  cls: "bg-blue-50 text-blue-500 border-blue-200", icon: "🔵" };
  return null;
}

function timeAgo(date) {
  const diff = Date.now() - new Date(date);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const QUICK_REPLIES = [
  "Thank you for reaching out! We've received your query and will get back to you within 24 hours.",
  "We apologize for the inconvenience. Our team is looking into this and will resolve it shortly.",
  "Your order has been processed successfully. Please allow 3–5 business days for delivery.",
  "We've issued a refund to your original payment method. It may take 5–7 business days to reflect.",
];

function QueryCard({ query, onReply, onStatusChange, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [reply, setReply] = useState(query.adminReply || "");
  const [sending, setSending] = useState(false);
  const cfg = STATUS_CONFIG[query.status] || STATUS_CONFIG.open;
  const priority = getPriority(query);

  const handleReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    await onReply(query._id, reply);
    setSending(false);
  };

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
      className={`bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
        query.status === "open" ? "border-amazon-border" : "border-amazon-border/60"
      }`}>

      {/* HEADER */}
      <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-amazon-section/20 transition"
        onClick={() => setExpanded(!expanded)}>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amazon-accent to-amazon-accent-hover text-white flex items-center justify-center font-black text-sm flex-shrink-0">
          {query.name?.[0]?.toUpperCase() || "?"}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <p className="text-sm font-black text-amazon-text">{query.name}</p>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.color}`}>{cfg.label}</span>
            {priority && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priority.cls}`}>
                {priority.icon} {priority.label}
              </span>
            )}
          </div>
          <p className="text-xs text-amazon-accent truncate">{query.email}</p>
          <p className="text-xs text-amazon-text-secondary mt-0.5 line-clamp-1 italic">"{query.message}"</p>
        </div>

        {/* Time */}
        <div className="text-right flex-shrink-0 hidden sm:block">
          <p className="text-xs font-medium text-amazon-text">{timeAgo(query.createdAt)}</p>
          <p className="text-[10px] text-amazon-text-secondary">{new Date(query.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
          {query.repliedAt && (
            <p className="text-[10px] text-emerald-600 mt-0.5">Replied {timeAgo(query.repliedAt)}</p>
          )}
        </div>

        <div className="text-amazon-text-secondary ml-1 flex-shrink-0">
          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </div>
      </div>

      {/* EXPANDED */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <div className="px-5 pb-5 border-t border-amazon-section space-y-4 pt-4">

              {/* User message */}
              <div>
                <p className="text-[10px] font-black text-amazon-text-secondary uppercase tracking-widest mb-2">Customer Message</p>
                <div className="bg-amazon-section/50 border border-amazon-border rounded-xl p-4 text-sm text-amazon-text leading-relaxed">
                  {query.message}
                </div>
                <p className="text-[10px] text-amazon-text-secondary mt-1">
                  Sent {new Date(query.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>

              {/* Existing reply */}
              {query.adminReply && (
                <div>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Your Reply</p>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800 leading-relaxed">
                    {query.adminReply}
                  </div>
                  {query.repliedAt && (
                    <p className="text-[10px] text-amazon-text-secondary mt-1">
                      Replied {new Date(query.repliedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  )}
                </div>
              )}

              {/* Quick replies */}
              {query.status !== "closed" && (
                <div>
                  <p className="text-[10px] font-black text-amazon-text-secondary uppercase tracking-widest mb-2">Quick Replies</p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_REPLIES.map((qr, i) => (
                      <button key={i} onClick={() => setReply(qr)}
                        className="text-[11px] bg-amazon-section border border-amazon-border text-amazon-text px-3 py-1.5 rounded-lg hover:border-amazon-accent hover:bg-white transition font-medium text-left max-w-[220px] truncate">
                        {qr.slice(0, 40)}…
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Reply textarea */}
              {query.status !== "closed" && (
                <div>
                  <p className="text-[10px] font-black text-amazon-text-secondary uppercase tracking-widest mb-2">
                    {query.adminReply ? "Update Reply" : "Write Reply"}
                  </p>
                  <textarea value={reply} onChange={e => setReply(e.target.value)} rows={3}
                    placeholder="Type your reply to the customer..."
                    className="w-full bg-amazon-section/40 border border-amazon-border rounded-xl px-4 py-3 text-sm text-amazon-text placeholder-amazon-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-amazon-accent/30 focus:border-amazon-accent transition resize-none" />
                  <p className="text-[10px] text-amazon-text-secondary text-right mt-0.5">{reply.length} chars</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                {query.status !== "closed" && (
                  <motion.button onClick={handleReply} disabled={sending || !reply.trim()}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-amazon-accent hover:bg-amazon-accent-hover text-white text-xs font-black rounded-xl shadow-sm disabled:opacity-50">
                    {sending
                      ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                      : <Send size={13} />}
                    {query.adminReply ? "Update Reply" : "Send Reply"}
                  </motion.button>
                )}

                {query.status !== "closed" && (
                  <button onClick={() => onStatusChange(query._id, "closed")}
                    className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold text-gray-500 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition">
                    <XCircle size={13} /> Close
                  </button>
                )}
                {query.status === "closed" && (
                  <button onClick={() => onStatusChange(query._id, "open")}
                    className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition">
                    <RefreshCw size={13} /> Reopen
                  </button>
                )}
                <button onClick={() => onDelete(query._id)}
                  className="ml-auto flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold text-red-500 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition">
                  🗑 Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AdminQueries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => { fetchQueries(); }, []);

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const res = await API.get("/contact");
      setQueries(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleReply = async (id, adminReply) => {
    try {
      const res = await API.put(`/contact/${id}/reply`, { adminReply });
      setQueries(prev => prev.map(q => q._id === id ? res.data : q));
    } catch (e) { console.error(e); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await API.put(`/contact/${id}/status`, { status });
      setQueries(prev => prev.map(q => q._id === id ? res.data : q));
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this query?")) return;
    try {
      await API.delete(`/contact/${id}`);
      setQueries(prev => prev.filter(q => q._id !== id));
    } catch { alert("Delete failed"); }
  };

  const counts = useMemo(() => ({
    all: queries.length,
    open: queries.filter(q => q.status === "open").length,
    replied: queries.filter(q => q.status === "replied").length,
    closed: queries.filter(q => q.status === "closed").length,
    urgent: queries.filter(q => {
      const age = (Date.now() - new Date(q.createdAt)) / 3600000;
      return q.status === "open" && age > 48;
    }).length,
  }), [queries]);

  const avgResponseTime = useMemo(() => {
    const replied = queries.filter(q => q.repliedAt && q.createdAt);
    if (!replied.length) return null;
    const avg = replied.reduce((s, q) => s + (new Date(q.repliedAt) - new Date(q.createdAt)), 0) / replied.length;
    const h = Math.floor(avg / 3600000);
    return h < 24 ? `${h}h` : `${Math.floor(h / 24)}d`;
  }, [queries]);

  const filtered = useMemo(() => {
    let list = [...queries];
    if (filter !== "all") list = list.filter(q => q.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(x =>
        x.name?.toLowerCase().includes(q) ||
        x.email?.toLowerCase().includes(q) ||
        x.message?.toLowerCase().includes(q)
      );
    }
    if (sortBy === "newest") list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sortBy === "oldest") list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sortBy === "urgent") list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return list;
  }, [queries, filter, search, sortBy]);

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="flex items-center justify-between pb-5 border-b border-amazon-section">
        <div>
          <h2 className="text-3xl font-black text-amazon-text">Contact Queries<span className="text-amazon-accent">.</span></h2>
          <p className="text-amazon-accent text-sm mt-0.5">View and reply to customer contact form submissions</p>
        </div>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          onClick={fetchQueries}
          className="flex items-center gap-2 bg-amazon-section border border-amazon-border text-amazon-text text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-amazon-border transition">
          <RefreshCw size={14} /> Refresh
        </motion.button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { key: "all",     label: "Total",    icon: <Mail size={15} />,        color: "text-amazon-accent bg-amazon-section",  val: counts.all },
          { key: "open",    label: "Open",     icon: <Clock size={15} />,       color: "text-amber-600 bg-amber-50",            val: counts.open },
          { key: "replied", label: "Replied",  icon: <CheckCircle size={15} />, color: "text-emerald-600 bg-emerald-50",        val: counts.replied },
          { key: "closed",  label: "Closed",   icon: <XCircle size={15} />,     color: "text-gray-500 bg-gray-100",             val: counts.closed },
          { key: "urgent",  label: "Urgent",   icon: <AlertTriangle size={15} />, color: "text-red-500 bg-red-50",              val: counts.urgent },
        ].map(s => (
          <motion.button key={s.key} whileHover={{ y: -2 }}
            onClick={() => s.key !== "urgent" && setFilter(s.key)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              filter === s.key ? "border-amazon-accent bg-white shadow-md" : "border-amazon-border bg-white hover:shadow-sm"
            }`}>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-2 ${s.color}`}>{s.icon}</div>
            <p className="text-2xl font-black text-amazon-text">{s.val}</p>
            <p className="text-xs text-amazon-accent font-semibold">{s.label}</p>
          </motion.button>
        ))}
      </div>

      {/* AVG RESPONSE TIME */}
      {avgResponseTime && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 text-sm text-emerald-700 font-medium">
          <CheckCircle size={14} /> Avg response time: <strong>{avgResponseTime}</strong>
        </div>
      )}

      {/* URGENT BANNER */}
      {counts.urgent > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 font-medium">
          <AlertTriangle size={15} />
          {counts.urgent} quer{counts.urgent > 1 ? "ies" : "y"} waiting over 48 hours — needs urgent attention
        </motion.div>
      )}

      {/* SEARCH + SORT */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amazon-text-secondary" size={14} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email or message..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-amazon-border rounded-xl text-sm text-amazon-text placeholder-amazon-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-amazon-accent/30 transition" />
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="bg-white border border-amazon-border text-amazon-text text-sm font-medium px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-amazon-accent/30">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="urgent">Most Urgent</option>
        </select>
      </div>

      {/* FILTER PILLS */}
      <div className="flex gap-2 flex-wrap">
        {["all","open","replied","closed"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all capitalize ${
              filter === s ? "bg-amazon-accent text-white border-amazon-accent" : "bg-white text-amazon-text-secondary border-amazon-border hover:border-amazon-accent"
            }`}>
            {s} ({counts[s] ?? 0})
          </button>
        ))}
      </div>

      <p className="text-xs text-amazon-accent font-medium">Showing {filtered.length} of {queries.length} queries</p>

      {/* LIST */}
      {loading ? (
        <div className="flex justify-center py-16">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
            className="w-8 h-8 border-4 border-amazon-border border-t-amazon-accent rounded-full" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-amazon-accent">
          <Mail size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-bold text-amazon-text">No queries found</p>
          <p className="text-sm mt-1">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map(q => (
              <QueryCard key={q._id} query={q} onReply={handleReply} onStatusChange={handleStatusChange} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
