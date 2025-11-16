'use client';

import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to monitoring service
    console.error('Application error:', error);
  }, [error]);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <AlertTriangle className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Something went wrong!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              An unexpected error occurred. Please try again or contact support if the problem persists.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <div className="text-left bg-gray-100 p-3 rounded text-sm">
                <p className="font-semibold text-red-600">Error Details:</p>
                <p className="text-gray-700">{error.message}</p>
                {error.digest && (
                  <p className="text-gray-500 mt-1">Error ID: {error.digest}</p>
                )}
              </div>
            )}
            <div className="flex flex-col gap-3">
              <Button
                onClick={reset}
                className="w-full bg-[#8B1538] hover:bg-[#6B0F2A]"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}