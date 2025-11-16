'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Shield,
  Building2,
  Fuel,
  Truck,
  Package,
  Droplet,
  Settings,
  LogOut,
  ShoppingCart,
  Wrench,
  DollarSign,
  FileText,
  ClipboardList,
  Store,
  TrendingUp,
  Archive,
  ShoppingBag,
  PackageCheck,
  Warehouse,
  Bike,
  Flame,
  BarChart3,
  Target,
  Code,
  ChevronDown,
  ChevronRight,
  CalendarDays,
  PieChart,
  Activity,
  CreditCard,
  MoveDiagonal,
  Calculator,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useAuthStore } from '@/lib/stores/authStore';

const menuSections = [
  {
    section: 'Dashboard',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    section: 'Finance',
    collapsible: true,
    items: [
      {
        title: 'General Ledger',
        href: '/finance/general-ledger',
        icon: FileText,
      },
      {
        title: 'Accounts Payable',
        href: '/finance/accounts-payable',
        icon: CreditCard,
      },
      {
        title: 'Accounts Receivable',
        href: '/finance/accounts-receivable',
        icon: DollarSign,
      },
      {
        title: 'Cash Flow',
        href: '/finance/cash-flow',
        icon: TrendingUp,
      },
      {
        title: 'Budget Management',
        href: '/finance/budget-management',
        icon: Calculator,
      },
      {
        title: 'Financial Reports',
        href: '/finance/reports',
        icon: BarChart3,
      },
    ],
  },
  {
    section: 'Inventory',
    collapsible: true,
    items: [
      {
        title: 'Overview',
        href: '/inventory/overview',
        icon: Package,
      },
      {
        title: 'Stock Movements',
        href: '/inventory/movements',
        icon: MoveDiagonal,
      },
      {
        title: 'Purchase Orders',
        href: '/inventory/purchase-orders',
        icon: ShoppingCart,
      },
      {
        title: 'Adjustments',
        href: '/inventory/adjustments',
        icon: Archive,
      },
    ],
  },
  {
    section: 'Customers',
    collapsible: true,
    items: [
      {
        title: 'Customer Management',
        href: '/customers/overview',
        icon: Users,
      },
      {
        title: 'Sales Orders',
        href: '/customers/sales-orders',
        icon: ShoppingBag,
      },
      {
        title: 'Analytics',
        href: '/customers/analytics',
        icon: PieChart,
      },
    ],
  },
  {
    section: 'Human Resources',
    collapsible: true,
    items: [
      {
        title: 'Employees',
        href: '/hr/employees',
        icon: Users,
      },
      {
        title: 'Payroll',
        href: '/hr/payroll',
        icon: Calculator,
      },
      {
        title: 'Leave Management',
        href: '/hr/leave-management',
        icon: CalendarDays,
      },
    ],
  },
  {
    section: 'Operations',
    collapsible: true,
    items: [
      {
        title: 'Fleet Management',
        href: '/trucks',
        icon: Truck,
      },
      {
        title: 'Filling Stations',
        href: '/filling-stations',
        icon: Fuel,
      },
      {
        title: 'LPG Operations',
        href: '/lpg-operations',
        icon: Flame,
      },
      {
        title: 'Trading Operations',
        href: '/trading-operations',
        icon: DollarSign,
      },
      {
        title: 'Peddling Operations',
        href: '/peddling-operations',
        icon: Bike,
      },
    ],
  },
  {
    section: 'Admin',
    collapsible: true,
    items: [
      {
        title: 'Stores Management',
        href: '/admin/stores',
        icon: Warehouse,
      },
      {
        title: 'Consumables',
        href: '/admin/consumables',
        icon: Package,
      },
      {
        title: 'Assets',
        href: '/admin/assets',
        icon: Archive,
      },
      {
        title: 'Item Requisitions',
        href: '/admin/item-requisitions',
        icon: ShoppingBag,
      },
      {
        title: 'Asset Requests',
        href: '/admin/asset-requests',
        icon: PackageCheck,
      },
      {
        title: 'Asset Movements',
        href: '/admin/asset-movements',
        icon: TrendingUp,
      },
      {
        title: 'Maintenance Requests',
        href: '/admin/maintenance-requests',
        icon: Wrench,
      },
      {
        title: 'Fuel Requests',
        href: '/admin/fuel-requests',
        icon: Fuel,
      },
      {
        title: 'Vehicle Maintenance',
        href: '/admin/vehicle-maintenance',
        icon: Truck,
      },
    ],
  },
  {
    section: 'Procurement',
    collapsible: true,
    items: [
      {
        title: 'Purchase Requests',
        href: '/procurement/purchase-request',
        icon: FileText,
      },
      {
        title: 'RFQ (Request for Quote)',
        href: '/procurement/rfq',
        icon: ClipboardList,
      },
      {
        title: 'Purchase Orders',
        href: '/procurement/purchase-order',
        icon: ShoppingCart,
      },
      {
        title: 'Vendor Management',
        href: '/procurement/vendors',
        icon: Store,
      },
    ],
  },
  {
    section: 'Reports',
    collapsible: true,
    items: [
      {
        title: 'Business Intelligence',
        href: '/reports/dashboard',
        icon: BarChart3,
      },
      {
        title: 'Financial Reports',
        href: '/reports/financial',
        icon: FileText,
      },
      {
        title: 'Operational Reports',
        href: '/reports/operations',
        icon: Activity,
      },
    ],
  },
  {
    section: 'System',
    collapsible: true,
    items: [
      {
        title: 'Users',
        href: '/users',
        icon: Users,
      },
      {
        title: 'Departments',
        href: '/departments',
        icon: Building2,
      },
      {
        title: 'Roles & Permissions',
        href: '/roles',
        icon: Shield,
      },
      {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
      },
      {
        title: 'API Testing',
        href: '/api-test',
        icon: Code,
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [expandedSections, setExpandedSections] = useState<string[]>(() => {
    // Auto-expand the section that contains the current path
    const activeSection = menuSections.find(section =>
      section.items?.some(item => pathname === item.href || pathname?.startsWith(item.href + '/'))
    );
    return activeSection ? [activeSection.section] : [];
  });

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionName)
        ? prev.filter(name => name !== sectionName)
        : [...prev, sectionName]
    );
  };

  const isSectionExpanded = (sectionName: string) => expandedSections.includes(sectionName);

  return (
    <div className="flex h-full w-64 flex-col border-r bg-gray-50">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6 bg-white">
        <h1 className="text-xl font-bold">
          <span className="text-[#8B1538]">BAYSCOM</span>{' '}
          <span className="text-[#E67E22]">ERP</span>
        </h1>
      </div>

      {/* User Info */}
      <div className="border-b p-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8B1538] text-white">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-600 truncate">{user?.role?.name}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {menuSections.map((section, sectionIndex) => (
          <div key={section.section} className={sectionIndex > 0 ? 'mt-6' : ''}>
            {/* Section Header */}
            {section.collapsible ? (
              <button
                onClick={() => toggleSection(section.section)}
                className="w-full flex items-center justify-between px-3 mb-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-gray-900 transition-colors"
              >
                <span>{section.section}</span>
                {isSectionExpanded(section.section) ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </button>
            ) : (
              <h3 className="px-3 mb-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {section.section}
              </h3>
            )}

            {/* Section Items */}
            {(!section.collapsible || isSectionExpanded(section.section)) && (
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-[#8B1538] text-white'
                          : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t p-3">
        <button
          onClick={logout}
          className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-900"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}