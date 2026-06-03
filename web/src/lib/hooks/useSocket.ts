import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '../stores/auth-store'
import { api } from '../api'

export function useSocket() {
  const socketRef = useRef<Socket | null>(null)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  
  useEffect(() => {
    if (!isAuthenticated) return
    const token = api.getAccessToken()
    if (!token) return

    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    
    const socket = io(url, {
      auth: { token },
      transports: ['websocket', 'polling'],
    })

    socket.on('connect', () => {
      console.log('Connected to real-time chat server')
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from real-time chat server')
    })

    socketRef.current = socket

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [isAuthenticated])

  return socketRef.current
}
