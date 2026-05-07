import React, { useState } from 'react';
import client from '../api/client';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus({ type: '', msg: '' });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setStatus({ type: '', msg: '' });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await client.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatus({ type: 'success', msg: res.data.msg });
      setFile(null);
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.msg || 'Upload failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Data Intelligence Hub</h1>
        <p className="text-gray-500">Upload your sales data (.csv, .xlsx) for advanced analysis.</p>
      </div>

      <div className="glass-card rounded-2xl p-8 text-center">
        {!file ? (
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 hover:border-accent transition-colors cursor-pointer group">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
              accept=".csv, .xlsx, .xls"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-slate-50 rounded-full group-hover:bg-accent/10 transition-colors">
                  <UploadCloud size={48} className="text-slate-400 group-hover:text-accent" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-primary">Click to select or drag and drop</p>
                  <p className="text-sm text-gray-400 mt-1">Supported formats: CSV, Excel (.xlsx, .xls)</p>
                </div>
              </div>
            </label>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="p-6 bg-accent/10 rounded-2xl flex items-center gap-4 w-full max-w-md border border-accent/20">
              <div className="p-3 bg-accent rounded-xl text-white">
                <FileText size={24} />
              </div>
              <div className="text-left flex-1 truncate">
                <p className="font-bold text-primary truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
              <button 
                onClick={() => setFile(null)}
                className="p-2 hover:text-red-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
            
            <button
              onClick={handleUpload}
              disabled={loading}
              className="px-8 py-3 bg-secondary text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-secondary/20 disabled:opacity-50"
            >
              {loading ? 'PROCESSING DATA...' : 'INITIALIZE UPLOAD'}
            </button>
          </div>
        )}

        {status.msg && (
          <div className={`mt-8 p-4 rounded-xl flex items-center gap-3 text-left ${
            status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
          }`}>
            {status.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
            <span className="font-medium">{status.msg}</span>
          </div>
        )}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-primary mb-2">Automated Cleaning</h3>
          <p className="text-sm text-gray-500 italic">Our AI-driven engine handles null values and formatting automatically.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-primary mb-2">Secure Storage</h3>
          <p className="text-sm text-gray-500 italic">Data is encrypted and stored in your private secure vault.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-primary mb-2">Instant Analytics</h3>
          <p className="text-sm text-gray-500 italic">Charts and KPIs update in real-time as soon as processing finishes.</p>
        </div>
      </div>
    </div>
  );
};

export default Upload;
