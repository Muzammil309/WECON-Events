'use client';
import { useEffect, useState } from 'react';
import { X, GripVertical } from 'lucide-react';

interface ContentItem {
  id: string;
  name: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
  content: ContentItem[];
  initial?: { id?: string; name?: string; loop?: boolean; items?: { contentId: string; orderIndex?: number }[] };
}

export default function PlaylistFormModal({ open, onClose, onSaved, content, initial }: Props) {
  const [name, setName] = useState('');
  const [loop, setLoop] = useState(true);
  const [items, setItems] = useState<{ contentId: string; orderIndex?: number }[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initial) {
      setName(initial.name || '');
      setLoop(initial.loop ?? true);
      setItems(initial.items || []);
    } else {
      setName('');
      setLoop(true);
      setItems([]);
    }
  }, [initial, open]);

  if (!open) return null;

  const onAddContent = (contentId: string) => {
    setItems(prev => [...prev, { contentId, orderIndex: prev.length }]);
  };

  const onRemoveItem = (idx: number) => {
    setItems(prev => prev.filter((_, i) => i !== idx).map((it, i) => ({ ...it, orderIndex: i })));
  };

  const onMove = (from: number, to: number) => {
    setItems(prev => {
      const arr = [...prev];
      const [spliced] = arr.splice(from, 1);
      arr.splice(to, 0, spliced);
      return arr.map((it, i) => ({ ...it, orderIndex: i }));
    });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const method = initial?.id ? 'PUT' : 'POST';
      const payload: any = initial?.id
        ? { type: 'playlist', id: initial.id, name, loop, items }
        : { type: 'playlist', name, loop, items };
      const res = await fetch('/api/admin/digital-signage', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save playlist');
      await onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save playlist');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 w-full max-w-4xl rounded-lg border border-gray-700 max-h-[95vh] flex flex-col">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-700 flex-shrink-0">
          <h3 className="text-lg sm:text-xl font-semibold text-white">{initial?.id ? 'Edit' : 'Create'} Playlist</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <form onSubmit={save} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Name *</label>
                <input
                  className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g., Morning Announcements"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={loop}
                    onChange={e => setLoop(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span>Loop playlist</span>
                </label>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <div className="text-gray-300 mb-3 font-medium">Content Library:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
                {content.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onAddContent(c.id)}
                    className="px-3 py-2 rounded-lg bg-gray-600 text-gray-100 hover:bg-gray-500 transition-colors text-sm text-left"
                  >
                    + {c.name}
                  </button>
                ))}
              </div>

              <div className="text-gray-300 mb-3 font-medium">Playlist Items:</div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No items in playlist</p>
                    <p className="text-sm">Add content from the library above</p>
                  </div>
                ) : (
                  items.map((it, idx) => {
                    const c = content.find(x => x.id === it.contentId);
                    return (
                      <div key={idx} className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-lg p-3">
                        <div className="flex items-center gap-3 text-gray-200 flex-1 min-w-0">
                          <GripVertical className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-sm">{idx + 1}.</span>
                          <span className="truncate">{c?.name || it.contentId}</span>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            type="button"
                            onClick={() => idx > 0 && onMove(idx, idx - 1)}
                            className="px-2 py-1 rounded bg-gray-700 text-gray-200 hover:bg-gray-600 text-xs"
                            disabled={idx === 0}
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => idx < items.length - 1 && onMove(idx, idx + 1)}
                            className="px-2 py-1 rounded bg-gray-700 text-gray-200 hover:bg-gray-600 text-xs"
                            disabled={idx === items.length - 1}
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(idx)}
                            className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 text-xs"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
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
              onClick={save}
              disabled={submitting}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-colors order-1 sm:order-2 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving…
                </>
              ) : (
                'Save Playlist'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

