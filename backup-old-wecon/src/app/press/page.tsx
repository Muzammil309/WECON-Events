import { Metadata } from 'next';
import { Newspaper, Download, Calendar, Users, Award, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Press Kit - WECON Masawat',
  description: 'Press resources and media kit for WECON Masawat',
};

export default function PressPage() {
  const pressReleases = [
    {
      date: '2024-03-15',
      title: 'WECON Masawat Launches Revolutionary Event Management Platform',
      description: 'New platform promises to transform how events are organized and managed in Pakistan.'
    },
    {
      date: '2024-02-28',
      title: 'WECON Masawat Announces Partnership with Leading Tech Companies',
      description: 'Strategic partnerships to enhance event technology and attendee experience.'
    },
    {
      date: '2024-01-20',
      title: 'WECON Masawat Receives Innovation Award for Event Technology',
      description: 'Recognition for outstanding contribution to the event management industry.'
    }
  ];

  const mediaAssets = [
    {
      type: 'Logo Package',
      description: 'High-resolution logos in various formats',
      size: '2.5 MB'
    },
    {
      type: 'Brand Guidelines',
      description: 'Complete brand identity and usage guidelines',
      size: '5.1 MB'
    },
    {
      type: 'Product Screenshots',
      description: 'High-quality screenshots of our platform',
      size: '8.3 MB'
    },
    {
      type: 'Executive Photos',
      description: 'Professional headshots of leadership team',
      size: '12.7 MB'
    }
  ];

  const stats = [
    { label: 'Events Managed', value: '500+' },
    { label: 'Total Attendees', value: '50,000+' },
    { label: 'Partner Organizations', value: '100+' },
    { label: 'Countries Served', value: '5+' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Newspaper className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Press Kit</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Media resources, press releases, and company information for journalists and media professionals.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Company Overview */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">About WECON Masawat</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-700 mb-4">
                WECON Masawat is Pakistan's leading event management platform, revolutionizing how events 
                are organized, managed, and experienced. Our comprehensive solution serves event organizers, 
                attendees, speakers, and sponsors with cutting-edge technology and innovative features.
              </p>
              <p className="text-gray-700 mb-4">
                Founded with the vision to transform the event industry, we provide tools for registration, 
                ticketing, networking, analytics, and much more, making every event a memorable experience.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Press Releases */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Press Releases</h2>
          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(release.date).toLocaleDateString()}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{release.title}</h3>
                    <p className="text-gray-600">{release.description}</p>
                  </div>
                  <button className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Media Assets */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Media Assets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mediaAssets.map((asset, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{asset.type}</h3>
                <p className="text-gray-600 mb-4">{asset.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{asset.size}</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Media Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Press Inquiries</h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>Email:</strong> press@weconmasawat.com
                </p>
                <p className="text-gray-700">
                  <strong>Phone:</strong> +92 300 123 4567
                </p>
                <p className="text-gray-700">
                  <strong>Response Time:</strong> Within 24 hours
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">General Information</h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>Website:</strong> weconmasawat.com
                </p>
                <p className="text-gray-700">
                  <strong>Founded:</strong> 2024
                </p>
                <p className="text-gray-700">
                  <strong>Headquarters:</strong> Karachi, Pakistan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
