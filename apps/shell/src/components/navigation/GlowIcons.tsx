/**
 * Glow UI Icon Components
 * 
 * Maps Glow UI icon names to Lucide React icons
 * Matches the exact icon styles from Figma designs
 */

import React from 'react';
import {
  Home,
  Layers3,
  MessageSquare,
  UploadCloud,
  Settings,
  HelpCircle,
  Menu,
  X,
  ChevronRight,
  Search,
  Bell,
  MoreVertical,
  Crown,
  Handshake,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface GlowIconProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  'house-light': Home,
  'layers-3-light': Layers3,
  'message-bubble-light': MessageSquare,
  'cloud-arrow-up-light': UploadCloud,
  'gear-light': Settings,
  'question-circle-light': HelpCircle,
  'line-3-light': Menu,
  'bell-light': Bell,
  'dots-9-light': MoreVertical,
  'crown-light': Crown,
  'handshake-light': Handshake,
};

export function GlowIcon({ name, size = 20, className, color }: GlowIconProps) {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Glow icon "${name}" not found`);
    return null;
  }

  return (
    <IconComponent
      size={size}
      className={cn(className)}
      style={color ? { color } : undefined}
    />
  );
}

