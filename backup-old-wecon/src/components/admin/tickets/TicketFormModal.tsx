'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Event {
  id: string;
  name: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
  initial?: {
    id?: string;
    name?: string;
    description?: string;
    price?: number;
    currency?: string;
    totalQuantity?: number;
    eventId?: string;
    saleStartDate?: string;
    saleEndDate?: string;
    features?: string;
  };
}

export default function TicketFormModal({ open, onClose, onSaved, initial }: Props) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 0,
    currency: 'USD',
    totalQuantity: 100,
    eventId: '',
    saleStartDate: '',
    saleEndDate: '',
    features: ''
  });
  const [events, setEvents] = useState<Event[]>([]);
  const [errors, setErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      fetchEvents();
      if (initial) {
        setForm({
          name: initial.name || '',
          description: initial.description || '',
          price: initial.price || 0,
          currency: initial.currency || 'USD',
          totalQuantity: initial.totalQuantity || 100,
          eventId: initial.eventId || '',
          saleStartDate: initial.saleStartDate ? initial.saleStartDate.split('T')[0] : '',
          saleEndDate: initial.saleEndDate ? initial.saleEndDate.split('T')[0] : '',
          features: initial.features || ''
        });
      } else {
        setForm({
          name: '',
          description: '',
          price: 0,
          currency: 'USD',
          totalQuantity: 100,
          eventId: '',
          saleStartDate: '',
          saleEndDate: '',
          features: ''
        });
      }
    }
  }, [initial, open]);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events?limit=50');
      if (res.ok) {
        const data = await res.json();
        setEvents((data.events || []).map((e: any) => ({ id: e.id, name: e.name })));
      }
    } catch (e) {
      console.error('Error fetching events', e);
    }
  };

  if (!open) return null;

  const validate = () => {
    const e: any = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (form.price < 0) e.price = 'Price must be 0 or greater';
    if (form.totalQuantity < 1) e.totalQuantity = 'Quantity must be at least 1';
    if (!form.eventId) e.eventId = 'Event is required';
    if (!form.saleStartDate) e.saleStartDate = 'Sale start date is required';
    if (!form.saleEndDate) e.saleEndDate = 'Sale end date is required';
    if (form.saleStartDate && form.saleEndDate && new Date(form.saleStartDate) >= new Date(form.saleEndDate)) {
      e.saleEndDate = 'End date must be after start date';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      const method = initial?.id ? 'PUT' : 'POST';

      // Prepare payload with proper data types
      const payload: any = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: form.price.toString(), // API expects string
        currency: form.currency,
        totalQuantity: form.totalQuantity.toString(), // API expects string
        eventId: form.eventId,
        features: form.features.trim()
      };

      // Handle dates properly
      if (form.saleStartDate) {
        payload.saleStartDate = new Date(form.saleStartDate).toISOString();
      }
      if (form.saleEndDate) {
        payload.saleEndDate = new Date(form.saleEndDate).toISOString();
      }

      // Add ID for updates
      if (initial?.id) {
        payload.id = initial.id;
      }

      console.log('Submitting ticket data:', payload);

      const res = await fetch('/api/admin/tickets', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();

      if (!res.ok) {
        console.error('API Error Response:', responseData);
        throw new Error(responseData.error || `HTTP ${res.status}: Failed to save ticket`);
      }

      console.log('Ticket saved successfully:', responseData);
      await onSaved();
      onClose();

      // Reset form
      setForm({
        name: '',
        description: '',
        price: 0,
        currency: 'USD',
        totalQuantity: 100,
        eventId: '',
        saleStartDate: '',
        saleEndDate: '',
        features: ''
      });
      setErrors({});

    } catch (err: any) {
      console.error('Ticket submission error:', err);
      setErrors({ submit: err.message || 'Failed to save ticket. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 w-full max-w-4xl rounded-lg border border-gray-700 max-h-[95vh] flex flex-col">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-700 flex-shrink-0">
          <h3 className="text-lg sm:text-xl font-semibold text-white">{initial?.id ? 'Edit' : 'Create'} Ticket</h3>
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
                  placeholder="e.g., Early Bird, VIP Pass"
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Event *</label>
                <select
                  className={`w-full px-3 py-2 rounded-lg bg-gray-700 text-white border ${errors.eventId ? 'border-red-500' : 'border-gray-600'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  value={form.eventId}
                  onChange={e => setForm({ ...form, eventId: e.target.value })}
                >
                  <option value="">Select Event</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>{event.name}</option>
                  ))}
                </select>
                {errors.eventId && <p className="text-xs text-red-400 mt-1">{errors.eventId}</p>}
              </div>
            </div>

            <div className="col-span-1 lg:col-span-2">
              <label className="block text-sm text-gray-300 mb-2">Description *</label>
              <textarea
                className={`w-full px-3 py-2 rounded-lg bg-gray-700 text-white border ${errors.description ? 'border-red-500' : 'border-gray-600'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Describe what's included with this ticket"
              />
              {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Price *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 rounded-lg bg-gray-700 text-white border ${errors.price ? 'border-red-500' : 'border-gray-600'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  value={form.price}
                  onChange={e => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
                {errors.price && <p className="text-xs text-red-400 mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Currency</label>
                <select
                  className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.currency}
                  onChange={e => setForm({ ...form, currency: e.target.value })}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="PKR">PKR</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Quantity *</label>
                <input
                  type="number"
                  min="1"
                  className={`w-full px-3 py-2 rounded-lg bg-gray-700 text-white border ${errors.totalQuantity ? 'border-red-500' : 'border-gray-600'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  value={form.totalQuantity}
                  onChange={e => setForm({ ...form, totalQuantity: parseInt(e.target.value) || 0 })}
                  placeholder="100"
                />
                {errors.totalQuantity && <p className="text-xs text-red-400 mt-1">{errors.totalQuantity}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Sale Start Date *</label>
                <input
                  type="date"
                  className={`w-full px-3 py-2 rounded-lg bg-gray-700 text-white border ${errors.saleStartDate ? 'border-red-500' : 'border-gray-600'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  value={form.saleStartDate}
                  onChange={e => setForm({ ...form, saleStartDate: e.target.value })}
                />
                {errors.saleStartDate && <p className="text-xs text-red-400 mt-1">{errors.saleStartDate}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Sale End Date *</label>
                <input
                  type="date"
                  className={`w-full px-3 py-2 rounded-lg bg-gray-700 text-white border ${errors.saleEndDate ? 'border-red-500' : 'border-gray-600'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  value={form.saleEndDate}
                  onChange={e => setForm({ ...form, saleEndDate: e.target.value })}
                />
                {errors.saleEndDate && <p className="text-xs text-red-400 mt-1">{errors.saleEndDate}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Features (comma-separated)</label>
              <input
                className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={form.features}
                onChange={e => setForm({ ...form, features: e.target.value })}
                placeholder="Full access, Welcome kit, Networking sessions"
              />
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
                'Save Ticket'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
