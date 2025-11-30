import React, { useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../lib/api';

export default function ImageUploader({ onUploaded, onRemove, multiple = true }) {
  const { isAdmin } = useAuth();
  const [files, setFiles] = useState([]); // array of urls
  const [progress, setProgress] = useState({}); // filename -> percent
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const normalizeUrl = (u) => (u && (u.startsWith('/') ? u : u));

  const uploadFile = async (file) => {
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await api.post('/uploads', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (ev) => {
          const pct = Math.round((ev.loaded * 100) / (ev.total || 1));
          setProgress((p) => ({ ...p, [file.name]: pct }));
        }
      });
      const json = res.data;
      const url = json?.meta?.files?.webp || json?.meta?.files?.jpg || json?.meta?.files?.png;
      const finalUrl = url ? (url.startsWith('/') ? url : `/${url}`) : null;
      if (finalUrl) {
        setFiles((prev) => multiple ? prev.concat(finalUrl) : [finalUrl]);
        if (onUploaded) onUploaded(multiple ? [finalUrl] : finalUrl);
      }
    } catch (err) {
      console.error('Upload error', err?.response || err.message || err);
      const message = err?.response?.data?.error || err?.response?.data?.message || err.message || 'Erro ao enviar imagem';
      alert(message);
    } finally {
      setProgress((p) => ({ ...p, [file.name]: 100 }));
    }
  };

  const handleFiles = async (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;
    if (!isAdmin) return alert('Você precisa ser admin para enviar imagens.');
    setUploading(true);
    try {
      for (const f of selected) await uploadFile(f);
    } finally { setUploading(false); }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dtFiles = Array.from(e.dataTransfer.files || []);
    if (dtFiles.length === 0) return;
    if (!isAdmin) return alert('Você precisa ser admin para enviar imagens.');
    setUploading(true);
    try { for (const f of dtFiles) await uploadFile(f); } finally { setUploading(false); }
  };

  const handleDragOver = (e) => { e.preventDefault(); };

  const handleDragEnter = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };

  const handleRemove = useCallback(async (url) => {
    try {
      const parts = url.split('/');
      const filename = parts[parts.length - 1];
      await api.delete(`/uploads/${filename}`);
      setFiles((prev) => prev.filter((u) => u !== url));
      if (onRemove) onRemove(url);
    } catch (err) {
      console.error('Delete error', err?.response || err.message || err);
      alert('Erro ao excluir a imagem');
    }
  }, [onRemove]);

  return (
    <div className="space-y-2">
      <div
        className={`p-4 border ${isDragging ? 'border-indigo-300 bg-indigo-50' : 'border-dashed bg-white'} rounded`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <label className="block cursor-pointer">
          <input type="file" accept="image/*" multiple={multiple} onChange={handleFiles} className="hidden" />
          <div className="text-sm text-gray-700">Arraste imagens aqui ou clique para selecionar</div>
        </label>
      </div>

      {uploading && <p>Enviando...</p>}

      {files.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {files.map((f, i) => {
            const fname = f.split('/').pop();
            const pct = progress[fname] || progress[f] || 0;
            return (
              <div key={i} className="relative border rounded overflow-hidden bg-white">
                <img src={f} alt={`upload-${i}`} className="w-28 h-28 object-cover" />
                <button type="button" onClick={() => handleRemove(f)} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow">✕</button>
                {pct > 0 && pct < 100 && (
                  <div className="absolute left-0 right-0 bottom-0 h-1 bg-gray-200">
                    <div style={{ width: `${pct}%` }} className="h-1 bg-green-500" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
