"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaGoogle, FaGithub, FaApple } from 'react-icons/fa';
import { useAuth } from "@/hooks/useAuth";

const Auth: React.FC = () => {
  const router = useRouter();
  const {
    user,
    handleGoogleSignIn,
    handleGithubSignIn,
    handleAppleSignIn,
    handleEmailPasswordSignIn,
    registerUser,
  } = useAuth();

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Redirect if authenticated
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleEmailAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      if (authMode === 'login') {
        await handleEmailPasswordSignIn(email, password);
      } else {
        await registerUser(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {authMode === 'login' ? 'Login' : 'Sign Up'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={authMode}
            onValueChange={(value: string) => setAuthMode(value as 'login' | 'signup')}
            className="text-white"
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login" className="data-[state=active]:bg-[#192BC2]/70 data-[state=active]:text-white">Login</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-green-600/50 data-[state=active]:text-white">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className=""
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className=""
                />
                <Button type="submit" className="w-full bg-[#192BC2]/100 hover:bg-[#78C0E0]/60">
                  Login
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className=""
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className=""
                />
                <Button type="submit" className="w-full bg-green-600/80 hover:bg-green-700">
                  Sign Up
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 space-y-2">
            <p className="text-center text-sm text-white/80 mb-2">Or continue with</p>
            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full flex items-center justify-center bg-white/30 hover:bg-white/20 text-white"
            >
              <FaGoogle className="mr-2" /> Google
            </Button>
            {/*
            <Button
              onClick={handleGithubSignIn}
              variant="outline"
              className="w-full flex items-center justify-center"
            >
              <FaGithub className="mr-2" /> GitHub
            </Button>
            <Button
              onClick={handleAppleSignIn}
              variant="outline"
              className="w-full flex items-center justify-center"
            >
              <FaApple className="mr-2" /> Apple
            </Button>
            */}
          </div>

          {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
