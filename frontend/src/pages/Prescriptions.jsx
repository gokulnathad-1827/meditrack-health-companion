import React, { useState } from "react";
import { useHealth } from "../context/HealthContext";
import MainLayout from "../layouts/MainLayout";
import { FaFilePdf, FaFileImage, FaTrash, FaDownload, FaEye, FaPlus, FaCloudUploadAlt, FaTimes, FaHospital, FaFileMedical } from "react-icons/fa";

function Prescriptions() {
  const { prescriptions, uploadPrescription, deletePrescription } = useHealth();

  // Upload Form states
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState("pdf");
  const [dragActive, setDragActive] = useState(false);

  // Preview Modal states
  const [previewDoc, setPreviewDoc] = useState(null);

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!docName.trim()) {
      alert("Please provide a document name.");
      return;
    }

    const now = new Date();
    uploadPrescription({
      name: docName.trim() + (docType === "pdf" ? ".pdf" : ".jpg"),
      date: now.toISOString().split("T")[0],
      size: `${(Math.random() * 800 + 100).toFixed(0)} KB`,
      type: docType,
      url: docType === "pdf" ? "#" : "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800"
    });

    setDocName("");
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const extension = file.name.split(".").pop().toLowerCase();
      const type = (extension === "pdf") ? "pdf" : "image";
      
      const now = new Date();
      uploadPrescription({
        name: file.name,
        date: now.toISOString().split("T")[0],
        size: `${(file.size / 1024).toFixed(0)} KB`,
        type: type,
        url: type === "pdf" ? "#" : "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800"
      });
    }
  };

  const triggerDownload = (doc) => {
    alert(`Downloading ${doc.name}... (Mock File Download Successful)`);
  };

  return (
    <MainLayout>
      
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Prescriptions & Records</h1>
        <p className="text-xs text-slate-400 mt-1 font-semibold">Store clinical prescriptions, medical scan receipts and laboratory analysis PDF documents.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Drag and Drop Upload Form */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs h-fit">
          <h3 className="font-extrabold text-slate-800 mb-5 flex items-center gap-2">
            <FaCloudUploadAlt className="text-emerald-500 w-5 h-5" /> Upload Digital Document
          </h3>

          <form onSubmit={handleUploadSubmit} className="space-y-4">
            
            {/* Document Name */}
            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Document Title</label>
              <input
                type="text"
                placeholder="e.g. Allergy_Meds_Receipt"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border rounded-xl outline-hidden focus:border-emerald-500"
                required
              />
            </div>

            {/* Document Type Selection */}
            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Format</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full px-2.5 py-2.5 text-sm bg-slate-50 border rounded-xl cursor-pointer"
              >
                <option value="pdf">PDF Document (.pdf)</option>
                <option value="image">Scanned Image Receipt (.jpg/.png)</option>
              </select>
            </div>

            {/* Drag & Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition cursor-pointer ${
                dragActive 
                  ? "border-emerald-500 bg-emerald-50/20" 
                  : "border-slate-200 bg-slate-50 hover:border-emerald-500/50"
              }`}
            >
              <FaCloudUploadAlt className="mx-auto text-slate-350 w-10 h-10 mb-3" />
              <span className="text-xs text-slate-550 block font-bold">Drag and drop file here</span>
              <span className="text-[10px] text-slate-400 block mt-1">or click to browse local files</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              Upload & Save Document
            </button>
          </form>
        </div>

        {/* Prescription Storage List Grid */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
          <h3 className="font-extrabold text-slate-800 mb-6 flex items-center gap-2">
            <FaFileMedical className="text-emerald-500 w-4 h-4" /> Stored Prescriptions ({prescriptions.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prescriptions.map((doc) => (
              <div 
                key={doc.id} 
                className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5 hover:border-emerald-500/10 transition-all flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  {doc.type === "pdf" ? (
                    <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0 text-2xl">
                      <FaFilePdf />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 text-2xl">
                      <FaFileImage />
                    </div>
                  )}

                  <div className="truncate">
                    <h4 className="font-black text-slate-800 text-sm truncate" title={doc.name}>
                      {doc.name}
                    </h4>
                    <p className="text-[10px] text-slate-450 font-bold mt-1">
                      Uploaded &bull; {doc.date}
                    </p>
                    <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-sm mt-1.5 inline-block">
                      {doc.size}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-5 pt-3.5 border-t border-slate-205/60">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-bold"
                  >
                    <FaEye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => triggerDownload(doc)}
                      className="p-2 text-slate-450 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition"
                      title="Download Mock"
                    >
                      <FaDownload className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete prescription: "${doc.name}"?`)) {
                          deletePrescription(doc.id);
                        }
                      }}
                      className="p-2 text-slate-450 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Delete document"
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}

            {prescriptions.length === 0 && (
              <div className="col-span-2 text-center py-10 text-slate-405 font-bold">
                No uploaded records. Use the drag & drop pane to upload prescriptions.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* --- PREVIEW DOCUMENT MODAL --- */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg border border-slate-100 shadow-2xl p-6 relative">
            <button
              onClick={() => setPreviewDoc(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-650 transition"
            >
              <FaTimes />
            </button>
            
            <h3 className="text-lg font-black text-slate-850 mb-1 truncate pr-8">
              Document Preview: {previewDoc.name}
            </h3>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-4">
              Format: {previewDoc.type.toUpperCase()} File ({previewDoc.size})
            </span>

            {/* Document display screen */}
            <div className="bg-slate-100 border border-slate-200 rounded-2xl min-h-80 max-h-120 overflow-y-auto p-5 text-left font-mono text-xs text-slate-700 flex flex-col justify-between">
              {previewDoc.type === "pdf" ? (
                // Mock Clinical PDF structured display
                <div className="space-y-4 font-sans text-slate-750">
                  <div className="flex justify-between border-b-2 border-slate-350 pb-3">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                        <FaHospital className="text-emerald-500" /> City Cardiology Center
                      </h4>
                      <p className="text-[10px] text-slate-450 mt-0.5">102 Medical Pkwy, Suite 400</p>
                    </div>
                    <div className="text-right text-[10px] font-bold text-slate-400">
                      <p>DOC ID: RX-910283</p>
                      <p>Date: {previewDoc.date}</p>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-slate-900 font-black text-xs uppercase tracking-wider mb-2">Patient Details</h5>
                    <div className="grid grid-cols-2 gap-2 text-xs border bg-white p-3 rounded-xl">
                      <p><span className="text-slate-400 font-semibold">Name:</span> Gokul</p>
                      <p><span className="text-slate-400 font-semibold">Age/Sex:</span> 28 / Male</p>
                      <p><span className="text-slate-400 font-semibold">Blood Group:</span> O+</p>
                      <p><span className="text-slate-400 font-semibold">Ref:</span> Card-Annual</p>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-slate-900 font-black text-xs uppercase tracking-wider mb-2">Rx Prescriptions</h5>
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-start bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl text-xs">
                        <div>
                          <p className="font-extrabold text-emerald-950">Lisinopril 10mg</p>
                          <p className="text-[10px] text-slate-450 mt-0.5">Qty: 30 Tablets &bull; Sig: One tablet daily at 08:00 AM</p>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold">1 Refill left</span>
                      </div>
                      <div className="flex justify-between items-start bg-slate-200/20 border p-3 rounded-xl text-xs">
                        <div>
                          <p className="font-extrabold text-slate-900">Cetirizine 10mg</p>
                          <p className="text-[10px] text-slate-450 mt-0.5">Qty: 20 Tablets &bull; Sig: One tablet before sleep</p>
                        </div>
                        <span className="text-[10px] text-slate-450 font-bold">0 Refills</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right pt-6 border-t border-slate-350">
                    <p className="text-[10px] text-slate-400 font-semibold">Authorized Signature</p>
                    <p className="font-serif italic font-extrabold text-slate-700 text-sm mt-1">Dr. Sarah Jenkins</p>
                  </div>
                </div>
              ) : (
                // Display mock prescription receipt image container
                <div className="flex flex-col items-center justify-center flex-1 py-4 font-sans text-center">
                  <img
                    src={previewDoc.url}
                    alt="Prescription Scan View"
                    className="max-h-60 rounded-xl object-contain border shadow-sm"
                  />
                  <p className="text-xs text-slate-500 mt-4 leading-relaxed max-w-xs font-semibold">
                    Digital scanned photo check of active medications, validated on {previewDoc.date}.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2.5 mt-5">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition"
              >
                Close View
              </button>
              <button
                onClick={() => triggerDownload(previewDoc)}
                className="px-4 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl flex items-center gap-1.5 shadow-md"
              >
                <FaDownload />
                <span>Download Document</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </MainLayout>
  );
}

export default Prescriptions;
