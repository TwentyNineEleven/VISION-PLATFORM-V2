'use client';

import { User } from 'lucide-react';
import Image from 'next/image';

interface UserMenuProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  return (
    <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
      {user.avatar ? (
        <Image
          src={user.avatar}
          alt={user.name}
          width={32}
          height={32}
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <User className="w-5 h-5 text-blue-600" />
        </div>
      )}
      <div className="hidden md:block text-left">
        <p className="text-sm font-medium text-gray-900">{user.name}</p>
        <p className="text-xs text-gray-500">{user.role}</p>
      </div>
    </button>
  );
}
