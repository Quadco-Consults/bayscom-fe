'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle,
  Plus,
  Download,
  Upload,
  Filter,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  PieChart,
  Calculator,
  Clock,
  Building2,
  Truck,
  Fuel,
  Users,
  Package,
  Settings,
  RefreshCw,
} from 'lucide-react';

interface BudgetItem {
  id: string;
  department: string;
  category: string;
  budgeted: number;
  actual: number;
  variance: number;
  variancePercent: number;
  status: 'on-track' | 'over-budget' | 'under-budget' | 'at-risk';
  lastUpdated: string;
}

interface BudgetPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  totalActual: number;
  status: 'active' | 'completed' | 'planning';
}

const mockBudgetData: BudgetItem[] = [
  {
    id: '1',
    department: 'Operations',
    category: 'Fleet Maintenance',
    budgeted: 5000000,
    actual: 4750000,
    variance: -250000,
    variancePercent: -5.0,
    status: 'under-budget',
    lastUpdated: '2024-11-15',
  },
  {
    id: '2',
    department: 'Operations',
    category: 'Fuel Procurement',
    budgeted: 25000000,
    actual: 26500000,
    variance: 1500000,
    variancePercent: 6.0,
    status: 'over-budget',
    lastUpdated: '2024-11-14',
  },
  {
    id: '3',
    department: 'Human Resources',
    category: 'Salaries & Benefits',
    budgeted: 18000000,
    actual: 17850000,
    variance: -150000,
    variancePercent: -0.8,
    status: 'on-track',
    lastUpdated: '2024-11-15',
  },
  {
    id: '4',
    department: 'Marketing',
    category: 'Advertising & Promotion',
    budgeted: 3000000,
    actual: 2100000,
    variance: -900000,
    variancePercent: -30.0,
    status: 'under-budget',
    lastUpdated: '2024-11-13',
  },
  {
    id: '5',
    department: 'Administration',
    category: 'Office Expenses',
    budgeted: 2500000,
    actual: 2650000,
    variance: 150000,
    variancePercent: 6.0,
    status: 'at-risk',
    lastUpdated: '2024-11-12',
  },
  {
    id: '6',
    department: 'Technology',
    category: 'Software & Systems',
    budgeted: 4000000,
    actual: 3800000,
    variance: -200000,
    variancePercent: -5.0,
    status: 'on-track',
    lastUpdated: '2024-11-11',
  },
];

const mockBudgetPeriods: BudgetPeriod[] = [
  {
    id: '1',
    name: '2024 Annual Budget',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    totalBudget: 85000000,
    totalActual: 78450000,
    status: 'active',
  },
  {
    id: '2',
    name: 'Q4 2024 Budget',
    startDate: '2024-10-01',
    endDate: '2024-12-31',
    totalBudget: 22000000,
    totalActual: 18750000,
    status: 'active',
  },
  {
    id: '3',
    name: 'Q3 2024 Budget',
    startDate: '2024-07-01',
    endDate: '2024-09-30',
    totalBudget: 21000000,
    totalActual: 20850000,
    status: 'completed',
  },
];

