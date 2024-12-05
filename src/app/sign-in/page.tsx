"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AiFillGoogleCircle } from "react-icons/ai";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    console.log("Signing in with credentials:", { email, password });
    
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
  
    console.log("SignIn result:", result);
  
    if (result?.error) {
      alert(result.error);
    } else {
      router.push("/");
    }
  };
  

  const handleGoogleSignIn = () => {
    signIn("google");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-300 dark:bg-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

          <div className="my-4 flex items-center">
            <Separator className="flex-grow" />
            <span className="px-2 text-muted-foreground">or</span>
            <Separator className="flex-grow" />
          </div>

          <Button 
            type="button"
            variant="outline" 
            className="w-full relative overflow-hidden group" 
            onClick={handleGoogleSignIn}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center justify-center w-full">
              <AiFillGoogleCircle className="w-6 h-6 mr-2" />
              Continue with Google
            </div>
          </Button>

          <div className="mt-4 text-center text-sm">
            Donot have an account?{' '}
            <a 
              href="/sign-up" 
              className="underline hover:text-blue-600"
            >
              Sign up
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}