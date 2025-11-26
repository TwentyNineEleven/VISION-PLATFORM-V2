'use client';

import React from 'react';
import { Users, MoreVertical, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { GlowButton } from '@/components/glow-ui';

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  progress: number; // 0-100
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Cameron Smith',
    avatar: 'https://i.pravatar.cc/150?img=1',
    progress: 99,
  },
  {
    id: '2',
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=2',
    progress: 78,
  },
  {
    id: '3',
    name: 'Will Smith',
    avatar: 'https://i.pravatar.cc/150?img=3',
    progress: 72,
  },
  {
    id: '4',
    name: 'Jordan Smith',
    avatar: 'https://i.pravatar.cc/150?img=4',
    progress: 26,
  },
  {
    id: '5',
    name: 'Eleanor Pena',
    avatar: 'https://i.pravatar.cc/150?img=5',
    progress: 25,
  },
];

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-blue-600 rounded-full transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function TeamMemberItem({ member }: { member: TeamMember }) {
  return (
    <div className="flex items-center gap-4 py-2.5">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="shrink-0">
          <Image
            src={member.avatar}
            alt={member.name}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
          <div className="flex items-center gap-4 mt-1">
            <ProgressBar progress={member.progress} />
            <span className="text-sm font-medium text-gray-900 shrink-0 w-12 text-right">
              {member.progress}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TeamListWidget() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4 h-[456px] w-[280px] shrink-0">
      {/* Header */}
        <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="w-6 h-6 bg-blue-50 border border-blue-200 rounded-md flex items-center justify-center shrink-0 text-blue-600">
            <Users className="w-4 h-4" />
          </div>
          <p className="text-sm font-medium text-gray-600 truncate">Your team</p>
        </div>
        <GlowButton
          variant="ghost"
          size="icon"
          glow="none"
          className="text-gray-500 hover:text-gray-700 shrink-0"
          aria-label="More team settings"
        >
          <MoreVertical className="w-4 h-4" />
        </GlowButton>
      </div>

      {/* Team Members List */}
      <div className="flex-1 overflow-y-auto py-3">
        <div className="space-y-0">
          {mockTeamMembers.map((member) => (
            <TeamMemberItem key={member.id} member={member} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div>
        <GlowButton
          variant="outline"
          size="sm"
          className="w-full flex items-center justify-center gap-2 text-sm font-medium"
        >
          View all
          <ChevronRight className="w-4 h-4" />
        </GlowButton>
      </div>
    </div>
  );
}
