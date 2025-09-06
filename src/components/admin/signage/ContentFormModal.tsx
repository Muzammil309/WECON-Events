'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
  initial?: {
    id?: string;
    name?: string;
    type?: 'IMAGE' | 'VIDEO' | 'TEXT';
    url?: string;
    contentText?: string;
    duration?: number;
    status?: 'DRAFT' | 'ACTIVE' | 'SCHEDULED';
  };
}

export default function ContentFormModal({ open, onClose, onSaved, initial }: Props) {
  const [form, setForm] = useState({
    name: '',
    type: 'IMAGE' as 'IMAGE' | 'VIDEO' | 'TEXT',
    url: '',
    contentText: '',
    duration: 10,
    status: 'DRAFT' as 'DRAFT' | 'ACTIVE' | 'SCHEDULED',
  });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || '',
        type: initial.type || 'IMAGE',
        url: initial.url || '',
        contentText: initial.contentText || '',
        duration: initial.duration || 10,
        status: initial.status || 'DRAFT',
      });
    } else {
      setForm({ name: '', type: 'IMAGE', url: '', contentText: '', duration: 10, status: 'DRAFT' });
      setFile(null);
    }
  }, [initial, open]);

  if (!open) return null;

  const validate = () => {
    const e: any = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (form.type !== 'TEXT') {
      if (!initial?.id && !file) e.file = 'File is required';
    } else {
      if (!form.contentText.trim()) e.contentText = 'Text content is required';
    }
    if (form.duration < 1) e.duration = 'Duration must be at least 1s';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const uploadFile = async (): Promise<string | undefined> => {
    if (!file) return form.url || undefined;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'signage-content');

      const response = await fetch('/api/admin/digital-signage/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await response.json();
      return result.url;
    } catch (error: any) {
      throw new Error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const uploadedUrl = await uploadFile();
      const method = initial?.id ? 'PUT' : 'POST';
      const payload: any = initial?.id
        ? { type: 'content', id: initial.id, ...form, url: uploadedUrl }
        : { type: 'content', ...form, url: uploadedUrl };
      const res = await fetch('/api/admin/digital-signage', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save content');
      await onSaved();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Failed to save content');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 w-full max-w-2xl rounded-lg border border-gray-700 max-h-[95vh] flex flex-col">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-700 flex-shrink-0">
          <h3 className="text-lg sm:text-xl font-semibold text-white">{initial?.id ? 'Edit' : 'Upload'} Content</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Name *</label>
              <input
                className={`w-full px-3 py-2 rounded-lg bg-gray-700 text-white border ${errors.name ? 'border-red-500' : 'border-gray-600'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Welcome Banner, Event Schedule"
              />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Type *</label>
                <select
                  className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value as any })}
                >
                  <option value="IMAGE">Image</option>
                  <option value="VIDEO">Video</option>
                  <option value="TEXT">Text</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Duration (seconds) *</label>
                <input
                  type="number"
                  min={1}
                  className={`w-full px-3 py-2 rounded-lg bg-gray-700 text-white border ${errors.duration ? 'border-red-500' : 'border-gray-600'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  value={form.duration}
                  onChange={e => setForm({ ...form, duration: Number(e.target.value) })}
                  placeholder="10"
                />
                {errors.duration && <p className="text-xs text-red-400 mt-1">{errors.duration}</p>}
              </div>
            </div>

            {form.type !== 'TEXT' ? (
              <div>
                <label className="block text-sm text-gray-300 mb-2">File *</label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
                  <input
                    type="file"
                    accept={form.type === 'IMAGE' ? 'image/*' : 'video/*'}
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    disabled={uploading || submitting}
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    {form.type === 'IMAGE' ? 'Upload JPG, PNG, GIF, or WebP' : 'Upload MP4, WebM, or OGG'}
                  </p>
                  <p className="text-xs text-gray-500">Maximum file size: 50MB</p>
                </div>
                {uploading && (
                  <div className="mt-3 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                    <div className="flex items-center gap-3 text-sm text-blue-400">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                      <span>Uploading file...</span>
                    </div>
                  </div>
                )}
                {errors.file && <p className="text-xs text-red-400 mt-2">{errors.file}</p>}
              </div>
            ) : (
              <div>
                <label className="block text-sm text-gray-300 mb-2">Text Content *</label>
                <textarea
                  className={`w-full px-3 py-2 rounded-lg bg-gray-700 text-white border ${errors.contentText ? 'border-red-500' : 'border-gray-600'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  value={form.contentText}
                  onChange={e => setForm({ ...form, contentText: e.target.value })}
                  rows={6}
                  placeholder="Enter the text content to display on digital signage..."
                />
                {errors.contentText && <p className="text-xs text-red-400 mt-2">{errors.contentText}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-300 mb-2">Status</label>
              <select
                className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value as any })}
              >
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="SCHEDULED">Scheduled</option>
              </select>
            </div>
          </form>
        </div>

        <div className="flex-shrink-0 p-4 sm:p-6 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors order-2 sm:order-1"
              disabled={submitting || uploading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || uploading}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-colors order-1 sm:order-2 flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Uploading…
                </>
              ) : submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving…
                </>
              ) : (
                'Save Content'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

