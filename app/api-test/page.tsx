'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { API, APIHelpers } from '@/lib/api';

export default function APITestPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('admin@bayscom.com');
  const [password, setPassword] = useState('admin123');

  const addResult = (test: string, success: boolean, data: any) => {
    setResults(prev => [...prev, {
      test,
      success,
      data,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const clearResults = () => setResults([]);

  // Test 1: Login Authentication
  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await API.auth.login({ email, password });
      addResult('Login Test', true, response);
    } catch (error: any) {
      addResult('Login Test', false, APIHelpers.handleError(error));
    }
    setLoading(false);
  };

  // Test 2: Get Departments (requires auth)
  const testDepartments = async () => {
    setLoading(true);
    try {
      const response = await API.config.departments.getAll();
      addResult('Get Departments', true, response);
    } catch (error: any) {
      addResult('Get Departments', false, APIHelpers.handleError(error));
    }
    setLoading(false);
  };

  // Test 3: Get Purchase Requests (requires auth)
  const testPurchaseRequests = async () => {
    setLoading(true);
    try {
      const response = await API.procurement.purchaseRequests.getAll();
      addResult('Get Purchase Requests', true, response);
    } catch (error: any) {
      addResult('Get Purchase Requests', false, APIHelpers.handleError(error));
    }
    setLoading(false);
  };

  // Test 4: Test Authentication Status
  const testAuthStatus = () => {
    const isAuth = APIHelpers.isAuthenticated();
    const token = APIHelpers.getToken();
    addResult('Authentication Status', true, {
      isAuthenticated: isAuth,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : null
    });
  };

  // Test 5: Test API Base Configuration
  const testAPIConfig = () => {
    addResult('API Configuration', true, {
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      frontendURL: process.env.NEXT_PUBLIC_FRONTEND_URL,
      environment: process.env.NEXT_PUBLIC_ENVIRONMENT
    });
  };

  // Test 6: Logout
  const testLogout = async () => {
    try {
      await API.auth.logout();
      addResult('Logout Test', true, 'Successfully logged out');
    } catch (error: any) {
      addResult('Logout Test', false, APIHelpers.handleError(error));
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Integration Test</h1>
          <p className="text-gray-600">Test the connection between frontend and backend</p>
        </div>

        {/* Login Credentials */}
        <Card>
          <CardHeader>
            <CardTitle>Test Credentials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>API Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button onClick={testAPIConfig} disabled={loading}>
                Test Config
              </Button>
              <Button onClick={testAuthStatus} disabled={loading}>
                Auth Status
              </Button>
              <Button onClick={testLogin} disabled={loading}>
                Test Login
              </Button>
              <Button onClick={testDepartments} disabled={loading}>
                Get Departments
              </Button>
              <Button onClick={testPurchaseRequests} disabled={loading}>
                Get Purchase Requests
              </Button>
              <Button onClick={testLogout} disabled={loading}>
                Test Logout
              </Button>
            </div>
            <div className="mt-4 flex space-x-2">
              <Button variant="outline" onClick={clearResults}>
                Clear Results
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open('http://localhost:8000/api/docs/', '_blank')}
              >
                Open API Docs
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No tests run yet. Click a test button above to start.
              </p>
            ) : (
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      result.success
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">
                        {result.test}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${
                          result.success ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {result.success ? '✅ Success' : '❌ Failed'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {result.timestamp}
                        </span>
                      </div>
                    </div>
                    <pre className="text-sm text-gray-700 bg-gray-100 p-2 rounded overflow-auto max-h-40">
                      {typeof result.data === 'string'
                        ? result.data
                        : JSON.stringify(result.data, null, 2)
                      }
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Documentation */}
        <Card>
          <CardHeader>
            <CardTitle>Available APIs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Authentication</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Login/Logout</li>
                  <li>• Password Reset</li>
                  <li>• Password Change</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Configuration</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Departments</li>
                  <li>• Items & Categories</li>
                  <li>• Positions</li>
                  <li>• Financial Years</li>
                  <li>• Haulage Rates</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Procurement</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Purchase Requests</li>
                  <li>• Purchase Orders</li>
                  <li>• Vendors</li>
                  <li>• RFQs</li>
                  <li>• Client/Customers</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Admin</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Inventory Management</li>
                  <li>• Fleet Management</li>
                  <li>• Payment Requests</li>
                  <li>• Asset Tracking</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Operations</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Haulage Operations</li>
                  <li>• Asset Tracking</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Other</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• User Management</li>
                  <li>• Support Tickets</li>
                  <li>• Notifications</li>
                  <li>• Activity Logs</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}