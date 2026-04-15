import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../services/api";
import { FaCloudUploadAlt, FaFileCsv, FaDownload, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const CSV_TEMPLATE = `name,category,price,stock,description,discount,imageUrl
Sample Product 1,Electronics,999,50,A great electronics product,5,https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400
Sample Product 2,Fashion,499,100,A stylish fashion item,10,https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400
`;

function downloadTemplate() {
  const blob = new Blob([CSV_TEMPLATE], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "product_template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function BulkUploadTab() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null); // { success, count } or { errors }
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    if (!f.name.endsWith(".csv")) {
      setResult({ errors: [{ row: "-", field: "file", message: "Only CSV files are accepted" }] });
      return;
    }
    setFile(f);
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setResult(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await API.post("/seller/products/bulk-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult({ success: true, count: res.data.count });
      setFile(null);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        setResult({ errors: data.errors });
      } else {
        setResult({ errors: [{ row: "-", field: "-", message: data?.message || "Upload failed" }] });
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Template Download */}
      <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-2xl px-5 py-3">
        <div>
          <p className="text-sm font-semibold text-blue-700">Need a template?</p>
          <p className="text-xs text-blue-500">Download our CSV template with required columns (includes imageUrl)</p>
        </div>
        <button
          onClick={downloadTemplate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
        >
          <FaDownload size={11} />
          Download Template
        </button>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all
          ${dragging ? "border-amazon-accent bg-amber-50 scale-[1.01]" : "border-gray-200 bg-gray-50 hover:border-amazon-accent hover:bg-amber-50/30"}`}
      >
        <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={e => handleFile(e.target.files[0])} />
        <motion.div
          animate={{ y: dragging ? -4 : 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <FaCloudUploadAlt className={`text-5xl ${dragging ? "text-amazon-accent" : "text-gray-300"} transition-colors`} />
        </motion.div>
        {file ? (
          <div className="flex items-center gap-2 bg-white border border-amazon-border rounded-xl px-4 py-2 shadow-sm">
            <FaFileCsv className="text-emerald-500 text-lg" />
            <div>
              <p className="text-sm font-semibold text-gray-700">{file.name}</p>
              <p className="text-xs text-gray-400">{formatBytes(file.size)}</p>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm font-semibold text-gray-600">Drag & drop your CSV here</p>
            <p className="text-xs text-gray-400">or click to browse — max 5MB, up to 500 rows</p>
          </>
        )}
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full py-3 rounded-xl bg-amazon-accent text-white font-bold text-sm hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
      >
        {uploading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <FaCloudUploadAlt />
            Upload Products
          </>
        )}
      </button>

      {/* Results */}
      <AnimatePresence>
        {result?.success && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4"
          >
            <FaCheckCircle className="text-emerald-500 text-xl flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-700">Upload Successful!</p>
              <p className="text-xs text-emerald-600">{result.count} product{result.count !== 1 ? "s" : ""} added to your inventory</p>
            </div>
          </motion.div>
        )}

        {result?.errors && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <FaTimesCircle className="text-red-500 text-lg" />
              <p className="text-sm font-bold text-red-700">Upload Failed — {result.errors.length} error{result.errors.length !== 1 ? "s" : ""} found</p>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {result.errors.map((e, i) => (
                <div key={i} className="flex items-start gap-2 bg-white border border-red-100 rounded-xl px-3 py-2">
                  <span className="text-xs font-bold text-red-400 bg-red-50 px-1.5 py-0.5 rounded-md flex-shrink-0">Row {e.row}</span>
                  <span className="text-xs text-red-600">
                    <span className="font-semibold">{e.field}</span>: {e.message}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
