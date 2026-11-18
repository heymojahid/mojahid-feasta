'use client';

import { Instagram } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  username?: string;
  className?: string;
  theme?: 'light' | 'dark';
  compact?: boolean;
}

export default function InstagramLink({
  username = 'heymojahid',
  className,
  theme,
  compact = false,
}: Props) {
  const isLight = theme === 'light';
  const isDark = theme === 'dark';

  return (
    <a
      href={`https://instagram.com/${username}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group inline-flex items-center gap-1.5 rounded-xl border transition-all text-xs font-semibold px-2.5 py-1.5 shadow-sm',
        isLight && 'bg-white text-stone-800 hover:text-pink-600 hover:bg-stone-50 border-stone-200/90 shadow-stone-200/50',
        isDark && 'bg-neutral-900/90 text-neutral-200 hover:text-pink-400 hover:bg-neutral-800/90 border-neutral-800 shadow-black/40',
        !theme && 'bg-white dark:bg-neutral-900/90 text-stone-800 dark:text-neutral-200 hover:text-pink-600 dark:hover:text-pink-400 border-stone-200/90 dark:border-neutral-800',
        className
      )}
      title={`Follow @${username} on Instagram`}
      aria-label={`Follow @${username} on Instagram`}
    >
      <Instagram
        className="w-4 h-4 text-pink-500 transition-transform duration-200 group-hover:scale-110"
        aria-hidden="true"
      />
      {!compact && (
        <span className="truncate">@{username}</span>
      )}
    </a>
  );
}
