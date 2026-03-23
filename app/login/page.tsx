/* eslint-disable @typescript-eslint/no-explicit-any, react/no-unescaped-entities */
'use client';
export const dynamic = 'force-dynamic'


import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/lib/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Fuel, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication - replace with actual API call
    setTimeout(() => {
      const mockUser = {
        id: '1',
        email: email,
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+234 801 234 5678',
        roleId: '1',
        role: {
          id: '1',
          name: 'Admin',
          description: 'System Administrator',
          permissions: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        departmentId: '1',
        department: {
          id: '1',
          name: 'Management',
          description: 'Executive Management',
          employeeCount: 5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        status: 'active' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockToken = 'mock-jwt-token-' + Date.now();
      login(mockUser, mockToken);
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#8B1538] to-[#6B0F2A]">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <Image
          src="/filling-station.jpg"
          alt="Bayscom Filling Station"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 flex flex-col justify-end p-12 text-white">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Fuel className="h-12 w-12" />
              <h1 className="text-5xl font-bold">
                <span className="text-white">BAYSCOM</span>
                <br />
                <span className="text-[#E67E22]">ENERGY</span>
              </h1>
            </div>
            <p className="text-xl text-gray-200">
              Powering Nigeria's Energy Future
            </p>
            <p className="text-sm text-gray-300 max-w-md">
              Comprehensive ERP system for downstream oil and gas operations,
              fleet management, and business analytics.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          {/* Logo for mobile */}
          <div className="lg:hidden text-center">
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-[#8B1538]">BAYSCOM</span>{' '}
              <span className="text-[#E67E22]">ERP</span>
            </h1>
          </div>

          {/* Welcome Text */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-600">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@bayscom.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#8B1538] focus:ring-[#8B1538] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-[#8B1538] hover:text-[#6B0F2A]">
                  Forgot password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#8B1538] hover:bg-[#6B0F2A] h-11 text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Demo: Use any email and password to login
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 pt-4 border-t">
            <p>&copy; 2024 Bayscom Energy Limited. All rights reserved.</p>
            <p className="mt-1">RC 1053500</p>
          </div>
        </div>
      </div>
    </div>
  );
}
