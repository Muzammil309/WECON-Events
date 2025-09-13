import { Metadata } from 'next';
import { FileText, Scale, AlertTriangle, CheckCircle, Users, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service - WECON Masawat',
  description: 'Terms of Service for WECON Masawat event management platform',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <Scale className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-blue-600" />
                Acceptance of Terms
              </h2>
              <p className="text-gray-700 mb-4">
                By accessing and using the WECON Masawat platform, you accept and agree to be bound by 
                the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-600" />
                User Accounts
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You are responsible for maintaining the security of your account</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
                <li>One person or legal entity may not maintain more than one account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-600" />
                Platform Usage
              </h2>
              <p className="text-gray-700 mb-4">
                You agree to use our platform only for lawful purposes and in accordance with these Terms.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Do not use the platform for any illegal or unauthorized purpose</li>
                <li>Do not interfere with or disrupt the platform or servers</li>
                <li>Do not attempt to gain unauthorized access to any part of the platform</li>
                <li>Respect the intellectual property rights of others</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
                Limitation of Liability
              </h2>
              <p className="text-gray-700 mb-4">
                WECON Masawat shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages resulting from your use of the platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6 text-blue-600" />
                Privacy and Data Protection
              </h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs 
                your use of the platform, to understand our practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-700">
                If you have any questions about these Terms of Service, please contact us at:
                <br />
                Email: legal@weconmasawat.com
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
