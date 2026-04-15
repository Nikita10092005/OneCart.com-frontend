import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../services/api";
import { FaWallet, FaSync } from "react-icons/fa";

const PAGE_SIZE = 10;

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    processed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${styles[status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
      {status}
    </span>
  );
}

export default function PayoutsTab() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const [page, setPage] = useState(1);

  const fetchPayouts = () => {
    setLoading(true);
    API.get("/seller/payouts")
      .then(r => setPayouts(r.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPayouts(); }, []);

  const handleSync = async () => {
    setSyncing(true);
    setSyncMsg("");
    try {
      const res = await API.post("/seller/payouts/backfill");
      setSyncMsg(res.data.message);
      fetchPayouts();
    } catch {
      setSyncMsg("Sync failed");
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMsg(""), 4000);
    }
  };

  const totalPages = Math.ceil(payouts.length / PAGE_SIZE);
  const paginated = payouts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-2 border-amazon-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with sync button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{payouts.length} payout record{payouts.length !== 1 ? "s" : ""}</p>
        <div className="flex items-center gap-3">
          {syncMsg && <span className="text-xs text-emerald-600 font-medium">{syncMsg}</span>}
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-1.5 px-3 py-2 bg-amazon-accent hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors"
          >
            <FaSync className={syncing ? "animate-spin" : ""} size={10} />
            Sync Payouts
          </button>
        </div>
      </div>

      {!payouts.length ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 gap-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center">
            <FaWallet className="text-3xl text-amber-400" />
          </div>
          <p className="text-gray-500 font-medium">No payouts yet</p>
          <p className="text-sm text-gray-400">Click "Sync Payouts" to generate payouts from delivered orders</p>
        </motion.div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-amazon-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left text-xs text-gray-400 uppercase tracking-wide">
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Order ID</th>
                    <th className="px-5 py-3 text-right">Amount</th>
                    <th className="px-5 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {paginated.map((p, i) => (
                      <motion.tr
                        key={p._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-5 py-3.5 text-gray-600">
                          {new Date(p.payoutDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-gray-500 text-xs">
                          ...{String(p.orderId).slice(-8)}
                        </td>
                        <td className="px-5 py-3.5 text-right font-bold text-gray-800">
                          ₹{(p.amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <StatusBadge status={p.status} />
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, payouts.length)} of {payouts.length}
              </p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition">Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button key={n} onClick={() => setPage(n)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${n === page ? "bg-amazon-accent text-white border-amazon-accent" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                    {n}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition">Next</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
