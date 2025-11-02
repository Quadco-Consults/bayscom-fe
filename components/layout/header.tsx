'use client';

import { Bell } from 'lucide-react';

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      {/* Page Title or Breadcrumbs can be added here by individual pages */}
      <div className="flex flex-1 items-center space-x-4">
        {/* This space is reserved for page-specific content */}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        <button className="relative rounded-full p-2 hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-600"></span>
        </button>
      </div>
    </header>
  );
}
