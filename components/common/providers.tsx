// components/common/providers.tsx
"use client"

import React from 'react';
import { AuthProvider } from '@/hooks/useAuth';

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      {/* You can add more providers here in the future */}
      {children}
    </AuthProvider>
  );
};

export default Providers;
