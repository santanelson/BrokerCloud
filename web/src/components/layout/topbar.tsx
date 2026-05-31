'use client'

import { cn, getInitials } from '@/lib/utils'
import { useAuthStore } from '@/lib/stores/auth-store'

interface TopBarProps {
  title?: string
  children?: React.ReactNode
}

export function TopBar({ title, children }: TopBarProps) {
  const user = useAuthStore((s) => s.user)

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 h-16 px-8 bg-surface/80 backdrop-blur-md border-b border-outline-variant">
      {title && (
        <h2 className="font-manrope font-bold text-on-surface text-base">{title}</h2>
      )}

      {/* Global Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar leads, imóveis ou conversas..."
            className={cn(
              'w-full h-9 bg-surface-container-low border border-outline-variant rounded-full',
              'pl-10 pr-4 text-body-sm text-on-surface placeholder:text-on-surface-variant',
              'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary',
              'transition-all duration-200'
            )}
          />
        </div>
      </div>

      <div className="flex items-center gap-1 ml-auto">
        {children}

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all"
          title="Notificações"
        >
          <span className="material-symbols-outlined text-xl">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error border border-surface animate-pulse" />
        </button>

        {/* Help */}
        <button
          className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all"
          title="Ajuda"
        >
          <span className="material-symbols-outlined text-xl">help_outline</span>
        </button>

        <div className="w-px h-6 bg-outline-variant mx-2" />

        {/* User */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right">
            <p className="text-body-sm font-semibold text-on-surface">{user?.name || ''}</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{user?.role || ''}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs font-manrope group-hover:border-primary transition-colors">
            {user ? getInitials(user.name) : '??'}
          </div>
        </div>
      </div>
    </header>
  )
}
