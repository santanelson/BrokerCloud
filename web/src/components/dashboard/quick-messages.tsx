'use client'

import { formatRelativeTime } from '@/lib/utils'
import { useConversations } from '@/lib/hooks'
import type { Conversation } from '@/types'

export function QuickMessages() {
  const { data, isLoading } = useConversations({ limit: 4 })
  const conversations = data?.data ?? []

  const unreadTotal = conversations.reduce((acc: number, c: Conversation) => acc + c.unreadCount, 0)

  return (
    <div className="bg-surface-container rounded-xl p-4 border border-outline-variant flex flex-col flex-1">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-body-sm font-bold text-on-surface">Mensagens</h3>
        {unreadTotal > 0 && (
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {unreadTotal} NOVA{unreadTotal > 1 ? 'S' : ''}
          </span>
        )}
      </div>

      <div className="space-y-1 flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : conversations.length === 0 ? (
          <p className="text-[10px] text-on-surface-variant text-center py-4">Nenhuma conversa recente.</p>
        ) : (
          conversations.map((conv: Conversation) => {
            const lastMsg = (conv as any).messages?.[0]
            const name = conv.lead?.name || conv.whatsappJid
            return (
              <div
                key={conv.id}
                className="flex gap-2.5 items-center p-2 rounded-lg hover:bg-surface-container-highest transition-colors cursor-pointer"
              >
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold font-manrope">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary border border-surface-container" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-on-surface truncate">{name}</p>
                    {conv.lastMessageAt && (
                      <span className="text-[9px] text-on-surface-variant shrink-0 ml-2">
                        {formatRelativeTime(conv.lastMessageAt)}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-on-surface-variant truncate">
                    {lastMsg?.content || 'Sem mensagens'}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>

      <a
        href="/chat"
        className="block mt-2 text-center text-primary text-[10px] font-bold hover:underline pt-2 border-t border-outline-variant"
      >
        Ver todas as conversas →
      </a>
    </div>
  )
}
