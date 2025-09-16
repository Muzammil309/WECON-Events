'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Edit, 
  Camera, 
  Globe, 
  Linkedin, 
  Twitter, 
  Mail, 
  MapPin, 
  Briefcase,
  Save,
  X,
  Eye,
  EyeOff,
  Users,
  Lock,
  Shield
} from 'lucide-react'
import { User as UserType } from '@/lib/supabase'

interface ProfileManagementProps {
  user: UserType
  isEditing: boolean
  profileForm: any
  onEdit: () => void
  onCancel: () => void
  onSave: () => void
  onFormChange: (field: string, value: any) => void
}

export default function ProfileManagement({
  user,
  isEditing,
  profileForm,
  onEdit,
  onCancel,
  onSave,
  onFormChange
}: ProfileManagementProps) {
  const [photoUploading, setPhotoUploading] = useState(false)

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setPhotoUploading(true)
    try {
      // TODO: Implement photo upload to Supabase Storage
      // For now, we'll use a placeholder
      console.log('Photo upload:', file.name)
    } catch (error) {
      console.error('Error uploading photo:', error)
    } finally {
      setPhotoUploading(false)
    }
  }

  const privacyOptions = [
    { value: 'PUBLIC', label: 'Public', icon: Globe, description: 'Visible to everyone' },
    { value: 'ATTENDEES_ONLY', label: 'Attendees Only', icon: Users, description: 'Visible to event attendees' },
    { value: 'CONNECTIONS_ONLY', label: 'Connections Only', icon: User, description: 'Visible to your connections' },
    { value: 'PRIVATE', label: 'Private', icon: Lock, description: 'Only visible to you' }
  ]

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Profile Management</h2>
          {!isEditing ? (
            <button
              onClick={onEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg hover:bg-primary/30 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={onSave}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={onCancel}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>

        {/* Profile Photo */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
              {user.profile_photo_url ? (
                <img
                  src={user.profile_photo_url}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/80 transition-colors">
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={photoUploading}
                />
              </label>
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">
              {user.first_name} {user.last_name}
            </h3>
            <p className="text-gray-400">{user.job_title} {user.company && `at ${user.company}`}</p>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">Basic Information</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileForm.first_name}
                    onChange={(e) => onFormChange('first_name', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                  />
                ) : (
                  <p className="text-white">{user.first_name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileForm.last_name}
                    onChange={(e) => onFormChange('last_name', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                  />
                ) : (
                  <p className="text-white">{user.last_name}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Bio (500 characters max)</label>
              {isEditing ? (
                <textarea
                  value={profileForm.bio}
                  onChange={(e) => onFormChange('bio', e.target.value)}
                  maxLength={500}
                  rows={3}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Tell others about yourself..."
                />
              ) : (
                <p className="text-white">{user.bio || 'No bio provided'}</p>
              )}
              {isEditing && (
                <p className="text-xs text-gray-500 mt-1">{profileForm.bio.length}/500 characters</p>
              )}
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">Professional Information</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Job Title</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileForm.job_title}
                  onChange={(e) => onFormChange('job_title', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Software Engineer"
                />
              ) : (
                <p className="text-white">{user.job_title || 'Not specified'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileForm.company}
                  onChange={(e) => onFormChange('company', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Tech Corp"
                />
              ) : (
                <p className="text-white">{user.company || 'Not specified'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Industry</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileForm.industry}
                  onChange={(e) => onFormChange('industry', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Technology"
                />
              ) : (
                <p className="text-white">{user.industry || 'Not specified'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileForm.location}
                  onChange={(e) => onFormChange('location', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                  placeholder="San Francisco, CA"
                />
              ) : (
                <p className="text-white">{user.location || 'Not specified'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-white mb-4">Social Media Links</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn</label>
              {isEditing ? (
                <input
                  type="url"
                  value={profileForm.linkedin_url}
                  onChange={(e) => onFormChange('linkedin_url', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                  placeholder="https://linkedin.com/in/username"
                />
              ) : (
                user.linkedin_url ? (
                  <a href={user.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">
                    View LinkedIn Profile
                  </a>
                ) : (
                  <p className="text-gray-500">Not provided</p>
                )
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Twitter</label>
              {isEditing ? (
                <input
                  type="url"
                  value={profileForm.twitter_url}
                  onChange={(e) => onFormChange('twitter_url', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                  placeholder="https://twitter.com/username"
                />
              ) : (
                user.twitter_url ? (
                  <a href={user.twitter_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">
                    View Twitter Profile
                  </a>
                ) : (
                  <p className="text-gray-500">Not provided</p>
                )
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
              {isEditing ? (
                <input
                  type="url"
                  value={profileForm.website_url}
                  onChange={(e) => onFormChange('website_url', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                  placeholder="https://yourwebsite.com"
                />
              ) : (
                user.website_url ? (
                  <a href={user.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">
                    Visit Website
                  </a>
                ) : (
                  <p className="text-gray-500">Not provided</p>
                )
              )}
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-white mb-4">Privacy & Networking</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Profile Visibility</label>
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {privacyOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => onFormChange('privacy_level', option.value)}
                      className={`p-3 rounded-lg border transition-colors text-left ${
                        profileForm.privacy_level === option.value
                          ? 'bg-primary/20 border-primary/50 text-primary'
                          : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <option.icon className="w-4 h-4" />
                        <span className="font-medium">{option.label}</span>
                      </div>
                      <p className="text-xs opacity-80">{option.description}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-white">
                  {privacyOptions.find(opt => opt.value === user.privacy_level)?.label || 'Public'}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-300">Available for Networking</label>
                <p className="text-xs text-gray-500">Allow other attendees to send you connection requests</p>
              </div>
              {isEditing ? (
                <button
                  onClick={() => onFormChange('networking_available', !profileForm.networking_available)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    profileForm.networking_available ? 'bg-primary' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      profileForm.networking_available ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              ) : (
                <span className={`px-2 py-1 rounded-full text-xs ${
                  user.networking_available 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {user.networking_available ? 'Available' : 'Not Available'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
