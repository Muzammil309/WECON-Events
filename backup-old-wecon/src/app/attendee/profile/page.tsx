'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Briefcase, 
  Globe, 
  Heart,
  Shield,
  AlertTriangle,
  Save,
  Upload,
  Linkedin,
  Twitter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AttendeeProfile {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    bio?: string;
    avatarUrl?: string;
    company?: string;
    jobTitle?: string;
    linkedinUrl?: string;
    twitterUrl?: string;
    website?: string;
  };
  interests: string[];
  dietaryReqs?: string;
  accessibilityReqs?: string;
  emergencyContact?: string;
  tshirtSize?: string;
  networkingOptIn: boolean;
}

const AVAILABLE_INTERESTS = [
  'Technology', 'Marketing', 'Sales', 'Design', 'Development', 'AI/ML', 
  'Blockchain', 'Cybersecurity', 'Cloud Computing', 'Data Science',
  'Project Management', 'Leadership', 'Entrepreneurship', 'Startups',
  'Digital Transformation', 'Innovation', 'Sustainability', 'Healthcare',
  'Education', 'Finance', 'E-commerce', 'Mobile Apps', 'Web Development'
];

const TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

export default function AttendeeProfilePage() {
  const [profile, setProfile] = useState<AttendeeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // For demo purposes, use fallback data
      const demoProfile: AttendeeProfile = {
        user: {
          id: 'demo-attendee-1',
          name: 'Demo Attendee',
          email: 'demo@wecon-masawat.com',
          phone: '+92 300 1234567',
          bio: 'Passionate about technology and innovation. Looking forward to networking at WECON Masawat 2024.',
          company: 'Tech Innovations Ltd',
          jobTitle: 'Senior Developer',
          linkedinUrl: 'https://linkedin.com/in/demo-attendee',
          twitterUrl: 'https://twitter.com/demo_attendee',
          website: 'https://demo-attendee.com'
        },
        interests: ['Technology', 'AI/ML', 'Web Development'],
        dietaryReqs: 'Vegetarian',
        accessibilityReqs: '',
        emergencyContact: 'John Doe - +92 300 9876543',
        tshirtSize: 'L',
        networkingOptIn: true
      };

      setProfile(demoProfile);
      setSelectedInterests(demoProfile.interests);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!profile) return;

    try {
      setSaving(true);
      setMessage('');

      // For demo purposes, just show success message
      // In production, this would make an API call to update the profile
      
      setTimeout(() => {
        setMessage('Profile updated successfully!');
        setSaving(false);
        setTimeout(() => setMessage(''), 3000);
      }, 1000);

    } catch (error) {
      console.error('Failed to save profile:', error);
      setMessage('Failed to save profile. Please try again.');
      setSaving(false);
    }
  };

  const toggleInterest = (interest: string) => {
    const newInterests = selectedInterests.includes(interest)
      ? selectedInterests.filter(i => i !== interest)
      : [...selectedInterests, interest];
    
    setSelectedInterests(newInterests);
    if (profile) {
      setProfile({
        ...profile,
        interests: newInterests
      });
    }
  };

  const updateProfile = (field: string, value: any) => {
    if (!profile) return;

    if (field.startsWith('user.')) {
      const userField = field.replace('user.', '');
      setProfile({
        ...profile,
        user: {
          ...profile.user,
          [userField]: value
        }
      });
    } else {
      setProfile({
        ...profile,
        [field]: value
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile not found</h2>
        <p className="text-gray-600">Unable to load your profile information.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>
        <Button onClick={saveProfile} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.user.name}
                onChange={(e) => updateProfile('user.name', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.user.email}
                onChange={(e) => updateProfile('user.email', e.target.value)}
                placeholder="Enter your email"
                disabled // Usually email is not editable
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.user.phone || ''}
                onChange={(e) => updateProfile('user.phone', e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.user.bio || ''}
                onChange={(e) => updateProfile('user.bio', e.target.value)}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Professional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={profile.user.company || ''}
                onChange={(e) => updateProfile('user.company', e.target.value)}
                placeholder="Enter your company name"
              />
            </div>

            <div>
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={profile.user.jobTitle || ''}
                onChange={(e) => updateProfile('user.jobTitle', e.target.value)}
                placeholder="Enter your job title"
              />
            </div>

            <div>
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="linkedin"
                  value={profile.user.linkedinUrl || ''}
                  onChange={(e) => updateProfile('user.linkedinUrl', e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="twitter">Twitter URL</Label>
              <div className="relative">
                <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="twitter"
                  value={profile.user.twitterUrl || ''}
                  onChange={(e) => updateProfile('user.twitterUrl', e.target.value)}
                  placeholder="https://twitter.com/yourhandle"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="website"
                  value={profile.user.website || ''}
                  onChange={(e) => updateProfile('user.website', e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Interests & Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Select Your Interests</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {AVAILABLE_INTERESTS.map(interest => (
                  <Badge
                    key={interest}
                    variant={selectedInterests.includes(interest) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Selected: {selectedInterests.length} interests
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Networking Opt-in</Label>
                <p className="text-sm text-gray-500">Allow other attendees to find and connect with you</p>
              </div>
              <Switch
                checked={profile.networkingOptIn}
                onCheckedChange={(checked) => updateProfile('networkingOptIn', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Event Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Event Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tshirtSize">T-Shirt Size</Label>
              <Select value={profile.tshirtSize || ''} onValueChange={(value) => updateProfile('tshirtSize', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your t-shirt size" />
                </SelectTrigger>
                <SelectContent>
                  {TSHIRT_SIZES.map(size => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dietary">Dietary Requirements</Label>
              <Input
                id="dietary"
                value={profile.dietaryReqs || ''}
                onChange={(e) => updateProfile('dietaryReqs', e.target.value)}
                placeholder="e.g., Vegetarian, Vegan, Halal, Allergies"
              />
            </div>

            <div>
              <Label htmlFor="accessibility">Accessibility Requirements</Label>
              <Textarea
                id="accessibility"
                value={profile.accessibilityReqs || ''}
                onChange={(e) => updateProfile('accessibilityReqs', e.target.value)}
                placeholder="Please describe any accessibility needs..."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="emergency">Emergency Contact</Label>
              <div className="relative">
                <AlertTriangle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="emergency"
                  value={profile.emergencyContact || ''}
                  onChange={(e) => updateProfile('emergencyContact', e.target.value)}
                  placeholder="Name - Phone Number"
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
