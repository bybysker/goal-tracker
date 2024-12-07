'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function ContactUs() {
  useEffect(() => {
    window.location.href = 'mailto:bybysker@gmail.com';
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
        <p className="mb-4">Redirecting you to your email client...</p>
        <p>If you are not redirected automatically, please click <a href="mailto:bybysker@gmail.com" className="text-blue-500 hover:text-blue-700 underline">here</a> to send us an email.</p>
      </div>
    </div>
  );
} 