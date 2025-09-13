import { Metadata } from 'next';
import { Cookie, Settings, Shield, Eye, ToggleLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cookie Policy - WECON Masawat',
  description: 'Cookie Policy for WECON Masawat event management platform',
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <Cookie className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cookie Policy</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="h-6 w-6 text-blue-600" />
                What Are Cookies
              </h2>
              <p className="text-gray-700 mb-4">
                Cookies are small text files that are stored on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and 
                improving our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="h-6 w-6 text-blue-600" />
                Types of Cookies We Use
              </h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Essential Cookies</h3>
                  <p className="text-gray-700">
                    These cookies are necessary for the website to function properly. They enable core 
                    functionality such as security, network management, and accessibility.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Performance Cookies</h3>
                  <p className="text-gray-700">
                    These cookies help us understand how visitors interact with our website by collecting 
                    and reporting information anonymously.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Functional Cookies</h3>
                  <p className="text-gray-700">
                    These cookies enable the website to provide enhanced functionality and personalization, 
                    such as remembering your login details and preferences.
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Targeting Cookies</h3>
                  <p className="text-gray-700">
                    These cookies may be set through our site by our advertising partners to build a 
                    profile of your interests and show you relevant content.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ToggleLeft className="h-6 w-6 text-blue-600" />
                Managing Your Cookie Preferences
              </h2>
              <p className="text-gray-700 mb-4">
                You can control and manage cookies in various ways:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Use our cookie preference center to opt-out of non-essential cookies</li>
                <li>Modify your browser settings to block or delete cookies</li>
                <li>Use browser plugins to manage cookie preferences</li>
                <li>Clear your browser's cookie storage regularly</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6 text-blue-600" />
                Third-Party Cookies
              </h2>
              <p className="text-gray-700 mb-4">
                We may use third-party services that set cookies on your device. These include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Google Analytics for website analytics</li>
                <li>Payment processors for secure transactions</li>
                <li>Social media platforms for content sharing</li>
                <li>Customer support tools for better service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about our use of cookies, please contact us at:
                <br />
                Email: privacy@weconmasawat.com
                <br />
                Phone: +92 300 123 4567
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
