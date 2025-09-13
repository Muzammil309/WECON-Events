'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Bell, Plus, Send, Edit, Trash2, Mail, MessageSquare, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'email' | 'sms' | 'push' | 'in-app';
  audience: 'all' | 'attendees' | 'speakers' | 'volunteers' | 'vips';
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  scheduledFor?: string;
  sentAt?: string;
  recipients: number;
  openRate?: number;
  clickRate?: number;
}

interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'email' | 'sms' | 'push' | 'in-app';
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'email' as Notification['type'],
    audience: 'all' as Notification['audience'],
    scheduledFor: '',
    sendNow: false
  });
  const [templateData, setTemplateData] = useState({
    name: '',
    subject: '',
    content: '',
    type: 'email' as NotificationTemplate['type']
  });

  useEffect(() => {
    fetchNotifications();
    fetchTemplates();
  }, []);

  const fetchNotifications = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'Welcome to WECON Masawat 2024',
          message: 'Thank you for registering! Here\'s everything you need to know about the event.',
          type: 'email',
          audience: 'attendees',
          status: 'sent',
          sentAt: '2024-01-10T09:00:00Z',
          recipients: 1247,
          openRate: 78.5,
          clickRate: 23.2
        },
        {
          id: '2',
          title: 'Event Starts Tomorrow!',
          message: 'Don\'t forget - WECON Masawat 2024 starts tomorrow at 9:00 AM. See you there!',
          type: 'email',
          audience: 'all',
          status: 'sent',
          sentAt: '2024-01-14T18:00:00Z',
          recipients: 1500,
          openRate: 85.2,
          clickRate: 15.7
        },
        {
          id: '3',
          title: 'Lunch Break Announcement',
          message: 'Lunch is now being served in the main cafeteria. Please proceed in an orderly fashion.',
          type: 'push',
          audience: 'attendees',
          status: 'sent',
          sentAt: '2024-01-15T12:30:00Z',
          recipients: 987,
          openRate: 92.1
        },
        {
          id: '4',
          title: 'Speaker Briefing Reminder',
          message: 'Reminder: Speaker briefing in Conference Room A at 8:00 AM tomorrow.',
          type: 'email',
          audience: 'speakers',
          status: 'scheduled',
          scheduledFor: '2024-01-16T07:00:00Z',
          recipients: 25
        }
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      // Mock templates
      const mockTemplates: NotificationTemplate[] = [
        {
          id: '1',
          name: 'Welcome Email',
          subject: 'Welcome to {{event_name}}',
          content: 'Thank you for registering for {{event_name}}! We\'re excited to have you join us.',
          type: 'email'
        },
        {
          id: '2',
          name: 'Event Reminder',
          subject: '{{event_name}} starts {{time_until_event}}',
          content: 'Don\'t forget about {{event_name}} starting {{time_until_event}}!',
          type: 'email'
        },
        {
          id: '3',
          name: 'Push Notification',
          subject: 'Event Update',
          content: '{{message}}',
          type: 'push'
        }
      ];
      
      setTemplates(mockTemplates);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  const handleCreateNotification = async () => {
    try {
      // TODO: Implement actual API call
      const newNotification: Notification = {
        id: Date.now().toString(),
        title: formData.title,
        message: formData.message,
        type: formData.type,
        audience: formData.audience,
        status: formData.sendNow ? 'sent' : (formData.scheduledFor ? 'scheduled' : 'draft'),
        scheduledFor: formData.scheduledFor || undefined,
        sentAt: formData.sendNow ? new Date().toISOString() : undefined,
        recipients: getAudienceSize(formData.audience)
      };
      
      setNotifications([newNotification, ...notifications]);
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  };

  const handleCreateTemplate = async () => {
    try {
      // TODO: Implement actual API call
      const newTemplate: NotificationTemplate = {
        id: Date.now().toString(),
        name: templateData.name,
        subject: templateData.subject,
        content: templateData.content,
        type: templateData.type
      };
      
      setTemplates([...templates, newTemplate]);
      setIsTemplateDialogOpen(false);
      resetTemplateForm();
    } catch (error) {
      console.error('Failed to create template:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      // TODO: Implement actual API call
      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleSendNotification = async (notificationId: string) => {
    try {
      // TODO: Implement actual API call
      setNotifications(notifications.map(n => 
        n.id === notificationId 
          ? { ...n, status: 'sent', sentAt: new Date().toISOString() }
          : n
      ));
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  const getAudienceSize = (audience: Notification['audience']) => {
    switch (audience) {
      case 'all': return 1500;
      case 'attendees': return 1247;
      case 'speakers': return 25;
      case 'volunteers': return 50;
      case 'vips': return 15;
      default: return 0;
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'email',
      audience: 'all',
      scheduledFor: '',
      sendNow: false
    });
  };

  const resetTemplateForm = () => {
    setTemplateData({
      name: '',
      subject: '',
      content: '',
      type: 'email'
    });
  };

  const getStatusColor = (status: Notification['status']) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'email': return Mail;
      case 'sms': return MessageSquare;
      case 'push': return Bell;
      case 'in-app': return Bell;
      default: return Bell;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Send messages and updates to your event participants
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Template</DialogTitle>
                <DialogDescription>
                  Create a reusable notification template
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input
                      id="template-name"
                      value={templateData.name}
                      onChange={(e) => setTemplateData({ ...templateData, name: e.target.value })}
                      placeholder="e.g., Welcome Email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="template-type">Type</Label>
                    <Select value={templateData.type} onValueChange={(value: NotificationTemplate['type']) => setTemplateData({ ...templateData, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="push">Push Notification</SelectItem>
                        <SelectItem value="in-app">In-App</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="template-subject">Subject</Label>
                  <Input
                    id="template-subject"
                    value={templateData.subject}
                    onChange={(e) => setTemplateData({ ...templateData, subject: e.target.value })}
                    placeholder="Email subject or notification title"
                  />
                </div>
                <div>
                  <Label htmlFor="template-content">Content</Label>
                  <Textarea
                    id="template-content"
                    value={templateData.content}
                    onChange={(e) => setTemplateData({ ...templateData, content: e.target.value })}
                    placeholder="Template content (use {{variable}} for dynamic content)"
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTemplate}>Create Template</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Send Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Send Notification</DialogTitle>
                <DialogDescription>
                  Create and send a notification to your audience
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type} onValueChange={(value: Notification['type']) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="push">Push Notification</SelectItem>
                        <SelectItem value="in-app">In-App</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="audience">Audience</Label>
                    <Select value={formData.audience} onValueChange={(value: Notification['audience']) => setFormData({ ...formData, audience: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Participants ({getAudienceSize('all')})</SelectItem>
                        <SelectItem value="attendees">Attendees ({getAudienceSize('attendees')})</SelectItem>
                        <SelectItem value="speakers">Speakers ({getAudienceSize('speakers')})</SelectItem>
                        <SelectItem value="volunteers">Volunteers ({getAudienceSize('volunteers')})</SelectItem>
                        <SelectItem value="vips">VIPs ({getAudienceSize('vips')})</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="title">Title/Subject</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Notification title or email subject"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Your message content..."
                    rows={4}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="send-now"
                      checked={formData.sendNow}
                      onCheckedChange={(checked) => setFormData({ ...formData, sendNow: checked })}
                    />
                    <Label htmlFor="send-now">Send immediately</Label>
                  </div>
                  {!formData.sendNow && (
                    <div className="flex-1">
                      <Label htmlFor="scheduled-for">Schedule for</Label>
                      <Input
                        id="scheduled-for"
                        type="datetime-local"
                        value={formData.scheduledFor}
                        onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                      />
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateNotification}>
                  {formData.sendNow ? 'Send Now' : 'Schedule'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((notification, index) => {
          const TypeIcon = getTypeIcon(notification.type);
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <TypeIcon className="h-5 w-5 text-gray-500" />
                        <CardTitle className="text-lg">{notification.title}</CardTitle>
                        <Badge className={getStatusColor(notification.status)}>
                          {notification.status}
                        </Badge>
                        <Badge variant="outline">
                          {notification.audience} ({notification.recipients})
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">
                        {notification.message}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {notification.status === 'draft' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendNotification(notification.id)}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteNotification(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Type:</span> {notification.type}
                    </div>
                    <div>
                      <span className="font-medium">Recipients:</span> {notification.recipients}
                    </div>
                    {notification.openRate && (
                      <div>
                        <span className="font-medium">Open Rate:</span> {notification.openRate}%
                      </div>
                    )}
                    {notification.clickRate && (
                      <div>
                        <span className="font-medium">Click Rate:</span> {notification.clickRate}%
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {notification.sentAt && `Sent: ${new Date(notification.sentAt).toLocaleString()}`}
                    {notification.scheduledFor && `Scheduled: ${new Date(notification.scheduledFor).toLocaleString()}`}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Templates Section */}
      <Card>
        <CardHeader>
          <CardTitle>Templates</CardTitle>
          <CardDescription>Reusable notification templates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {templates.map((template) => (
              <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{template.name}</h4>
                  <p className="text-sm text-gray-600">{template.subject}</p>
                  <Badge variant="outline" className="mt-1">
                    {template.type}
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
