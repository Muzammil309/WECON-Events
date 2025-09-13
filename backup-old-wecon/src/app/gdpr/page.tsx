import { Metadata } from 'next';
import { Shield, Eye, Lock, UserCheck, FileText, Download } from 'lucide-react';

export const metadata: Metadata = {
  title: 'GDPR Compliance - WECON Masawat',
  description: 'GDPR compliance information for WECON Masawat platform',
};

export default function GDPRPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">GDPR Compliance</h1>
            <p className="text-gray-600">General Data Protection Regulation compliance information</p>
          </div>

          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="h-6 w-6 text-blue-600" />
                Your Rights Under GDPR
              </h2>
              <p className="text-gray-700 mb-4">
                Under the General Data Protection Regulation (GDPR), you have several rights regarding your personal data:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Right to Access</h3>
                  <p className="text-gray-700 text-sm">
                    You can request access to your personal data and information about how we process it.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Right to Rectification</h3>
                  <p className="text-gray-700 text-sm">
                    You can request correction of inaccurate or incomplete personal data.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Right to Erasure</h3>
                  <p className="text-gray-700 text-sm">
                    You can request deletion of your personal data under certain circumstances.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Right to Portability</h3>
                  <p className="text-gray-700 text-sm">
                    You can request your data in a structured, machine-readable format.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="h-6 w-6 text-blue-600" />
                How We Protect Your Data
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>End-to-end encryption for data transmission</li>
                <li>Regular security audits and penetration testing</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Data minimization and purpose limitation</li>
                <li>Regular staff training on data protection</li>
                <li>Incident response and breach notification procedures</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <UserCheck className="h-6 w-6 text-blue-600" />
                Legal Basis for Processing
              </h2>
              <p className="text-gray-700 mb-4">
                We process your personal data based on the following legal grounds:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Consent:</strong> When you explicitly agree to data processing</li>
                <li><strong>Contract:</strong> To fulfill our contractual obligations</li>
                <li><strong>Legal Obligation:</strong> To comply with legal requirements</li>
                <li><strong>Legitimate Interest:</strong> For our legitimate business interests</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-600" />
                Data Processing Activities
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left">Purpose</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Data Types</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Legal Basis</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Retention</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Account Management</td>
                      <td className="border border-gray-300 px-4 py-2">Name, Email, Phone</td>
                      <td className="border border-gray-300 px-4 py-2">Contract</td>
                      <td className="border border-gray-300 px-4 py-2">Account lifetime</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Event Registration</td>
                      <td className="border border-gray-300 px-4 py-2">Personal & Preferences</td>
                      <td className="border border-gray-300 px-4 py-2">Consent</td>
                      <td className="border border-gray-300 px-4 py-2">3 years</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Analytics</td>
                      <td className="border border-gray-300 px-4 py-2">Usage Data</td>
                      <td className="border border-gray-300 px-4 py-2">Legitimate Interest</td>
                      <td className="border border-gray-300 px-4 py-2">2 years</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Exercise Your Rights</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  To exercise any of your GDPR rights or if you have questions about our data processing:
                </p>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong>Data Protection Officer:</strong> dpo@weconmasawat.com
                  </p>
                  <p className="text-gray-700">
                    <strong>Privacy Team:</strong> privacy@weconmasawat.com
                  </p>
                  <p className="text-gray-700">
                    <strong>Response Time:</strong> Within 30 days
                  </p>
                </div>
                <div className="mt-4">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download Data Request Form
                  </button>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Supervisory Authority</h2>
              <p className="text-gray-700">
                If you believe we have not addressed your concerns adequately, you have the right to lodge 
                a complaint with your local data protection supervisory authority.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
