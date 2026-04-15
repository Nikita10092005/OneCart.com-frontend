import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBriefcase, FaReply, FaTimes, FaCheckCircle } from "react-icons/fa";
import API from "../../services/api";

const STATUS_STYLES = {
  pending:     "bg-amber-100 text-amber-700 border-amber-200",
  reviewed:    "bg-blue-100 text-blue-700 border-blue-200",
  shortlisted: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected:    "bg-red-100 text-red-700 border-red-200",
};

export default function AdminJobApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState("reviewed");
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    API.get("/jobs")
      .then(r => setApps(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openReply = (app) => {
    setSelected(app);
    setReplyText(app.adminReply || "");
    setReplyStatus(app.status === "pending" ? "reviewed" : app.status);
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setSending(true);
    try {
      const res = await API.put(`/jobs/${selected._id}/reply`, { adminReply: replyText, status: replyStatus });
      setApps(prev => prev.map(a => a._id === selected._id ? res.data.app : a));
      showToast("Reply sent and user notified!");
      setSelected(null);
    } catch {
      showToast("Failed to send reply", "error");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-2 border-amazon-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amazon-accent/10 flex items-center justify-center text-amazon-accent">
            <FaBriefcase size={18} />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-amazon-text">Job Applications</h2>
            <p className="text-xs text-amazon-text-secondary">{apps.filter(a => a.status === "pending").length} pending review</p>
          </div>
        </div>

        {apps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-amazon-text-secondary">
            <FaBriefcase size={40} className="opacity-20" />
            <p className="font-medium">No applications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {apps.map((app, i) => (
              <motion.div key={app._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-amazon-section rounded-2xl border border-amazon-border p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <h3 className="text-sm font-bold text-amazon-text">{app.name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${STATUS_STYLES[app.status]}`}>{app.status}</span>
                      <span className="text-xs bg-amazon-accent/10 text-amazon-accent font-semibold px-2.5 py-0.5 rounded-full">{app.position}</span>
                    </div>
                    <p className="text-xs text-amazon-text-secondary">{app.email} · {app.phone}</p>
                    <p className="text-xs text-amazon-text-secondary mt-1">Experience: {app.experience} · Education: {app.education}</p>
                    <p className="text-xs text-amazon-text-secondary mt-1">Skills: <span className="text-amazon-text font-medium">{app.skills}</span></p>
                    {app.portfolio && <p className="text-xs text-blue-500 mt-1 truncate">{app.portfolio}</p>}
                    <div className="mt-3 bg-white rounded-xl border border-amazon-border p-3">
                      <p className="text-xs font-semibold text-amazon-text-secondary mb-1">Cover Letter</p>
                      <p className="text-xs text-amazon-text leading-relaxed line-clamp-3">{app.coverLetter}</p>
                    </div>
                    {app.adminReply && (
                      <div className="mt-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                        <p className="text-xs font-semibold text-emerald-700 mb-1">Your Reply</p>
                        <p className="text-xs text-emerald-800 leading-relaxed">{app.adminReply}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-xs text-amazon-text-secondary">{new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                    <button onClick={() => openReply(app)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-amazon-accent hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition">
                      <FaReply size={10} /> {app.adminReply ? "Update Reply" : "Reply"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Reply Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-extrabold text-amazon-text">Reply to {selected.name}</h3>
                <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg bg-amazon-section flex items-center justify-center hover:bg-amazon-border transition">
                  <FaTimes size={12} />
                </button>
              </div>
              <p className="text-xs text-amazon-text-secondary mb-4">Applied for: <span className="font-semibold text-amazon-text">{selected.position}</span></p>

              <div className="mb-3">
                <label className="text-xs font-semibold text-amazon-text mb-1 block">Update Status</label>
                <select value={replyStatus} onChange={e => setReplyStatus(e.target.value)}
                  className="w-full border border-amazon-border rounded-xl px-4 py-2.5 text-sm text-amazon-text focus:outline-none focus:border-amazon-accent transition">
                  <option value="reviewed">Reviewed</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="text-xs font-semibold text-amazon-text mb-1 block">Your Message *</label>
                <textarea
                  rows={5}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Write your response to the applicant..."
                  className="w-full border border-amazon-border rounded-xl px-4 py-3 text-sm text-amazon-text focus:outline-none focus:border-amazon-accent transition resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setSelected(null)}
                  className="flex-1 border border-amazon-border text-amazon-text font-semibold py-2.5 rounded-xl text-sm hover:bg-amazon-section transition">
                  Cancel
                </button>
                <button onClick={handleReply} disabled={sending || !replyText.trim()}
                  className="flex-1 bg-amazon-accent hover:bg-amber-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2">
                  {sending ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FaCheckCircle size={12} />}
                  Send Reply
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
