import { Metadata } from 'next';
import { Briefcase, Users, MapPin, Clock, ArrowRight, Heart, Zap, Target } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Careers - WECON Masawat',
  description: 'Join the WECON Masawat team and help shape the future of event management',
};

export default function CareersPage() {
  const openPositions = [
    {
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      location: 'Karachi, Pakistan',
      type: 'Full-time',
      description: 'Join our engineering team to build the next generation of event management tools.'
    },
    {
      title: 'Product Manager',
      department: 'Product',
      location: 'Remote',
      type: 'Full-time',
      description: 'Lead product strategy and development for our event management platform.'
    },
    {
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'Karachi, Pakistan',
      type: 'Full-time',
      description: 'Create beautiful and intuitive user experiences for event organizers and attendees.'
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance and wellness programs'
    },
    {
      icon: Zap,
      title: 'Growth Opportunities',
      description: 'Continuous learning and professional development support'
    },
    {
      icon: Users,
      title: 'Great Team',
      description: 'Work with passionate and talented individuals'
    },
    {
      icon: Target,
      title: 'Impact',
      description: 'Make a real difference in the event management industry'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Briefcase className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Help us revolutionize the event management industry and create amazing experiences for millions of people.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Why Work With Us */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Work With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Open Positions</h2>
          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{position.title}</h3>
                    <p className="text-gray-600 mb-4">{position.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {position.department}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {position.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {position.type}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                      Apply Now
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Don't See a Perfect Fit?</h2>
          <p className="text-gray-600 mb-6">
            We're always looking for talented individuals to join our team. Send us your resume and let us know how you'd like to contribute.
          </p>
          <div className="space-y-2">
            <p className="text-gray-700">
              <strong>Email:</strong> careers@weconmasawat.com
            </p>
            <p className="text-gray-700">
              <strong>Phone:</strong> +92 300 123 4567
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
