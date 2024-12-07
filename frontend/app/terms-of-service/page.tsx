'use client';

export default function TermsOfService() {
  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p>By accessing and using this goal tracking application, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Description of Service</h2>
          <p>Our application provides goal tracking and management services. We reserve the right to modify, suspend, or discontinue any part of the service at any time.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. User Accounts</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You are responsible for maintaining the confidentiality of your account credentials</li>
            <li>You must provide accurate and complete information when creating an account</li>
            <li>You are responsible for all activities that occur under your account</li>
            <li>You must notify us immediately of any unauthorized use of your account</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. User Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use the service for any illegal purpose</li>
            <li>Interfere with or disrupt the service</li>
            <li>Attempt to gain unauthorized access to the service</li>
            <li>Transmit any harmful code or material</li>
            <li>Impersonate any person or entity</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Intellectual Property</h2>
          <p>All content and functionality on this service is the exclusive property of our company and is protected by copyright and other intellectual property laws.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Limitation of Liability</h2>
          <p>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Data Usage</h2>
          <p>Your use of the service is also governed by our Privacy Policy. Please review our Privacy Policy to understand how we collect and use your information.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">8. Termination</h2>
          <p>We reserve the right to terminate or suspend your account and access to the service at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">9. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. We will notify users of any material changes to these terms.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">10. Contact</h2>
          <p>If you have any questions about these Terms of Service, please contact us at:</p>
          <p className="mt-2">
            <a href="mailto:bybysker@gmail.com" className="text-blue-500 hover:text-blue-700">bybysker@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  );
} 