export default function BudgetManagementPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('1');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const currentPeriod = mockBudgetPeriods.find(p => p.id === selectedPeriod);
  const totalBudgeted = mockBudgetData.reduce((sum, item) => sum + item.budgeted, 0);
  const totalActual = mockBudgetData.reduce((sum, item) => sum + item.actual, 0);
  const totalVariance = totalActual - totalBudgeted;
  const variancePercent = ((totalVariance / totalBudgeted) * 100);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'text-green-600 bg-green-100';
      case 'over-budget': return 'text-red-600 bg-red-100';
      case 'under-budget': return 'text-blue-600 bg-blue-100';
      case 'at-risk': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track': return <CheckCircle className="h-4 w-4" />;
      case 'over-budget': return <AlertTriangle className="h-4 w-4" />;
      case 'under-budget': return <TrendingDown className="h-4 w-4" />;
      case 'at-risk': return <Clock className="h-4 w-4" />;
      default: return <Calculator className="h-4 w-4" />;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'departments', label: 'By Department', icon: Building2 },
    { id: 'categories', label: 'By Category', icon: Target },
    { id: 'variance', label: 'Variance Analysis', icon: TrendingUp },
    { id: 'forecasting', label: 'Forecasting', icon: TrendingUp },
    { id: 'approvals', label: 'Approvals', icon: CheckCircle },
  ];

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black">Total Budgeted</p>
              <p className="text-3xl font-bold text-black">₦{(totalBudgeted / 1000000).toFixed(1)}M</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-black">FY 2024 Budget</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black">Actual Spend</p>
              <p className="text-3xl font-bold text-black">₦{(totalActual / 1000000).toFixed(1)}M</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className={`${totalVariance < 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalVariance < 0 ? '↓' : '↑'} {Math.abs(variancePercent).toFixed(1)}%
            </span>
            <span className="text-black ml-1">vs budget</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black">Budget Utilization</p>
              <p className="text-3xl font-bold text-black">{((totalActual / totalBudgeted) * 100).toFixed(1)}%</p>
            </div>
            <div className="h-12 w-12 bg-[#E67E22] bg-opacity-10 rounded-lg flex items-center justify-center">
              <PieChart className="h-6 w-6 text-[#E67E22]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#E67E22] h-2 rounded-full"
                style={{ width: `${Math.min((totalActual / totalBudgeted) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black">Remaining Budget</p>
              <p className="text-3xl font-bold text-black">₦{((totalBudgeted - totalActual) / 1000000).toFixed(1)}M</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calculator className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-black">
              {(((totalBudgeted - totalActual) / totalBudgeted) * 100).toFixed(1)}% remaining
            </p>
          </div>
        </div>
      </div>

      {/* Budget vs Actual Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Budget vs Actual Spending</h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-gray-100 rounded-md">Monthly</button>
            <button className="px-3 py-1 text-sm bg-[#8B1538] text-white rounded-md">Quarterly</button>
            <button className="px-3 py-1 text-sm bg-gray-100 rounded-md">Yearly</button>
          </div>
        </div>
        <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-black">Budget vs Actual Chart</p>
            <p className="text-sm text-black">Interactive chart showing budget performance over time</p>
          </div>
        </div>
      </div>

      {/* Alerts and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Budget Alerts</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-800">Fuel Procurement Over Budget</p>
                <p className="text-sm text-red-700">6% over allocated budget (₦1.5M excess)</p>
                <p className="text-xs text-red-600 mt-1">Requires immediate attention</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-yellow-800">Office Expenses At Risk</p>
                <p className="text-sm text-yellow-700">Trending towards budget limit</p>
                <p className="text-xs text-yellow-600 mt-1">Monitor closely</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-green-800">Fleet Maintenance Under Budget</p>
                <p className="text-sm text-green-700">5% under allocated budget</p>
                <p className="text-xs text-green-600 mt-1">Performing well</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-black mb-4">Department Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Building2 className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-black">Operations</span>
              </div>
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: '102%' }}></div>
                </div>
                <span className="text-sm font-medium text-red-600">102%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-black">Human Resources</span>
              </div>
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '99%' }}></div>
                </div>
                <span className="text-sm font-medium text-green-600">99%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Settings className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-black">Technology</span>
              </div>
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
                <span className="text-sm font-medium text-blue-600">95%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Package className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="text-black">Administration</span>
              </div>
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '106%' }}></div>
                </div>
                <span className="text-sm font-medium text-yellow-600">106%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDepartmentsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Budget by Department</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Budgeted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Actual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Variance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockBudgetData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                    {item.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    ₦{(item.budgeted / 1000000).toFixed(1)}M
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    ₦{(item.actual / 1000000).toFixed(1)}M
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`${item.variance < 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.variance < 0 ? '-' : '+'}₦{Math.abs(item.variance / 1000000).toFixed(1)}M
                      ({item.variancePercent > 0 ? '+' : ''}{item.variancePercent}%)
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1 capitalize">{item.status.replace('-', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">Budget Management</h1>
            <p className="mt-1 text-sm text-black">
              Plan, track, and analyze budgets across all departments and operations
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              {mockBudgetPeriods.map((period) => (
                <option key={period.id} value={period.id}>{period.name}</option>
              ))}
            </select>
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
              <Plus className="h-4 w-4 mr-2" />
              New Budget
            </button>
            <button className="flex items-center px-4 py-2 bg-[#8B1538] text-white rounded-md hover:bg-[#7A1230] text-sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Budget Period Info */}
        {currentPeriod && (
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-black">{currentPeriod.name}</h3>
                <p className="text-sm text-black">
                  {new Date(currentPeriod.startDate).toLocaleDateString()} - {new Date(currentPeriod.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-black">Total Budget</p>
                  <p className="text-lg font-semibold text-black">₦{(currentPeriod.totalBudget / 1000000).toFixed(1)}M</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-black">Actual Spend</p>
                  <p className="text-lg font-semibold text-black">₦{(currentPeriod.totalActual / 1000000).toFixed(1)}M</p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  currentPeriod.status === 'active' ? 'bg-green-100 text-green-800' :
                  currentPeriod.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {currentPeriod.status === 'active' ? 'Active' :
                   currentPeriod.status === 'completed' ? 'Completed' : 'Planning'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    isActive
                      ? 'border-[#8B1538] text-[#8B1538] bg-[#8B1538]/5'
                      : 'border-transparent text-black hover:text-[#8B1538] hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'departments' && renderDepartmentsTab()}
          {activeTab === 'categories' && (
            <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-black mb-2">Budget Categories</h3>
              <p className="text-black mb-4">Detailed budget breakdown by expense categories</p>
              <p className="text-sm text-black">Coming soon - category-wise budget analysis</p>
            </div>
          )}
          {activeTab === 'variance' && (
            <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-black mb-2">Variance Analysis</h3>
              <p className="text-black mb-4">Detailed analysis of budget variances and trends</p>
              <p className="text-sm text-black">Coming soon - comprehensive variance reporting</p>
            </div>
          )}
          {activeTab === 'forecasting' && (
            <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-black mb-2">Budget Forecasting</h3>
              <p className="text-black mb-4">AI-powered budget forecasting and predictions</p>
              <p className="text-sm text-black">Coming soon - intelligent budget planning</p>
            </div>
          )}
          {activeTab === 'approvals' && (
            <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
              <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-black mb-2">Budget Approvals</h3>
              <p className="text-black mb-4">Manage budget approval workflows and authorization</p>
              <p className="text-sm text-black">Coming soon - approval management system</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}