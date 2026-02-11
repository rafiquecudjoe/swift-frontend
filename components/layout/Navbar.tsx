'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold text-primary-600">
              Swift Transport
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user.fullName}</p>
                  <p className="text-gray-500">{user.role}</p>
                </div>
                <Button variant="ghost" onClick={logout}>
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
