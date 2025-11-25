/**
 * Keyboard Navigation Hook
 * Provides keyboard shortcuts and navigation for accessibility
 */

import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

// ============================================================================
// TYPES
// ============================================================================

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  description: string;
  action: () => void;
}

export interface UseKeyboardNavigationOptions {
  shortcuts?: KeyboardShortcut[];
  enableArrowNavigation?: boolean;
  enableEscapeClose?: boolean;
  onEscape?: () => void;
  disabled?: boolean;
}

// ============================================================================
// HOOK
// ============================================================================

export function useKeyboardNavigation(options: UseKeyboardNavigationOptions = {}) {
  const {
    shortcuts = [],
    enableArrowNavigation = false,
    enableEscapeClose = false,
    onEscape,
    disabled = false,
  } = options;

  const router = useRouter();
  const focusableElementsRef = useRef<HTMLElement[]>([]);
  const currentFocusIndex = useRef(0);

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (disabled) return;

      // Don't trigger shortcuts when typing in input fields
      const target = event.target as HTMLElement;
      const isInputField =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;

      // Handle Escape key
      if (event.key === 'Escape' && enableEscapeClose) {
        event.preventDefault();
        onEscape?.();
        return;
      }

      // Handle custom shortcuts
      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = !!shortcut.ctrlKey === (event.ctrlKey || event.metaKey);
        const shiftMatch = !!shortcut.shiftKey === event.shiftKey;
        const altMatch = !!shortcut.altKey === event.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          // Allow shortcuts with modifiers even in input fields
          if (isInputField && !shortcut.ctrlKey && !shortcut.altKey && !shortcut.metaKey) {
            continue;
          }
          event.preventDefault();
          shortcut.action();
          return;
        }
      }

      // Arrow key navigation (only when not in input fields)
      if (enableArrowNavigation && !isInputField) {
        handleArrowNavigation(event);
      }
    },
    [disabled, shortcuts, enableEscapeClose, onEscape, enableArrowNavigation]
  );

  // Arrow key navigation through focusable elements
  const handleArrowNavigation = useCallback((event: KeyboardEvent) => {
    const focusableElements = focusableElementsRef.current;
    if (focusableElements.length === 0) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      currentFocusIndex.current = (currentFocusIndex.current + 1) % focusableElements.length;
      focusableElements[currentFocusIndex.current]?.focus();
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      currentFocusIndex.current =
        (currentFocusIndex.current - 1 + focusableElements.length) % focusableElements.length;
      focusableElements[currentFocusIndex.current]?.focus();
    } else if (event.key === 'Home') {
      event.preventDefault();
      currentFocusIndex.current = 0;
      focusableElements[0]?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      currentFocusIndex.current = focusableElements.length - 1;
      focusableElements[focusableElements.length - 1]?.focus();
    }
  }, []);

  // Update focusable elements list
  const updateFocusableElements = useCallback((container: HTMLElement | null) => {
    if (!container) {
      focusableElementsRef.current = [];
      return;
    }

    const selector = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    focusableElementsRef.current = Array.from(container.querySelectorAll(selector));
  }, []);

  // Set up event listeners
  useEffect(() => {
    if (disabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, disabled]);

  return {
    updateFocusableElements,
    focusFirst: () => focusableElementsRef.current[0]?.focus(),
    focusLast: () => focusableElementsRef.current[focusableElementsRef.current.length - 1]?.focus(),
  };
}

// ============================================================================
// COMMUNITY PULSE SPECIFIC SHORTCUTS
// ============================================================================

export interface UseCommunityPulseShortcutsOptions {
  engagementId?: string;
  currentStage?: number;
  onSave?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  disabled?: boolean;
}

/**
 * CommunityPulse-specific keyboard shortcuts
 */
export function useCommunityPulseShortcuts(options: UseCommunityPulseShortcutsOptions = {}) {
  const { engagementId, currentStage, onSave, onNext, onPrevious, disabled = false } = options;

  const router = useRouter();

  const shortcuts: KeyboardShortcut[] = [
    // Save shortcut
    {
      key: 's',
      ctrlKey: true,
      description: 'Save current progress',
      action: () => {
        onSave?.();
      },
    },
    // Navigate to next stage
    {
      key: 'ArrowRight',
      altKey: true,
      description: 'Go to next stage',
      action: () => {
        if (onNext) {
          onNext();
        } else if (engagementId && currentStage && currentStage < 7) {
          router.push(`/community-pulse/${engagementId}/stage/${currentStage + 1}`);
        }
      },
    },
    // Navigate to previous stage
    {
      key: 'ArrowLeft',
      altKey: true,
      description: 'Go to previous stage',
      action: () => {
        if (onPrevious) {
          onPrevious();
        } else if (engagementId && currentStage && currentStage > 1) {
          router.push(`/community-pulse/${engagementId}/stage/${currentStage - 1}`);
        }
      },
    },
    // Go to dashboard
    {
      key: 'd',
      ctrlKey: true,
      shiftKey: true,
      description: 'Go to dashboard',
      action: () => {
        router.push('/community-pulse');
      },
    },
    // Go to engagement overview
    {
      key: 'o',
      ctrlKey: true,
      shiftKey: true,
      description: 'Go to engagement overview',
      action: () => {
        if (engagementId) {
          router.push(`/community-pulse/${engagementId}`);
        }
      },
    },
    // Open methods library
    {
      key: 'm',
      ctrlKey: true,
      shiftKey: true,
      description: 'Open methods library',
      action: () => {
        router.push('/community-pulse/methods');
      },
    },
    // Open templates
    {
      key: 't',
      ctrlKey: true,
      shiftKey: true,
      description: 'Open templates',
      action: () => {
        router.push('/community-pulse/templates');
      },
    },
    // Create new engagement
    {
      key: 'n',
      ctrlKey: true,
      shiftKey: true,
      description: 'Create new engagement',
      action: () => {
        router.push('/community-pulse/new');
      },
    },
  ];

  const { updateFocusableElements, focusFirst, focusLast } = useKeyboardNavigation({
    shortcuts,
    enableEscapeClose: true,
    onEscape: () => {
      // Close any open modals or go back
      if (engagementId) {
        router.push(`/community-pulse/${engagementId}`);
      } else {
        router.push('/community-pulse');
      }
    },
    disabled,
  });

  return {
    shortcuts,
    updateFocusableElements,
    focusFirst,
    focusLast,
  };
}

// ============================================================================
// KEYBOARD SHORTCUTS HELP
// ============================================================================

/**
 * Get formatted keyboard shortcuts for display
 */
export function getShortcutDisplay(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];

  if (shortcut.ctrlKey) {
    parts.push(navigator.platform.includes('Mac') ? '⌘' : 'Ctrl');
  }
  if (shortcut.altKey) {
    parts.push(navigator.platform.includes('Mac') ? '⌥' : 'Alt');
  }
  if (shortcut.shiftKey) {
    parts.push('⇧');
  }

  // Format special keys
  const keyMap: Record<string, string> = {
    ArrowRight: '→',
    ArrowLeft: '←',
    ArrowUp: '↑',
    ArrowDown: '↓',
    Enter: '↵',
    Escape: 'Esc',
    ' ': 'Space',
  };

  parts.push(keyMap[shortcut.key] || shortcut.key.toUpperCase());

  return parts.join(' + ');
}

/**
 * Component to display keyboard shortcuts help
 */
export function formatShortcutsHelp(shortcuts: KeyboardShortcut[]): Array<{
  shortcut: string;
  description: string;
}> {
  return shortcuts.map((s) => ({
    shortcut: getShortcutDisplay(s),
    description: s.description,
  }));
}
