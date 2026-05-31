'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { cn, formatRelativeTime } from '@/lib/utils'
import { useConversations, useMessages, useSendMessage } from '@/lib/hooks'
import type { Conversation, Message } from '@/types'

export default function ChatPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [messageText, setMessageText] = useState('')

  const { data: convData, isLoading: convLoading } = useConversations()
  const conversations = convData?.data ?? []

  const { data: msgData, isLoading: msgLoading } = useMessages(selectedId)
  const messages = useMemo(() => msgData?.data ?? [], [msgData])

  const sendMessage = useSendMessage()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!messageText.trim() || !selectedId) return
    await sendMessage.mutateAsync({ conversationId: selectedId, content: messageText })
    setMessageText('')
  }

  const selected = conversations.find((c: Conversation) => c.id === selectedId)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-manrope font-bold text-headline-lg text-on-surface">Conversas</h2>
        <p className="text-body-sm text-on-surface-variant mt-1">Gerencie suas conversas do WhatsApp.</p>
      </div>

      <div className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden flex" style={{ height: 'calc(100vh - 220px)' }}>
        {/* Conversation List */}
        <div className="w-80 border-r border-outline-variant flex flex-col shrink-0">
          <div className="p-3 border-b border-outline-variant">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
              <input type="text" placeholder="Buscar conversa..." className="w-full h-9 bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-4 text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-all" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {convLoading ? (
              <div className="flex items-center justify-center py-10"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-on-surface-variant px-4 text-center">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-40">chat_bubble</span>
                <p className="text-body-sm">Nenhuma conversa ainda.</p>
                <p className="text-[11px] mt-1">Conversas aparecerão aqui quando o WhatsApp estiver conectado.</p>
              </div>
            ) : (
              conversations.map((conv: Conversation) => {
                const lastMsg = (conv as any).messages?.[0]
                return (
                  <button key={conv.id} onClick={() => setSelectedId(conv.id)}
                    className={cn(
                      'w-full p-3 flex items-center gap-3 text-left border-b border-outline-variant/30 transition-all hover:bg-surface-container-highest',
                      selectedId === conv.id && 'bg-primary/5 border-l-2 border-l-primary'
                    )}>
                    <Avatar name={conv.lead?.name || conv.whatsappJid} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-body-sm font-semibold text-on-surface truncate">{conv.lead?.name || conv.whatsappJid}</p>
                        {conv.lastMessageAt && <span className="text-[10px] text-on-surface-variant shrink-0">{formatRelativeTime(conv.lastMessageAt)}</span>}
                      </div>
                      <p className="text-[11px] text-on-surface-variant truncate mt-0.5">
                        {lastMsg?.content || 'Sem mensagens'}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {!selectedId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-6xl mb-4 opacity-20">forum</span>
              <p className="text-body-md font-semibold">Selecione uma conversa</p>
              <p className="text-body-sm mt-1">Clique em uma conversa para ver as mensagens.</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-4 border-b border-outline-variant flex items-center gap-3">
                <Avatar name={selected?.lead?.name || selected?.whatsappJid || ''} size="sm" />
                <div className="flex-1">
                  <p className="text-body-sm font-semibold text-on-surface">{selected?.lead?.name || selected?.whatsappJid}</p>
                  <p className="text-[11px] text-on-surface-variant">{selected?.lead?.phone || selected?.whatsappJid}</p>
                </div>
                {selected?.broker && (
                  <span className="text-[10px] text-on-surface-variant bg-surface-container-highest px-2 py-0.5 rounded-full border border-outline-variant">
                    👤 {selected.broker.name}
                  </span>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                {msgLoading ? (
                  <div className="flex items-center justify-center py-10"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-on-surface-variant">
                    <p className="text-body-sm">Nenhuma mensagem nesta conversa.</p>
                  </div>
                ) : (
                  messages.map((msg: Message) => (
                    <div key={msg.id} className={cn('flex', msg.direction === 'out' ? 'justify-end' : 'justify-start')}>
                      <div className={cn(
                        'max-w-[70%] px-4 py-2.5 rounded-2xl text-body-sm',
                        msg.direction === 'out'
                          ? 'bg-primary/20 text-on-surface rounded-br-md'
                          : 'bg-surface-container-highest text-on-surface rounded-bl-md'
                      )}>
                        <p>{msg.content}</p>
                        <div className={cn('flex items-center gap-1 mt-1', msg.direction === 'out' ? 'justify-end' : '')}>
                          <span className="text-[9px] text-on-surface-variant">
                            {new Date(msg.sentAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {msg.direction === 'out' && (
                            <span className={cn('material-symbols-outlined text-xs', msg.status === 'read' ? 'text-primary' : 'text-on-surface-variant')}>
                              {msg.status === 'read' ? 'done_all' : msg.status === 'delivered' ? 'done_all' : 'done'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-outline-variant flex items-center gap-3">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="Digite uma mensagem..."
                  className="flex-1 h-10 bg-surface-container-lowest border border-outline-variant rounded-full px-4 text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
                <Button variant="primary" size="icon" onClick={handleSend} disabled={!messageText.trim() || sendMessage.isPending}>
                  <span className="material-symbols-outlined text-lg">send</span>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
