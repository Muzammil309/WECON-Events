'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DialogFooter } from '@/components/ui/dialog';

interface EventCreateFormProps {
  onSuccess: (event: any) => void;
  onCancel: () => void;
}

export default function EventCreateForm({ onSuccess, onCancel }: EventCreateFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    venue: '',
    startAt: '',
    endAt: '',
    timezone: 'UTC',
    category: '',
    maxAttendees: '',
    website: '',
    contactEmail: '',
    isPublic: true,
    registrationOpen: true,
    tags: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Event name is required';
    }

    if (!formData.startAt) {
      newErrors.startAt = 'Start date is required';
    }

    if (!formData.endAt) {
      newErrors.endAt = 'End date is required';
    }

    if (formData.startAt && formData.endAt) {
      const start = new Date(formData.startAt);
      const end = new Date(formData.endAt);
      if (start >= end) {
        newErrors.endAt = 'End date must be after start date';
      }
    }

    if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    if (formData.maxAttendees && parseInt(formData.maxAttendees) < 1) {
      newErrors.maxAttendees = 'Max attendees must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const slug = generateSlug(formData.name);
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const eventData = {
        ...formData,
        slug,
        tags,
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null,
        startAt: new Date(formData.startAt).toISOString(),
        endAt: new Date(formData.endAt).toISOString()
      };

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });

      if (response.ok) {
        const data = await response.json();
        onSuccess(data.event);
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.error || 'Failed to create event' });
      }
    } catch (error) {
      console.error('Failed to create event:', error);
      setErrors({ submit: 'Failed to create event. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Event Name */}
        <div className="md:col-span-2">
          <Label htmlFor="name">Event Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter event name"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter event description"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Venue */}
        <div>
          <Label htmlFor="venue">Venue</Label>
          <Input
            id="venue"
            value={formData.venue}
            onChange={(e) => handleInputChange('venue', e.target.value)}
            placeholder="Enter venue name"
          />
        </div>

        {/* Category */}
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="conference">Conference</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
              <SelectItem value="seminar">Seminar</SelectItem>
              <SelectItem value="networking">Networking</SelectItem>
              <SelectItem value="exhibition">Exhibition</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Start Date */}
        <div>
          <Label htmlFor="startAt">Start Date & Time *</Label>
          <Input
            id="startAt"
            type="datetime-local"
            value={formData.startAt}
            onChange={(e) => handleInputChange('startAt', e.target.value)}
            className={errors.startAt ? 'border-red-500' : ''}
          />
          {errors.startAt && <p className="text-sm text-red-500 mt-1">{errors.startAt}</p>}
        </div>

        {/* End Date */}
        <div>
          <Label htmlFor="endAt">End Date & Time *</Label>
          <Input
            id="endAt"
            type="datetime-local"
            value={formData.endAt}
            onChange={(e) => handleInputChange('endAt', e.target.value)}
            className={errors.endAt ? 'border-red-500' : ''}
          />
          {errors.endAt && <p className="text-sm text-red-500 mt-1">{errors.endAt}</p>}
        </div>

        {/* Timezone */}
        <div>
          <Label htmlFor="timezone">Timezone</Label>
          <Select value={formData.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UTC">UTC</SelectItem>
              <SelectItem value="America/New_York">Eastern Time</SelectItem>
              <SelectItem value="America/Chicago">Central Time</SelectItem>
              <SelectItem value="America/Denver">Mountain Time</SelectItem>
              <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
              <SelectItem value="Europe/London">London</SelectItem>
              <SelectItem value="Europe/Paris">Paris</SelectItem>
              <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Max Attendees */}
        <div>
          <Label htmlFor="maxAttendees">Max Attendees</Label>
          <Input
            id="maxAttendees"
            type="number"
            value={formData.maxAttendees}
            onChange={(e) => handleInputChange('maxAttendees', e.target.value)}
            placeholder="Leave empty for unlimited"
            min="1"
            className={errors.maxAttendees ? 'border-red-500' : ''}
          />
          {errors.maxAttendees && <p className="text-sm text-red-500 mt-1">{errors.maxAttendees}</p>}
        </div>

        {/* Website */}
        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder="https://example.com"
          />
        </div>

        {/* Contact Email */}
        <div>
          <Label htmlFor="contactEmail">Contact Email</Label>
          <Input
            id="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={(e) => handleInputChange('contactEmail', e.target.value)}
            placeholder="contact@example.com"
            className={errors.contactEmail ? 'border-red-500' : ''}
          />
          {errors.contactEmail && <p className="text-sm text-red-500 mt-1">{errors.contactEmail}</p>}
        </div>

        {/* Tags */}
        <div className="md:col-span-2">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => handleInputChange('tags', e.target.value)}
            placeholder="Enter tags separated by commas"
          />
          <p className="text-sm text-gray-500 mt-1">Separate multiple tags with commas</p>
        </div>

        {/* Switches */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="isPublic">Public Event</Label>
            <Switch
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="registrationOpen">Registration Open</Label>
            <Switch
              id="registrationOpen"
              checked={formData.registrationOpen}
              onCheckedChange={(checked) => handleInputChange('registrationOpen', checked)}
            />
          </div>
        </div>
      </div>

      {errors.submit && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Event'}
        </Button>
      </DialogFooter>
    </form>
  );
}
