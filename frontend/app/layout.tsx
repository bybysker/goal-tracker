import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from '@/components/common/providers'; 
import React from 'react';
import { Toaster } from "@/components/ui/toaster";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Goal Tracker App",
  description: "A comprehensive goal tracking application.",
};

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {/* You can place components that should be present on all pages here */}
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
export default RootLayout;


