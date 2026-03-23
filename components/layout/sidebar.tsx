/* eslint-disable @typescript-eslint/no-explicit-any, prefer-const, react/no-unescaped-entities, @typescript-eslint/no-empty-object-type */
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
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useAuthStore } from '@/lib/stores/authStore';

// Type definitions for nested menu structure
interface NestedMenuItem {
  title: string;
  href: string;
}

interface SubMenuItem {
  title: string;
  href: string;
  subItems?: NestedMenuItem[];
}

interface MenuItem {
  title: string;
  href: string;
  icon: any;
  subItems?: SubMenuItem[];
}

interface MenuSection {
  section: string;
  collapsible?: boolean;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
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
        title: 'Finance Dashboard',
        href: '/finance/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Memos',
        href: '/finance/memos',
        icon: FileText,
      },
      {
        title: 'Payment Vouchers',
        href: '/finance/vouchers',
        icon: CreditCard,
      },
      {
        title: 'Petty Cash',
        href: '/finance/petty-cash',
        icon: Wallet,
      },
      {
        title: 'Cash Advances',
        href: '/finance/advances',
        icon: DollarSign,
      },
      {
        title: 'General Ledger',
        href: '/finance/general-ledger',
        icon: FileText,
        subItems: [
          {
            title: 'Chart of Accounts',
            href: '/finance/general-ledger/chart-of-accounts',
          },
          {
            title: 'Journal Entries',
            href: '/finance/general-ledger/journal-entries',
          },
          {
            title: 'Trial Balance',
            href: '/finance/general-ledger/trial-balance',
          },
        ],
      },
      {
        title: 'Accounts Receivable',
        href: '/finance/accounts-receivable',
        icon: DollarSign,
        subItems: [
          {
            title: 'AR Aging Report',
            href: '/finance/accounts-receivable/aging',
          },
          {
            title: 'Customer Invoices',
            href: '/finance/accounts-receivable/invoices',
          },
        ],
      },
      {
        title: 'Accounts Payable',
        href: '/finance/accounts-payable',
        icon: CreditCard,
        subItems: [
          {
            title: 'AP Aging Report',
            href: '/finance/accounts-payable/aging',
          },
          {
            title: 'Vendor Management',
            href: '/finance/accounts-payable/vendors',
          },
        ],
      },
      {
        title: 'Fixed Assets',
        href: '/finance/fixed-assets',
        icon: Truck,
      },
      {
        title: 'Bank Reconciliation',
        href: '/finance/bank-reconciliation',
        icon: Building2,
      },
      {
        title: 'Tax Management',
        href: '/finance/tax-management',
        icon: FileText,
      },
      {
        title: 'Dimensions',
        href: '/finance/dimensions/cost-centers',
        icon: Target,
        subItems: [
          {
            title: 'Cost Centers',
            href: '/finance/dimensions/cost-centers',
          },
          {
            title: 'Projects',
            href: '/finance/dimensions/projects',
          },
        ],
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
        subItems: [
          {
            title: 'Station P&L',
            href: '/finance/reports/station-pl',
          },
          {
            title: 'All Reports',
            href: '/finance/reports',
          },
        ],
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
        title: 'Fleet & Haulage',
        href: '/fleet-haulage/dashboard',
        icon: Truck,
        subItems: [
          {
            title: 'Dashboard',
            href: '/fleet-haulage/dashboard',
          },
          {
            title: 'New Trip',
            href: '/fleet-haulage/new-trip',
          },
          {
            title: 'Trip Log',
            href: '/fleet-haulage/trip-log',
          },
          {
            title: 'Truck Fleet',
            href: '/fleet-haulage/trucks',
          },
          {
            title: 'P&L Summary',
            href: '/fleet-haulage/pl-summary',
          },
        ],
      },
      {
        title: 'Fuel Operations',
        href: '/fuel-operations/filling-station/pms-stock',
        icon: Fuel,
        subItems: [
          {
            title: 'Filling Station',
            href: '/fuel-operations/filling-station/pms-stock',
            subItems: [
              {
                title: 'PMS Stock',
                href: '/fuel-operations/filling-station/pms-stock',
              },
              {
                title: 'AGO Stock',
                href: '/fuel-operations/filling-station/ago-stock',
              },
              {
                title: 'Bank Lodgements',
                href: '/fuel-operations/filling-station/lodgements',
              },
              {
                title: 'Reconciliation',
                href: '/fuel-operations/filling-station/reconciliation',
              },
            ],
          },
          {
            title: 'LPG Section',
            href: '/fuel-operations/lpg/dashboard',
            subItems: [
              {
                title: 'Dashboard',
                href: '/fuel-operations/lpg/dashboard',
              },
              {
                title: 'Daily Sales',
                href: '/fuel-operations/lpg/daily-sales',
              },
              {
                title: 'Purchases',
                href: '/fuel-operations/lpg/purchases',
              },
              {
                title: 'Accessories',
                href: '/fuel-operations/lpg/accessories',
              },
              {
                title: 'Expenses',
                href: '/fuel-operations/lpg/expenses',
              },
              {
                title: 'P&L Statement',
                href: '/fuel-operations/lpg/pl-statement',
              },
              {
                title: 'Reconciliation',
                href: '/fuel-operations/lpg/reconciliation',
              },
            ],
          },
          {
            title: 'AGO Peddling',
            href: '/fuel-operations/ago-peddling/dashboard',
            subItems: [
              {
                title: 'Dashboard',
                href: '/fuel-operations/ago-peddling/dashboard',
              },
              {
                title: 'Daily Sales',
                href: '/fuel-operations/ago-peddling/daily-sales',
              },
              {
                title: 'Purchases',
                href: '/fuel-operations/ago-peddling/purchases',
              },
              {
                title: 'Inventory',
                href: '/fuel-operations/ago-peddling/inventory',
              },
              {
                title: 'Expenses',
                href: '/fuel-operations/ago-peddling/expenses',
              },
              {
                title: 'P&L Statement',
                href: '/fuel-operations/ago-peddling/pl-statement',
              },
              {
                title: 'Reconciliation',
                href: '/fuel-operations/ago-peddling/reconciliation',
              },
            ],
          },
        ],
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
                  const hasSubItems = item.subItems && item.subItems.length > 0;

                  return (
                    <div key={item.href}>
                      <Link
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

                      {/* Render SubItems if they exist */}
                      {hasSubItems && (
                        <div className="ml-8 mt-1 space-y-1">
                          {item.subItems?.map((subItem) => {
                            const isSubActive = pathname === subItem.href;
                            const hasNestedSubItems = subItem.subItems && subItem.subItems.length > 0;

                            return (
                              <div key={subItem.href}>
                                <Link
                                  href={subItem.href}
                                  className={cn(
                                    'block rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                                    isSubActive
                                      ? 'bg-[#E67E22] text-white'
                                      : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                                  )}
                                >
                                  {subItem.title}
                                </Link>

                                {/* Render Nested SubItems if they exist */}
                                {hasNestedSubItems && (
                                  <div className="ml-4 mt-1 space-y-1">
                                    {subItem.subItems?.map((nestedItem) => {
                                      const isNestedActive = pathname === nestedItem.href;

                                      return (
                                        <Link
                                          key={nestedItem.href}
                                          href={nestedItem.href}
                                          className={cn(
                                            'block rounded-lg px-3 py-1 text-xs transition-colors',
                                            isNestedActive
                                              ? 'bg-gray-300 text-gray-900 font-medium'
                                              : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900'
                                          )}
                                        >
                                          {nestedItem.title}
                                        </Link>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
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