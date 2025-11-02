'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  UserCog,
  Wrench,
  DollarSign,
  FileText,
  ClipboardList,
  Store,
  UserCheck,
  Calendar,
  Clock,
  TrendingUp,
  Briefcase,
  GraduationCap,
  Archive,
  Boxes,
  ShoppingBag,
  PackageCheck,
  Warehouse,
  Mail,
  Bike,
  Flame,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
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
    section: 'Main',
    items: [
      {
        title: 'Inventory Management',
        href: '/inventory-management',
        icon: Package,
        subItems: [
          {
            title: 'Product Category',
            href: '/products/category',
            icon: Package,
          },
          {
            title: 'All Products',
            href: '/products/inventory',
            icon: Package,
          },
          {
            title: 'Product Request',
            href: '/inventory-management/product-request',
            icon: ShoppingBag,
          },
          {
            title: 'Store',
            href: '/inventory-management/store',
            icon: Warehouse,
          },
          {
            title: 'Transfer History',
            href: '/inventory-management/transfer-history',
            icon: ClipboardList,
          },
        ],
      },
      {
        title: 'Procurement',
        href: '/procurement',
        icon: ShoppingCart,
        subItems: [
          {
            title: 'Purchase',
            href: '/procurement/purchase',
            icon: ShoppingCart,
            subItems: [
              {
                title: 'Purchase Request',
                href: '/procurement/purchase-request',
              },
              {
                title: 'Purchase Order',
                href: '/procurement/purchase-order',
              },
              {
                title: 'Goods Received Note',
                href: '/procurement/goods-received-note',
              },
            ],
          },
          {
            title: 'Vendor Management',
            href: '/procurement/vendor-management',
            icon: Store,
            subItems: [
              {
                title: 'Vendor Category',
                href: '/procurement/vendor-management/category',
              },
              {
                title: 'Vendors',
                href: '/procurement/vendor-management/vendors',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    section: 'Admin and HR',
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
        title: 'Attendance',
        href: '/hr/attendance',
        icon: UserCheck,
      },
      {
        title: 'Leave Management',
        href: '/hr/leave',
        icon: Calendar,
      },
      {
        title: 'Overtime',
        href: '/hr/overtime',
        icon: Clock,
      },
      {
        title: 'Performance',
        href: '/hr/performance',
        icon: TrendingUp,
      },
      {
        title: 'Recruitment',
        href: '/hr/recruitment',
        icon: Briefcase,
      },
      {
        title: 'Training',
        href: '/hr/training',
        icon: GraduationCap,
      },
    ],
  },
  {
    section: 'Memo',
    items: [
      {
        title: 'Memo',
        href: '/memo',
        icon: Mail,
      },
    ],
  },
  {
    section: 'Operations',
    items: [
      {
        title: 'Filling Stations',
        href: '/operations/filling-stations',
        icon: Fuel,
      },
      {
        title: 'Peddler Operations',
        href: '/operations/peddler',
        icon: Bike,
      },
      {
        title: 'Fleet Management',
        href: '/operations/fleet',
        icon: Truck,
      },
      {
        title: 'LPG Operations',
        href: '/operations/lpg',
        icon: Flame,
      },
    ],
  },
  {
    section: 'Finance',
    items: [
      // Finance items will be added here
    ],
  },
  {
    section: 'Access Control',
    items: [
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
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (itemHref: string) => {
    setExpandedItems(prev =>
      prev.includes(itemHref)
        ? prev.filter(h => h !== itemHref)
        : [...prev, itemHref]
    );
  };

  return (
    <div className={cn(
      "flex h-full flex-col border-r bg-gray-50 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Logo & Toggle */}
      <div className="flex h-16 items-center border-b px-3 bg-white justify-between">
        {!isCollapsed && (
          <h1 className="text-xl font-bold">
            <span className="text-[#8B1538]">BAYSCOM</span>{' '}
            <span className="text-[#E67E22]">ERP</span>
          </h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors ml-auto"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* User Info */}
      {!isCollapsed && (
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
              <p className="text-xs text-gray-500 truncate">{user?.role?.name}</p>
            </div>
          </div>
        </div>
      )}
      {isCollapsed && (
        <div className="border-b p-2 flex justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8B1538] text-white text-sm">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {menuSections.map((section, sectionIndex) => (
          <div key={section.section} className={sectionIndex > 0 ? 'mt-6' : ''}>
            {/* Section Header */}
            {!isCollapsed && section.section !== 'Main' && (
              <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.section}
              </h3>
            )}
            {isCollapsed && section.items.length > 0 && sectionIndex > 0 && (
              <div className="border-t border-gray-300 my-2"></div>
            )}
            {/* Section Items */}
            <div className="space-y-1">
              {section.items.map((item: any) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isExpanded = expandedItems.includes(item.href);

                return (
                  <div key={item.href}>
                    {/* Parent Item */}
                    {hasSubItems ? (
                      <button
                        onClick={() => toggleExpand(item.href)}
                        className={cn(
                          'flex items-center justify-between w-full rounded-lg py-2 text-sm font-medium transition-colors',
                          isCollapsed ? 'justify-center px-2' : 'space-x-3 px-3',
                          isActive
                            ? 'bg-[#8B1538] text-white'
                            : 'text-gray-700 hover:bg-gray-200'
                        )}
                        title={isCollapsed ? item.title : undefined}
                      >
                        <div className={cn('flex items-center', isCollapsed ? '' : 'space-x-3')}>
                          <item.icon className="h-5 w-5 flex-shrink-0" />
                          {!isCollapsed && <span>{item.title}</span>}
                        </div>
                        {!isCollapsed && (
                          isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        )}
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center rounded-lg py-2 text-sm font-medium transition-colors',
                          isCollapsed ? 'justify-center px-2' : 'space-x-3 px-3',
                          isActive
                            ? 'bg-[#8B1538] text-white'
                            : 'text-gray-700 hover:bg-gray-200'
                        )}
                        title={isCollapsed ? item.title : undefined}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </Link>
                    )}

                    {/* Sub Items */}
                    {hasSubItems && isExpanded && !isCollapsed && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.subItems.map((subItem: any) => {
                          const isSubActive = pathname === subItem.href || pathname?.startsWith(subItem.href + '/');
                          const hasNestedSubItems = subItem.subItems && subItem.subItems.length > 0;
                          const isSubExpanded = expandedItems.includes(subItem.href);

                          return (
                            <div key={subItem.href}>
                              {/* Second Level Item */}
                              {hasNestedSubItems ? (
                                <button
                                  onClick={() => toggleExpand(subItem.href)}
                                  className={cn(
                                    'flex items-center justify-between w-full rounded-lg py-2 px-3 text-sm transition-colors',
                                    isSubActive
                                      ? 'bg-[#8B1538] text-white font-medium'
                                      : 'text-gray-600 hover:bg-gray-200'
                                  )}
                                >
                                  <span>{subItem.title}</span>
                                  {isSubExpanded ? (
                                    <ChevronUp className="h-3 w-3" />
                                  ) : (
                                    <ChevronDown className="h-3 w-3" />
                                  )}
                                </button>
                              ) : (
                                <Link
                                  href={subItem.href}
                                  className={cn(
                                    'flex items-center rounded-lg py-2 px-3 text-sm transition-colors',
                                    isSubActive
                                      ? 'bg-[#8B1538] text-white font-medium'
                                      : 'text-gray-600 hover:bg-gray-200'
                                  )}
                                >
                                  <span>{subItem.title}</span>
                                </Link>
                              )}

                              {/* Third Level Items (Nested SubItems) */}
                              {hasNestedSubItems && isSubExpanded && (
                                <div className="ml-6 mt-1 space-y-1">
                                  {subItem.subItems.map((nestedItem: any) => {
                                    const isNestedActive = pathname === nestedItem.href;
                                    return (
                                      <Link
                                        key={nestedItem.href}
                                        href={nestedItem.href}
                                        className={cn(
                                          'flex items-center rounded-lg py-2 px-3 text-xs transition-colors',
                                          isNestedActive
                                            ? 'bg-[#8B1538] text-white font-medium'
                                            : 'text-gray-500 hover:bg-gray-200'
                                        )}
                                      >
                                        <span>{nestedItem.title}</span>
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
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t p-3">
        <button
          onClick={logout}
          className={cn(
            "flex w-full items-center rounded-lg py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200",
            isCollapsed ? 'justify-center px-2' : 'space-x-3 px-3'
          )}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
