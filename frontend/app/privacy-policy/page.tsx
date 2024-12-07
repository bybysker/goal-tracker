'use client';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
          <p>This Privacy Policy explains how we collect, use, and protect your personal information when you use our goal tracking application. We are committed to ensuring the privacy and security of your data in compliance with the General Data Protection Regulation (GDPR) and other applicable privacy laws.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Data We Collect</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Account information (email address, name)</li>
            <li>Goal-related data (goals, progress, achievements)</li>
            <li>Usage data (how you interact with our application)</li>
            <li>Device information (browser type, IP address)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. How We Use Your Data</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and maintain our service</li>
            <li>To personalize your experience</li>
            <li>To improve our application</li>
            <li>To communicate with you about service-related matters</li>
            <li>To ensure the security of our service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Your Rights Under GDPR</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Right to access your personal data</li>
            <li>Right to rectification of inaccurate data</li>
            <li>Right to erasure ("right to be forgotten")</li>
            <li>Right to restrict processing</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security assessments</li>
            <li>Access controls and authentication measures</li>
            <li>Regular backups and disaster recovery procedures</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Contact Information</h2>
          <p>For any privacy-related questions or to exercise your rights, please contact us at:</p>
          <p className="mt-2">
            <a href="mailto:bybysker@gmail.com" className="text-blue-500 hover:text-blue-700">bybysker@gmail.com</a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Updates to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "last updated" date.</p>
        </section>
      </div>
    </div>
  );
} 