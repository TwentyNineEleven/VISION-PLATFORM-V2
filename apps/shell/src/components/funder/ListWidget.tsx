'use client';

import * as React from 'react';
import Image from 'next/image';
import { GlowCard, GlowCardContent } from '@/components/glow-ui/GlowCard';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { MoreVertical, Users as UsersIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ListItem {
  id: string;
  name: string;
  avatar?: string;
  progress?: number;
  value?: string;
}

interface ListWidgetProps {
  title: string;
  items: ListItem[];
  onViewAll?: () => void;
  className?: string;
}

export function ListWidget({ title, items, onViewAll, className }: ListWidgetProps) {
  return (
    <GlowCard variant="default" padding="md" className={cn('h-full', className)}>
      <GlowCardContent className="flex flex-col gap-0 p-0">
        <div className="flex items-start justify-between pb-1 pt-0">
          <div className="flex flex-1 gap-2.5 items-center min-h-[32px]">
            <div className="flex flex-1 gap-2.5 items-start min-w-0">
              <div className="bg-primary/10 border border-primary/20 rounded-md shrink-0 size-6 flex items-center justify-center">
                <UsersIcon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex flex-1 flex-col gap-0.5 items-start justify-center min-w-0 self-stretch">
                <p className="text-sm font-medium text-muted-foreground overflow-ellipsis overflow-hidden whitespace-nowrap w-full">
                  {title}
                </p>
              </div>
            </div>
          </div>
          <button className="p-2 rounded-md hover:bg-accent transition-colors">
            <MoreVertical className="w-4 h-4 text-foreground" />
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-0 items-start min-h-0 overflow-hidden py-3 w-full">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex h-16 items-center justify-between px-0 py-2.5 w-full"
            >
              <div className="flex flex-1 gap-4 items-center min-w-0">
                <div className="flex flex-col gap-2.25 items-start justify-center">
                  <div className="relative rounded-full shrink-0 size-8 overflow-hidden bg-primary/10">
                    {item.avatar && typeof item.avatar === 'string' && item.avatar.startsWith('http') ? (
                      <Image
                        src={item.avatar}
                        alt={item.name}
                        fill
                        sizes="32px"
                        className="object-cover rounded-full pointer-events-none"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          {item.name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-1 flex-col items-start justify-center min-w-0">
                  <p className="text-sm font-medium text-foreground whitespace-pre-wrap w-full">
                    {item.name}
                  </p>
                  {item.progress !== undefined && (
                    <div className="flex gap-4 items-center justify-end w-full">
                      <div className="flex flex-1 flex-col gap-2.5 items-start justify-center min-w-0">
                        <div className="bg-muted h-1 relative rounded-full w-full">
                          <div
                            className="bg-primary h-full rounded-full"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2.5 items-start justify-center w-12">
                        <p className="text-sm font-medium text-foreground whitespace-pre-wrap w-full">
                          {item.value || `${item.progress}%`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {onViewAll && (
          <div className="flex gap-2.5 items-start w-full">
            <GlowButton variant="outline" size="sm" onClick={onViewAll} className="w-full">
              View all
            </GlowButton>
          </div>
        )}
      </GlowCardContent>
    </GlowCard>
  );
}

