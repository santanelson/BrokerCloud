'use client'

import { useState, useEffect } from 'react'
import { cn, getInitials } from '@/lib/utils'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'

type NavItem = {
  href?: string
  icon: string
  label: string
  filled?: boolean
  subItems?: { href: string; label: string }[]
}

const navItems: NavItem[] = [
  { href: '/dashboard', icon: 'dashboard', label: 'Dashboard', filled: true },
  { 
    icon: 'person_search', 
    label: 'Leads',
    subItems: [
      { href: '/leads', label: 'Lista' },
      { href: '/leads/pipeline', label: 'Pipeline' }
    ]
  },
  { href: '/chat', icon: 'chat_bubble', label: 'Conversas' },
  { href: '/imoveis', icon: 'home_work', label: 'Imóveis' },
  { href: '/tarefas', icon: 'task_alt', label: 'Tarefas' },
]

const bottomItems = [
  { href: '/configuracoes', icon: 'settings', label: 'Configurações' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()
  
  // Keep track of which dropdowns are open
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    'Leads': pathname.startsWith('/leads')
  })

  // Update open dropdowns when pathname changes to ensure active route is visible
  useEffect(() => {
    if (pathname.startsWith('/leads')) {
      setOpenDropdowns(prev => ({ ...prev, 'Leads': true }))
    }
  }, [pathname])

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const toggleDropdown = (label: string) => {
    setOpenDropdowns(prev => ({ ...prev, [label]: !prev[label] }))
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col bg-surface-container-low border-r border-outline-variant z-40">
      {/* Logo */}
      <div className="px-6 py-6 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-container rounded-lg flex items-center justify-center shrink-0">
            <span
              className="material-symbols-outlined text-on-primary-container text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              domain
            </span>
          </div>
          <div>
            <h1 className="font-manrope font-bold text-primary text-base leading-tight">
              BrokerCloud
            </h1>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold">
              CRM Pro
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          if (item.subItems) {
            const isActiveParent = item.subItems.some(sub => pathname === sub.href)
            const isOpen = openDropdowns[item.label]

            return (
              <div key={item.label} className="space-y-0.5">
                <button
                  onClick={() => toggleDropdown(item.label)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm font-inter font-medium transition-all duration-200 group',
                    isActiveParent && !isOpen
                      ? 'bg-primary/5 text-primary'
                      : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
                  )}
                >
                  <span
                    className={cn(
                      'material-symbols-outlined text-xl transition-all',
                      isActiveParent ? 'text-primary' : 'text-on-surface-variant group-hover:text-on-surface'
                    )}
                    style={isActiveParent ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1 text-left">{item.label}</span>
                  <span className={cn(
                    'material-symbols-outlined text-sm transition-transform duration-200',
                    isOpen ? 'rotate-180' : ''
                  )}>
                    expand_more
                  </span>
                </button>
                
                {/* Sub Items */}
                <div className={cn(
                  'overflow-hidden transition-all duration-200 ease-in-out',
                  isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                )}>
                  <div className="pl-11 pr-3 py-1 space-y-0.5 border-l-2 border-outline-variant/30 ml-6">
                    {item.subItems.map(sub => {
                      const active = pathname === sub.href
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={cn(
                            'block w-full text-left px-3 py-2 rounded-lg text-[13px] font-inter font-medium transition-all duration-200',
                            active
                              ? 'bg-primary/10 text-primary font-semibold'
                              : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
                          )}
                        >
                          {sub.label}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          }

          // Normal Item
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'))
          return (
            <Link
              key={item.href}
              href={item.href!}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm font-inter font-medium transition-all duration-200 group',
                active
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
              )}
            >
              <span
                className={cn(
                  'material-symbols-outlined text-xl transition-all',
                  active ? 'text-primary' : 'text-on-surface-variant group-hover:text-on-surface'
                )}
                style={
                  active || item.filled
                    ? { fontVariationSettings: "'FILL' 1" }
                    : undefined
                }
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 pt-2 border-t border-outline-variant mt-2 space-y-0.5">
        {bottomItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm font-inter font-medium transition-all duration-200',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
              )}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}

        {/* User Profile */}
        <div className="mt-3 p-3 rounded-lg bg-surface-container-high flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs font-manrope">
            {user ? getInitials(user.name) : '??'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-body-sm font-semibold text-on-surface truncate">{user?.name || 'Carregando...'}</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{user?.role || ''}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-on-surface-variant hover:text-error transition-colors"
            title="Sair"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
