'use client';
export const dynamic = 'force-dynamic'


import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold">
          <span className="text-[#8B1538]">BAYSCOM</span>{' '}
          <span className="text-[#E67E22]">ERP</span>
        </h1>
        <p className="text-gray-500 mt-2">Loading...</p>
      </div>
    </div>
  );
}
