import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from '@/components/common/providers';
import BackgroundAnimation from '@/components/common/bg-animation';
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
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-dark min-h-screen`}>
        <Providers>
          <BackgroundAnimation />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;


