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
import { Monitor, Plus, Edit, Trash2, Eye, Power, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface SignageDisplay {
  id: string;
  name: string;
  location: string;
  type: 'welcome' | 'schedule' | 'announcements' | 'wayfinding' | 'sponsors';
  status: 'active' | 'inactive' | 'error';
  content: string;
  lastUpdated: string;
  resolution: string;
  orientation: 'landscape' | 'portrait';
}

export default function SignagePage() {
  const [displays, setDisplays] = useState<SignageDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingDisplay, setEditingDisplay] = useState<SignageDisplay | null>(null);
  const [previewDisplay, setPreviewDisplay] = useState<SignageDisplay | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    type: 'welcome' as SignageDisplay['type'],
    content: '',
    resolution: '1920x1080',
    orientation: 'landscape' as SignageDisplay['orientation']
  });

  useEffect(() => {
    fetchDisplays();
  }, []);

  const fetchDisplays = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockDisplays: SignageDisplay[] = [
        {
          id: '1',
          name: 'Main Entrance Welcome',
          location: 'Main Entrance',
          type: 'welcome',
          status: 'active',
          content: 'Welcome to WECON Masawat 2024! Check in at the registration desk.',
          lastUpdated: '2024-01-15T10:30:00Z',
          resolution: '1920x1080',
          orientation: 'landscape'
        },
        {
          id: '2',
          name: 'Auditorium Schedule',
          location: 'Main Auditorium',
          type: 'schedule',
          status: 'active',
          content: 'Current: Opening Keynote (9:00-10:00)\nNext: Panel Discussion (10:30-12:00)',
          lastUpdated: '2024-01-15T09:00:00Z',
          resolution: '1920x1080',
          orientation: 'landscape'
        },
        {
          id: '3',
          name: 'Lobby Announcements',
          location: 'Main Lobby',
          type: 'announcements',
          status: 'active',
          content: 'Lunch will be served at 12:30 PM in the cafeteria. WiFi: WECON2024',
          lastUpdated: '2024-01-15T11:45:00Z',
          resolution: '1080x1920',
          orientation: 'portrait'
        },
        {
          id: '4',
          name: 'Wayfinding Display',
          location: 'Corridor A',
          type: 'wayfinding',
          status: 'inactive',
          content: 'Auditorium ← | Workshop Rooms → | Cafeteria ↑',
          lastUpdated: '2024-01-14T16:20:00Z',
          resolution: '1920x1080',
          orientation: 'landscape'
        }
      ];
      
      setDisplays(mockDisplays);
    } catch (error) {
      console.error('Failed to fetch displays:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDisplay = async () => {
    try {
      // TODO: Implement actual API call
      const newDisplay: SignageDisplay = {
        id: Date.now().toString(),
        name: formData.name,
        location: formData.location,
        type: formData.type,
        status: 'active',
        content: formData.content,
        lastUpdated: new Date().toISOString(),
        resolution: formData.resolution,
        orientation: formData.orientation
      };
      
      setDisplays([...displays, newDisplay]);
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create display:', error);
    }
  };

  const handleUpdateDisplay = async () => {
    if (!editingDisplay) return;
    
    try {
      // TODO: Implement actual API call
      const updatedDisplay: SignageDisplay = {
        ...editingDisplay,
        name: formData.name,
        location: formData.location,
        type: formData.type,
        content: formData.content,
        resolution: formData.resolution,
        orientation: formData.orientation,
        lastUpdated: new Date().toISOString()
      };
      
      setDisplays(displays.map(d => d.id === editingDisplay.id ? updatedDisplay : d));
      setEditingDisplay(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update display:', error);
    }
  };

  const handleDeleteDisplay = async (displayId: string) => {
    try {
      // TODO: Implement actual API call
      setDisplays(displays.filter(d => d.id !== displayId));
    } catch (error) {
      console.error('Failed to delete display:', error);
    }
  };

  const handleToggleStatus = async (displayId: string) => {
    try {
      // TODO: Implement actual API call
      setDisplays(displays.map(d => 
        d.id === displayId 
          ? { ...d, status: d.status === 'active' ? 'inactive' : 'active' }
          : d
      ));
    } catch (error) {
      console.error('Failed to toggle display status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      type: 'welcome',
      content: '',
      resolution: '1920x1080',
      orientation: 'landscape'
    });
  };

  const openEditDialog = (display: SignageDisplay) => {
    setEditingDisplay(display);
    setFormData({
      name: display.name,
      location: display.location,
      type: display.type,
      content: display.content,
      resolution: display.resolution,
      orientation: display.orientation
    });
  };

  const getStatusColor = (status: SignageDisplay['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: SignageDisplay['type']) => {
    switch (type) {
      case 'welcome': return 'bg-blue-100 text-blue-800';
      case 'schedule': return 'bg-purple-100 text-purple-800';
      case 'announcements': return 'bg-orange-100 text-orange-800';
      case 'wayfinding': return 'bg-green-100 text-green-800';
      case 'sponsors': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Digital Signage</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage digital displays and content throughout your venue
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Display
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Display</DialogTitle>
              <DialogDescription>
                Add a new digital signage display to your venue
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Main Entrance Welcome"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Main Entrance"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Display Type</Label>
                  <Select value={formData.type} onValueChange={(value: SignageDisplay['type']) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="welcome">Welcome</SelectItem>
                      <SelectItem value="schedule">Schedule</SelectItem>
                      <SelectItem value="announcements">Announcements</SelectItem>
                      <SelectItem value="wayfinding">Wayfinding</SelectItem>
                      <SelectItem value="sponsors">Sponsors</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="orientation">Orientation</Label>
                  <Select value={formData.orientation} onValueChange={(value: SignageDisplay['orientation']) => setFormData({ ...formData, orientation: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="landscape">Landscape</SelectItem>
                      <SelectItem value="portrait">Portrait</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="resolution">Resolution</Label>
                <Select value={formData.resolution} onValueChange={(value) => setFormData({ ...formData, resolution: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1920x1080">1920x1080 (Full HD)</SelectItem>
                    <SelectItem value="1080x1920">1080x1920 (Portrait HD)</SelectItem>
                    <SelectItem value="3840x2160">3840x2160 (4K)</SelectItem>
                    <SelectItem value="2160x3840">2160x3840 (Portrait 4K)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter the content to display..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateDisplay}>Create Display</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Displays Grid */}
      <div className="grid gap-6">
        {displays.map((display, index) => (
          <motion.div
            key={display.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Monitor className="h-5 w-5 text-gray-500" />
                      <CardTitle className="text-xl">{display.name}</CardTitle>
                      <Badge className={getStatusColor(display.status)}>
                        {display.status}
                      </Badge>
                      <Badge className={getTypeColor(display.type)}>
                        {display.type}
                      </Badge>
                    </div>
                    <CardDescription>
                      {display.location} • {display.resolution} • {display.orientation}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewDisplay(display)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(display.id)}
                    >
                      <Power className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(display)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteDisplay(display.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                  <h4 className="font-medium mb-2">Current Content:</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                    {display.content}
                  </p>
                </div>
                <div className="text-xs text-gray-500">
                  Last updated: {new Date(display.lastUpdated).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingDisplay} onOpenChange={() => setEditingDisplay(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Display</DialogTitle>
            <DialogDescription>
              Update display settings and content
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Display Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Main Entrance Welcome"
                />
              </div>
              <div>
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Main Entrance"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-type">Display Type</Label>
                <Select value={formData.type} onValueChange={(value: SignageDisplay['type']) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome">Welcome</SelectItem>
                    <SelectItem value="schedule">Schedule</SelectItem>
                    <SelectItem value="announcements">Announcements</SelectItem>
                    <SelectItem value="wayfinding">Wayfinding</SelectItem>
                    <SelectItem value="sponsors">Sponsors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-orientation">Orientation</Label>
                <Select value={formData.orientation} onValueChange={(value: SignageDisplay['orientation']) => setFormData({ ...formData, orientation: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="landscape">Landscape</SelectItem>
                    <SelectItem value="portrait">Portrait</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter the content to display..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingDisplay(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateDisplay}>Update Display</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewDisplay} onOpenChange={() => setPreviewDisplay(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Display Preview: {previewDisplay?.name}</DialogTitle>
            <DialogDescription>
              Preview of how the content will appear on the display
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className={`bg-black text-white p-8 rounded-lg ${previewDisplay?.orientation === 'portrait' ? 'aspect-[9/16]' : 'aspect-video'}`}>
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">{previewDisplay?.name}</h2>
                  <div className="whitespace-pre-wrap text-lg">
                    {previewDisplay?.content}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setPreviewDisplay(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
