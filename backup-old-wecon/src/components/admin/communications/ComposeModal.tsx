'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Send, 
  Mail, 
  MessageSquare, 
  Bell, 
  Users, 
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Upload,
  Image,
  Paperclip
} from 'lucide-react';

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (messageData: any) => Promise<void>;
}

interface Event {
  id: string;
  name: string;
}

export default function ComposeModal({ isOpen, onClose, onSend }: ComposeModalProps) {
  const [formData, setFormData] = useState({
    type: 'EMAIL',
    title: '',
    message: '',
    recipients: 'all',
    eventId: '',
    priority: 'NORMAL',
    scheduledFor: '',
    attachments: [] as File[]
  });
  const [events, setEvents] = useState<Event[]>([]);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [recipientCount, setRecipientCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      fetchEvents();
      fetchRecipientCount();
    }
  }, [isOpen, formData.recipients, formData.eventId]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/admin/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const fetchRecipientCount = async () => {
    try {
      const params = new URLSearchParams();
      if (formData.recipients !== 'all') {
        params.append('group', formData.recipients);
      }
      if (formData.eventId) {
        params.append('eventId', formData.eventId);
      }

      const response = await fetch(`/api/admin/users/count?${params}`);
      if (response.ok) {
        const data = await response.json();
        setRecipientCount(data.count || 0);
      }
    } catch (error) {
      console.error('Failed to fetch recipient count:', error);
      setRecipientCount(0);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    if (formData.type === 'SMS' && formData.message.length > 160) {
      newErrors.message = 'SMS messages must be 160 characters or less';
    }

    if (formData.scheduledFor) {
      const scheduledDate = new Date(formData.scheduledFor);
      if (scheduledDate <= new Date()) {
        newErrors.scheduledFor = 'Scheduled time must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSending(true);
    try {
      await onSend({
        ...formData,
        recipientCount
      });
      
      // Reset form
      setFormData({
        type: 'EMAIL',
        title: '',
        message: '',
        recipients: 'all',
        eventId: '',
        priority: 'NORMAL',
        scheduledFor: '',
        attachments: []
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Failed to send message:', error);
      setErrors({ submit: 'Failed to send message. Please try again.' });
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'EMAIL': return <Mail className="h-5 w-5" />;
      case 'SMS': return <MessageSquare className="h-5 w-5" />;
      case 'PUSH': return <Bell className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-red-400';
      case 'HIGH': return 'text-orange-400';
      case 'NORMAL': return 'text-blue-400';
      case 'LOW': return 'text-gray-400';
      default: return 'text-blue-400';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-gray-800 w-full max-w-4xl rounded-lg border border-gray-700 max-h-[95vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              {getTypeIcon(formData.type)}
              <h2 className="text-xl font-semibold text-white">Compose Message</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Message Type and Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="EMAIL">Email</option>
                    <option value="SMS">SMS</option>
                    <option value="PUSH">Push Notification</option>
                    <option value="ANNOUNCEMENT">In-App Announcement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="LOW">Low</option>
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              {/* Recipients */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Recipients *
                  </label>
                  <select
                    value={formData.recipients}
                    onChange={(e) => setFormData(prev => ({ ...prev, recipients: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Users</option>
                    <option value="attendees">Attendees Only</option>
                    <option value="staff">Staff Only</option>
                    <option value="speakers">Speakers Only</option>
                    <option value="exhibitors">Exhibitors Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Event Filter (Optional)
                  </label>
                  <select
                    value={formData.eventId}
                    onChange={(e) => setFormData(prev => ({ ...prev, eventId: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Events</option>
                    {events.map(event => (
                      <option key={event.id} value={event.id}>{event.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Recipient Count */}
              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-400">
                  <Users className="h-5 w-5" />
                  <span className="font-medium">
                    This message will be sent to {recipientCount} recipient{recipientCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subject/Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Enter message title..."
                />
                {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                  {formData.type === 'SMS' && (
                    <span className="text-sm text-gray-400 ml-2">
                      ({formData.message.length}/160 characters)
                    </span>
                  )}
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  rows={formData.type === 'SMS' ? 3 : 6}
                  className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                    errors.message ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Enter your message..."
                />
                {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message}</p>}
              </div>

              {/* Attachments (Email only) */}
              {formData.type === 'EMAIL' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Attachments
                  </label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-gray-500 transition-colors">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400">Click to upload files or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">Max 10MB per file</p>
                    </label>
                  </div>

                  {formData.attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {formData.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <Paperclip className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-white">{file.name}</span>
                            <span className="text-xs text-gray-400">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Schedule */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Schedule for Later (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduledFor}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledFor: e.target.value }))}
                  className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.scheduledFor ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.scheduledFor && <p className="text-red-400 text-sm mt-1">{errors.scheduledFor}</p>}
              </div>

              {/* Error Message */}
              {errors.submit && (
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertTriangle className="h-5 w-5" />
                    <span>{errors.submit}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-700 p-6">
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors order-2 sm:order-1"
                  disabled={sending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending || recipientCount === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors order-1 sm:order-2 flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {formData.scheduledFor ? 'Scheduling...' : 'Sending...'}
                    </>
                  ) : (
                    <>
                      {formData.scheduledFor ? <Clock className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                      {formData.scheduledFor ? 'Schedule Message' : 'Send Message'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
