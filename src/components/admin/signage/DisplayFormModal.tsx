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
    location?: string;
    resolution?: string;
    orientation?: 'LANDSCAPE' | 'PORTRAIT';
    status?: 'ONLINE' | 'OFFLINE' | 'ERROR';
  };
}

export default function DisplayFormModal({ open, onClose, onSaved, initial }: Props) {
  const [form, setForm] = useState({
    name: '',
    location: '',
    resolution: '1920x1080',
    orientation: 'LANDSCAPE' as 'LANDSCAPE' | 'PORTRAIT',
    status: 'OFFLINE' as 'ONLINE' | 'OFFLINE' | 'ERROR',
  });
  const [errors, setErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || '',
        location: initial.location || '',
        resolution: initial.resolution || '1920x1080',
        orientation: initial.orientation || 'LANDSCAPE',
        status: initial.status || 'OFFLINE',
      });
    } else {
      setForm({ name: '', location: '', resolution: '1920x1080', orientation: 'LANDSCAPE', status: 'OFFLINE' });
    }
  }, [initial, open]);

  if (!open) return null;

  const validate = () => {
    const e: any = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.resolution.trim()) e.resolution = 'Resolution is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const method = initial?.id ? 'PUT' : 'POST';
      const payload: any = initial?.id ? { type: 'display', id: initial.id, ...form } : { type: 'display', ...form };
      const res = await fetch('/api/admin/digital-signage', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save display');
      await onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save display');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 w-full max-w-2xl rounded-lg border border-gray-700 max-h-[95vh] flex flex-col">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-700 flex-shrink-0">
          <h3 className="text-lg sm:text-xl font-semibold text-white">{initial?.id ? 'Edit' : 'Add'} Display</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Name *</label>
                <input
                  className={`w-full px-3 py-2 rounded-lg bg-gray-700 text-white border ${errors.name ? 'border-red-500' : 'border-gray-600'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Main Lobby Display"
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Location</label>
                <input
                  className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g., Main Entrance, Hall A"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Resolution *</label>
                <input
                  className={`w-full px-3 py-2 rounded-lg bg-gray-700 text-white border ${errors.resolution ? 'border-red-500' : 'border-gray-600'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  value={form.resolution}
                  onChange={e => setForm({ ...form, resolution: e.target.value })}
                  placeholder="1920x1080"
                />
                {errors.resolution && <p className="text-xs text-red-400 mt-1">{errors.resolution}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Orientation</label>
                <select
                  className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.orientation}
                  onChange={e => setForm({ ...form, orientation: e.target.value as any })}
                >
                  <option value="LANDSCAPE">Landscape</option>
                  <option value="PORTRAIT">Portrait</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Status</label>
                <select
                  className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value as any })}
                >
                  <option value="OFFLINE">Offline</option>
                  <option value="ONLINE">Online</option>
                  <option value="ERROR">Error</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        <div className="flex-shrink-0 p-4 sm:p-6 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors order-2 sm:order-1"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-colors order-1 sm:order-2 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving…
                </>
              ) : (
                'Save Display'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

